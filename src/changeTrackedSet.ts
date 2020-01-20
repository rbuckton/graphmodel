/*!
 * Copyright 2020 Ron Buckton
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ChangeTrackedObject, GraphTransactionScope, ChangeTracker, ChangedTrackedParent } from "./graphTransactionScope";
import { Disposable } from "@esfx/disposable";
import { emptyIterable } from "./utils";

/* @internal */
export class ChangeTrackedSet<T> implements ChangeTrackedObject<SetChangeTracker<T>> {
    private _set?: Set<T>;
    private _parent: unknown;

    constructor(parent: unknown) {
        this._parent = parent;
    }

    get size(): number {
        const changeTracker = GraphTransactionScope._getChangeTracker(this);
        return (this._set?.size ?? 0) +
            (changeTracker?.addedItemsSize ?? 0) -
            (changeTracker?.deletedItemsSize ?? 0);
    }

    has(value: T): boolean {
        const changeTracker = GraphTransactionScope._getChangeTracker(this);
        return (this._set?.has(value) ?? false)
            && !(changeTracker?.isDeleted(value) ?? false)
            || (changeTracker?.isAdded(value) ?? false);
    }

    add(value: T): this {
        if (!this.has(value)) {
            Disposable.use(new GraphTransactionScope(), scope => {
                GraphTransactionScope._getOrCreateChangeTracker(this).add(value);
                scope.complete();
            });
        }
        return this;
    }

    delete(value: T): boolean {
        if (this.has(value)) {
            return Disposable.use(new GraphTransactionScope(), scope => {
                GraphTransactionScope._getOrCreateChangeTracker(this).delete(value);
                scope.complete();
                return true;
            });
        }
        return false;
    }

    clear(): void {
        Disposable.use(new GraphTransactionScope(), scope => {
            const changeTracker = GraphTransactionScope._getOrCreateChangeTracker(this);
            for (const value of [...this]) {
                changeTracker.delete(value);
            }
            scope.complete();
        });
    }

    forEach(callbackfn: (value: T, value2: T, set: ChangeTrackedSet<T>) => void, thisArg?: any): void {
        for (const value of [...this]) {
            callbackfn.call(thisArg, value, value, this);
        }
    }

    * entries(): IterableIterator<[T, T]> {
        yield * SetChangeTracker.coalesce(this, this._set, s => s);
    }

    * keys(): IterableIterator<T> {
        yield * SetChangeTracker.coalesce(this, this._set, ([key]) => key);
    }

    * values(): IterableIterator<T> {
        yield * SetChangeTracker.coalesce(this, this._set, ([, value]) => value);
    }

    * [Symbol.iterator](): IterableIterator<T> {
        yield * SetChangeTracker.coalesce(this, this._set, ([, value]) => value);
    }

    [ChangeTrackedObject.createChangeTracker](): SetChangeTracker<T> {
        return new SetChangeTracker();
    }

    [ChangeTrackedObject.prepareChanges](changeTracker: SetChangeTracker<T>): void {
    }

    [ChangeTrackedObject.commitChanges](changeTracker: SetChangeTracker<T>): void {
        if (this._set !== undefined) {
            for (const item of changeTracker.addedItems()) {
                this._set.add(item);
            }
            for (const item of changeTracker.deletedItems()) {
                this._set.delete(item);
            }
        }
        else {
            this._set = new Set(changeTracker.addedItems());
        }
        if (ChangedTrackedParent.hasInstance(this._parent)) {
            this._parent[ChangedTrackedParent.committed](changeTracker);
        }
    }

    [ChangeTrackedObject.rollbackChanges](changeTracker: SetChangeTracker<T>): void {
        if (ChangedTrackedParent.hasInstance(this._parent)) {
            this._parent[ChangedTrackedParent.rolledBack](changeTracker);
        }
    }
}

class SetChangeTracker<T> implements ChangeTracker {
    private _added?: Set<T>;
    private _deleted?: Set<T>;

    get addedItemsSize() {
        return this._added?.size ?? 0;
    }

    get deletedItemsSize() {
        return this._deleted?.size ?? 0;
    }

    addedItems(): IterableIterator<T> {
        return this._added?.[Symbol.iterator]() ?? emptyIterable;
    }

    deletedItems(): IterableIterator<T> {
        return this._deleted?.[Symbol.iterator]() ?? emptyIterable;
    }

    add(value: T) {
        if (!this._deleted?.delete(value)) {
            if (this._added === undefined) {
                this._added = new Set();
            }
            this._added.add(value);
        }
    }

    delete(value: T) {
        if (!this._added?.delete(value)) {
            if (this._deleted === undefined) {
                this._deleted = new Set();
            }
            this._deleted.add(value);
        }
    }

    isAdded(value: T): boolean {
        return this._added?.has(value) ?? false;
    }

    isDeleted(value: T): boolean {
        return this._deleted?.has(value) ?? false;
    }

    isChanged(value: T): boolean {
        return this.isDeleted(value) || this.isAdded(value);
    }

    static coalesce<T, U>(trackedSet: ChangeTrackedSet<T>, set: Set<T> | undefined, valueSelector: (obj: [T, T]) => U) {
        const changeTracker = GraphTransactionScope._getChangeTracker(trackedSet);
        const result: U[] = [];
        if (changeTracker !== undefined) {
            if (set !== undefined) {
                for (const pair of set.entries()) {
                    if (!changeTracker.isDeleted(pair[0])) {
                        result.push(valueSelector(pair));
                    }
                }
            }
            if (changeTracker._added !== undefined) {
                for (const pair of changeTracker._added.entries()) {
                    result.push(valueSelector(pair));
                }
            }
        }
        else {
            if (set !== undefined) {
                for (const pair of set.entries()) {
                    result.push(valueSelector(pair));
                }
            }
        }
        return result;
    }
}
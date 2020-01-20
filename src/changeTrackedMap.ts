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
export class ChangeTrackedMap<K, V> implements ChangeTrackedObject<MapChangeTracker<K, V>> {
    private _map?: Map<K, V>;
    private _cachedSize?: number;
    private _parent: unknown;

    constructor(parent: unknown) {
        this._parent = parent;
    }

    get size(): number {
        if (this._cachedSize === undefined) {
            const changeTracker = GraphTransactionScope._getChangeTracker(this);
            if (changeTracker !== undefined && (changeTracker.addedItemsSize || changeTracker.deletedItemsSize)) {
                if (this._map !== undefined) {
                    let size = 0;
                    for (const _ of this.values()) {
                        size++;
                    }
                    return this._cachedSize = size;
                }
                return changeTracker.addedItemsSize;
            }
            return this._map?.size ?? 0;
        }
        return this._cachedSize;
    }

    has(key: K): boolean {
        const changeTracker = GraphTransactionScope._getChangeTracker(this);
        return (this._map?.has(key) ?? false)
            && !(changeTracker?.isDeleted(key) ?? false)
            || (changeTracker?.isAdded(key) ?? false);
    }

    get(key: K): V | undefined {
        const changeTracker = GraphTransactionScope._getChangeTracker(this);
        if (this._map?.has(key)) {
            if (!changeTracker?.isDeleted(key)) {
                return this._map?.get(key);
            }
        }
        else {
            return changeTracker?.get(key);
        }
    }

    set(key: K, value: V): this {
        Disposable.use(new GraphTransactionScope(), scope => {
            GraphTransactionScope._getOrCreateChangeTracker(this).set(key, value);
            this._invalidateCaches();
            scope.complete();
        });
        return this;
    }

    delete(key: K, value: V): boolean {
        if (this.has(key) && this.get(key) === value) {
            return Disposable.use(new GraphTransactionScope(), scope => {
                GraphTransactionScope._getOrCreateChangeTracker(this).delete(key, value);
                this._invalidateCaches();
                scope.complete();
                return true;
            });
        }
        return false;
    }

    clear(): void {
        Disposable.use(new GraphTransactionScope(), scope => {
            const changeTracker = GraphTransactionScope._getOrCreateChangeTracker(this);
            for (const [key, value] of [...this]) {
                changeTracker.delete(key, value);
            }
            this._invalidateCaches();
            scope.complete();
        });
    }

    forEach(callbackfn: (value: V, key: K, map: ChangeTrackedMap<K, V>) => void, thisArg?: any): void {
        for (const [key, value] of [...this]) {
            callbackfn.call(thisArg, value, key, this);
        }
    }

    * entries(): IterableIterator<[K, V]> {
        yield * MapChangeTracker.coalesce(this, this._map, pair => pair);
    }

    * keys(): IterableIterator<K> {
        yield * MapChangeTracker.coalesce(this, this._map, ([key]) => key);
    }

    * values(): IterableIterator<V> {
        yield * MapChangeTracker.coalesce(this, this._map, ([, value]) => value);
    }

    * [Symbol.iterator](): IterableIterator<[K, V]> {
        yield * MapChangeTracker.coalesce(this, this._map, pair => pair);
    }

    private _invalidateCaches(): void {
        this._cachedSize = undefined;
    }

    [ChangeTrackedObject.createChangeTracker](): MapChangeTracker<K, V> {
        return new MapChangeTracker();
    }

    [ChangeTrackedObject.prepareChanges](changeTracker: MapChangeTracker<K, V>): void {
    }

    [ChangeTrackedObject.commitChanges](changeTracker: MapChangeTracker<K, V>): void {
        this._invalidateCaches();
        if (this._map !== undefined) {
            for (const [key, value] of changeTracker.addedItems()) {
                this._map.set(key, value);
            }
            for (const [key, value] of changeTracker.deletedItems()) {
                if (this._map.has(key) && this._map.get(key) === value) {
                    this._map.delete(key);
                }
            }
        }
        else {
            this._map = new Map(changeTracker.addedItems());
        }
        if (ChangedTrackedParent.hasInstance(this._parent)) {
            this._parent[ChangedTrackedParent.committed](changeTracker);
        }
    }

    [ChangeTrackedObject.rollbackChanges](changeTracker: MapChangeTracker<K, V>): void {
        this._invalidateCaches();
        if (ChangedTrackedParent.hasInstance(this._parent)) {
            this._parent[ChangedTrackedParent.rolledBack](changeTracker);
        }
    }
}

class MapChangeTracker<K, V> implements ChangeTracker {
    private _added?: Map<K, V>;
    private _deleted?: Map<K, V>;

    get addedItemsSize() {
        return this._added?.size ?? 0;
    }

    get deletedItemsSize() {
        return this._deleted?.size ?? 0;
    }

    addedItems(): IterableIterator<[K, V]> {
        return (this._added ?? emptyIterable)[Symbol.iterator]();
    }

    deletedItems(): IterableIterator<[K, V]> {
        return (this._deleted ?? emptyIterable)[Symbol.iterator]();
    }

    set(key: K, value: V) {
        let item: V | undefined;
        if (this._deleted?.has(key) && (item = this._deleted.get(key)) === value) {
            this._deleted.delete(key);
        }
        if (value !== item) {
            if (this._added === undefined) {
                this._added = new Map();
            }
            this._added.set(key, value);
        }
    }

    get(key: K) {
        return this._added?.get(key);
    }

    delete(key: K, value: V) {
        let item: V | undefined;
        if (this._added?.has(key) && (item = this._added.get(key)) === value) {
            this._added.delete(key);
        }
        if (item !== value) {
            if (this._deleted === undefined) {
                this._deleted = new Map();
            }
            this._deleted.set(key, value);
        }
    }

    isAdded(key: K): boolean {
        return this._added?.has(key) ?? false;
    }

    isDeleted(key: K): boolean {
        return this._deleted?.has(key) ?? false;
    }

    isChanged(key: K): boolean {
        return this.isDeleted(key) || this.isAdded(key);
    }

    static coalesce<K, V, U>(trackedMap: ChangeTrackedMap<K, V>, map: Map<K, V> | undefined, valueSelector: (obj: [K, V]) => U) {
        const changeTracker = GraphTransactionScope._getChangeTracker(trackedMap);
        const result: U[] = [];
        if (changeTracker !== undefined) {
            if (map !== undefined) {
                for (const pair of map.entries()) {
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
            if (map !== undefined) {
                for (const pair of map.entries()) {
                    result.push(valueSelector(pair));
                }
            }
        }
        return result;
    }
}
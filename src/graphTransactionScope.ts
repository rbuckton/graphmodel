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

import { Disposable } from "@esfx/disposable";

/**
 * Indicates a scope for transactional changes to a `Graph`.
 */
export class GraphTransactionScope implements Disposable {
    private static _current?: GraphTransactionScope;
    private static _enlistment?: GraphEnlistment;
    private _parent?: GraphTransactionScope;
    private _completed = false;
    private _aborted = false;
    private _disposed = false;

    /**
     * Starts a new graph transaction scope, which allows you to
     * conditionally commit or roll-back changes to a `Graph`.
     */
    constructor() {
        // save the current scope as the parent of this scope
        this._parent = GraphTransactionScope._current;
        // make this scope current
        GraphTransactionScope._current = this;
    }

    /**
     * Marks the scope as successfully completed. When the scope
     * is disposed, changes will be committed.
     */
    setComplete(): void {
        if (this._disposed) {
            throw new ReferenceError();
        }
        if (this._completed) {
            throw new Error();
        }
        if (this._aborted) {
            throw new Error();
        }
        this._completed = true;
    }

    /**
     * Disposes of the scope and indicates changes should be committed
     * (if `setComplete()` was called), or rolled back (if `setComplete` was not
     * called).
     */
    dispose(): void {
        if (this._disposed) {
            return;
        }

        this._disposed = true;

        // If we are not the current scope then the stack has not been set up correctly.
        if (GraphTransactionScope._current !== this) {
            throw new Error();
        }

        // restore the parent scope
        GraphTransactionScope._current = this._parent;
        this._parent = undefined;

        // If we completed successfully and are the top of the scope, commit changes
        if (this._completed) {
            if (GraphTransactionScope._current === undefined) {
                this._commit();
            }
        }
        else {
            // walk the scope chain back to the top and mark the entire chain as aborted and incomplete
            this._aborted = true;
            for (let scope = GraphTransactionScope._current; scope !== undefined; scope = scope._parent) {
                scope._completed = false;
                scope._aborted = true;
            }
            if (GraphTransactionScope._current === undefined) {
                this._rollback();
            }
        }
    }

    /**
     * Disposes of the scope and indicates changes should be committed
     * (if `setComplete()` was called), or rolled back (if `setComplete()` was
     * not called).
     *
     * NOTE: This is an alias for `dispose()`.
     */
    [Disposable.dispose](): void {
        this.dispose();
    }

    /* @internal */ static _getEnlistment() {
        return this._enlistment;
    }

    /* @internal */ static _getOrCreateEnlistment() {
        return this._enlistment ?? (this._enlistment = new GraphEnlistment());
    }

    /* @internal */ static _getChangeTracker<TChangeTracker extends ChangeTracker>(changeTracked: ChangeTrackedObject<TChangeTracker>): TChangeTracker | undefined {
        return this._getEnlistment()?.getChangeTracker(changeTracked);
    }

    /* @internal */ static _getOrCreateChangeTracker<TChangeTracker extends ChangeTracker>(changeTracked: ChangeTrackedObject<TChangeTracker>): TChangeTracker {
        return this._getOrCreateEnlistment().getOrCreateChangeTracker(changeTracked);
    }

    private _commit(): void {
        const enlistment = GraphTransactionScope._getEnlistment();
        GraphTransactionScope._enlistment = undefined;
        if (enlistment !== undefined) {
            try {
                enlistment.prepare();
            }
            catch (e) {
                enlistment.rollback();
                throw e;
            }
            enlistment.commit();
        }
    }

    private _rollback(): void {
        const enlistment = GraphTransactionScope._getEnlistment();
        GraphTransactionScope._enlistment = undefined;
        if (enlistment !== undefined) {
            enlistment.rollback();
        }
    }
}

class GraphEnlistment {
    private _changeTrackers = new Map<ChangeTrackedObject<any>, ChangeTracker>();
    private _preparedChangeTrackers = new Map<ChangeTrackedObject<any>, ChangeTracker>();

    getChangeTracker<TChangeTracker extends ChangeTracker>(changeTracked: ChangeTrackedObject<TChangeTracker>): TChangeTracker | undefined {
        return this._changeTrackers.get(changeTracked) as TChangeTracker | undefined;
    }

    getOrCreateChangeTracker<TChangeTracker extends ChangeTracker>(changeTracked: ChangeTrackedObject<TChangeTracker>) {
        let changeTracker = this.getChangeTracker(changeTracked);
        if (changeTracker === undefined) {
            changeTracker = changeTracked[ChangeTrackedObject.createChangeTracker]();
            this._changeTrackers.set(changeTracked, changeTracker);
        }
        return changeTracker;
    }

    prepare(): void {
        try {
            for (const [tracked, tracker] of this._changeTrackers) {
                tracked[ChangeTrackedObject.prepareChanges](tracker);
                this._preparedChangeTrackers.set(tracked, tracker);
            }
        }
        catch (e) {
            this.clear();
            throw e;
        }
    }

    commit(): void {
        try {
            for (const [tracked, tracker] of this._preparedChangeTrackers) {
                tracked[ChangeTrackedObject.commitChanges](tracker);
            }
        }
        finally {
            this.clear();
        }
    }

    rollback(): void {
        try {
            for (const [tracked, tracker] of this._changeTrackers) {
                tracked[ChangeTrackedObject.rollbackChanges](tracker);
            }
        }
        finally {
            this.clear();
        }
    }

    clear(): void {
        this._preparedChangeTrackers.clear();
    }
}

/* @internal */
export interface ChangeTrackedObject<TChangeTracker extends ChangeTracker> {
    [ChangeTrackedObject.createChangeTracker](): TChangeTracker;
    [ChangeTrackedObject.prepareChanges](changeTracker: TChangeTracker): void;
    [ChangeTrackedObject.commitChanges](changeTracker: TChangeTracker): void;
    [ChangeTrackedObject.rollbackChanges](changeTracker: TChangeTracker): void;
}

/* @internal */
export namespace ChangeTrackedObject {
    export const createChangeTracker = Symbol.for("graphmodel!ChangeTrackedObject.createChangeTracker");
    export const prepareChanges = Symbol.for("graphmodel!ChangeTrackedObject.prepareChanges");
    export const commitChanges = Symbol.for("graphmodel!ChangeTrackedObject.commitChanges");
    export const rollbackChanges = Symbol.for("graphmodel!ChangeTrackedObject.rollbackChanges");
}

/* @internal */
export interface ChangeTracker {
    addedItems(): IterableIterator<any>;
    deletedItems(): IterableIterator<any>;
}

/* @internal */
export interface ChangedTrackedParent {
    [ChangedTrackedParent.committed](changeTracker: ChangeTracker): void;
    [ChangedTrackedParent.rolledBack](changeTracker: ChangeTracker): void;
}

/* @internal */
export namespace ChangedTrackedParent {
    export const committed = Symbol.for("graphmodel!ChangeTrackedObject.committed");
    export const rolledBack = Symbol.for("graphmodel!ChangeTrackedObject.rolledBack");
    export function hasInstance(value: unknown): value is ChangedTrackedParent {
        return typeof value === "object"
            && value !== null
            && committed in value
            && rolledBack in value;
    }
}
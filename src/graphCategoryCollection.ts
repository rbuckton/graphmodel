/*!
 * Copyright 2017 Ron Buckton
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

import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";

/**
 * A collection of graph categories in a schema.
 */
export class GraphCategoryCollection<P extends object = any> {
    /**
     * Gets the schema that owns the collection.
     */
    public readonly schema: GraphSchema<P>;

    private _categories: Map<string, GraphCategory<P>> | undefined;
    private _observers: Map<GraphCategoryCollectionSubscription, GraphCategoryCollectionEvents<P>> | undefined;

    /*@internal*/
    public static _create<P extends object>(schema: GraphSchema<P>) {
        return new GraphCategoryCollection<P>(schema);
    }

    private constructor(schema: GraphSchema<P>) {
        this.schema = schema;
    }

    /**
     * Gets the number of categories in the collection.
     */
    public get size() { return this._categories ? this._categories.size : 0; }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphCategoryCollectionEvents<P>) {
        const observers = this._observers || (this._observers = new Map<GraphCategoryCollectionSubscription, GraphCategoryCollectionEvents<P>>());
        const subscription: GraphCategoryCollectionSubscription = { unsubscribe: () => { observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    /**
     * Determines whether the collection contains the specified category.
     */
    public has(category: GraphCategory<P>) {
        return this._categories !== undefined
            && this._categories.get(category.id) === category;
    }

    /**
     * Gets the category with the provided id.
     */
    public get(id: string) {
        return this._categories
            && this._categories.get(id);
    }

    /**
     * Gets the category with the provided id. If one does not exist, a new category is created.
     */
    public getOrCreate(id: string) {
        let category = this.get(id);
        if (!category) this.add(category = GraphCategory._create(id));
        return category;
    }

    /**
     * Adds a category to the collection.
     */
    public add(category: GraphCategory<P>) {
        if (!this._categories) this._categories = new Map<string, GraphCategory<P>>();
        this._categories.set(category.id, category);
        this._raiseOnAdded(category);
        return this;
    }

    /**
     * Removes a category from the collection.
     */
    public delete(category: GraphCategory<P>) {
        if (this._categories) {
            const ownCategory = this._categories.get(category.id);
            if (ownCategory) {
                this._categories.delete(category.id);
                this._raiseOnDeleted(ownCategory);
                return true;
            }
        }
        return false;
    }

    /**
     * Removes all categories from the collection.
     */
    public clear() {
        if (this._categories) {
            for (const category of [...this._categories.values()]) {
                this.delete(category);
            }
        }
    }

    /*@internal*/
    public values(categoryIds: Iterable<string>): IterableIterator<GraphCategory<P>>;
    /**
     * Creates an iterator for the values in the collection.
     */
    public values(): IterableIterator<GraphCategory<P>>;
    public * values(categoryIds?: Iterable<string>) {
        if (this._categories) {
            if (categoryIds) {
                for (const id of categoryIds) {
                    const category = this.get(id);
                    if (category) yield category;
                }
            }
            else {
                yield* this._categories.values();
            }
        }
    }

    /**
     * Creates an iterator for the values in the collection.
     */
    public * [Symbol.iterator]() {
        yield* this.values();
    }

    /**
     * Creates an iterator for the categories in the collection based on the provided base category.
     */
    public * basedOn(base: GraphCategory<P>) {
        for (const category of this) if (category.isBasedOn(base)) yield category;
    }

    private _raiseOnAdded(category: GraphCategory<P>) {
        if (this._observers) {
            for (const { onAdded } of this._observers.values()) {
                if (onAdded) {
                    onAdded(category);
                }
            }
        }
    }

    private _raiseOnDeleted(category: GraphCategory<P>) {
        if (this._observers) {
            for (const { onDeleted } of this._observers.values()) {
                if (onDeleted) {
                    onDeleted(category);
                }
            }
        }
    }
}

export interface GraphCategoryCollectionEvents<P extends object = any> {
    /**
     * An event raised when a category is added to the collection.
     */
    onAdded?: (category: GraphCategory<P>) => void;

    /**
     * An event raised when a category is removed from the collection.
     */
    onDeleted?: (category: GraphCategory<P>) => void;
}

export interface GraphCategoryCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
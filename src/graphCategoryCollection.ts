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
import { GraphCategory, GraphCategoryIdLike } from "./graphCategory";
import { GraphMetadata } from "./graphMetadata";
import { isGraphCategoryIdLike } from "./validators";
import { BaseCollection } from "./baseCollection";

/**
 * A collection of graph categories in a schema.
 */
export class GraphCategoryCollection extends BaseCollection<GraphCategory> {
    private _schema: GraphSchema;
    private _categories: Map<GraphCategoryIdLike, GraphCategory> | undefined;
    private _observers: Map<GraphCategoryCollectionSubscription, GraphCategoryCollectionEvents> | undefined;

    /* @internal */
    public static _create(schema: GraphSchema) {
        return new GraphCategoryCollection(schema);
    }

    /** @private */
    private constructor(schema: GraphSchema) {
        super();
        this._schema = schema;
    }

    /**
     * Gets the schema that owns the collection.
     */
    public get schema(): GraphSchema {
        return this._schema;
    }

    /**
     * Gets the number of categories in the collection.
     */
    public get size(): number {
        return this._categories?.size ?? 0;
    }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphCategoryCollectionEvents) {
        const observers = this._observers ?? (this._observers = new Map<GraphCategoryCollectionSubscription, GraphCategoryCollectionEvents>());
        const subscription: GraphCategoryCollectionSubscription = { unsubscribe: () => { observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    /**
     * Determines whether the collection contains the specified category.
     */
    public has(category: GraphCategory | GraphCategoryIdLike) {
        return isGraphCategoryIdLike(category) ?
            this._categories?.has(category) ?? false :
            this._categories?.get(category.id) === category;
    }

    /**
     * Gets the category with the provided id.
     */
    public get(id: GraphCategoryIdLike) {
        return this._categories?.get(id);
    }

    /**
     * Gets the category with the provided id. If one does not exist, a new category is created.
     */
    public getOrCreate(id: GraphCategoryIdLike, metadataFactory?: () => GraphMetadata): GraphCategory {
        let category = this.get(id);
        if (category === undefined) {
            this.add(category = GraphCategory._create(id, metadataFactory));
        }
        return category;
    }

    /**
     * Adds a category to the collection.
     */
    public add(category: GraphCategory): this {
        if (this._categories === undefined) {
            this._categories = new Map<GraphCategoryIdLike, GraphCategory>();
        }
        this._categories.set(category.id, category);
        this._raiseOnAdded(category);
        return this;
    }

    /**
     * Removes a category from the collection.
     */
    public delete(category: GraphCategory): boolean;
    /**
     * Removes a category from the collection.
     */
    public delete(category: GraphCategoryIdLike): GraphCategory | false;
    /**
     * Removes a category from the collection.
     */
    public delete(category: GraphCategory | GraphCategoryIdLike): GraphCategory | boolean;
    public delete(category: GraphCategory | GraphCategoryIdLike): GraphCategory | boolean {
        const id = isGraphCategoryIdLike(category) ? category : category.id;
        if (this._categories !== undefined) {
            const ownCategory = this._categories.get(id);
            if (ownCategory !== undefined) {
                this._categories.delete(id);
                this._raiseOnDeleted(ownCategory);
                return isGraphCategoryIdLike(category) ? ownCategory : true;
            }
        }
        return false;
    }

    /**
     * Removes all categories from the collection.
     */
    public clear(): void {
        if (this._categories !== undefined) {
            for (const category of [...this._categories.values()]) {
                this.delete(category);
            }
        }
    }

    /**
     * Creates an iterator for the values in the collection.
     */
    public * values(categoryIds?: Iterable<GraphCategoryIdLike>): IterableIterator<GraphCategory> {
        if (this._categories !== undefined) {
            if (categoryIds !== undefined) {
                for (const id of categoryIds) {
                    const category = this.get(id);
                    if (category !== undefined) {
                        yield category;
                    }
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
    public [Symbol.iterator](): IterableIterator<GraphCategory> {
        return this.values();
    }

    /**
     * Creates an iterator for the categories in the collection based on the provided base category.
     */
    public * basedOn(base: GraphCategory | GraphCategoryIdLike): IterableIterator<GraphCategory> {
        for (const category of this.values()) {
            if (category.isBasedOn(base)) {
                yield category;
            }
        }
    }

    private _raiseOnAdded(category: GraphCategory) {
        this._schema._raiseOnChanged();
        if (this._observers !== undefined) {
            for (const { onAdded } of this._observers.values()) {
                onAdded?.(category);
            }
        }
    }

    private _raiseOnDeleted(category: GraphCategory) {
        this._schema._raiseOnChanged();
        if (this._observers !== undefined) {
            for (const { onDeleted } of this._observers.values()) {
                onDeleted?.(category);
            }
        }
    }
}

export interface GraphCategoryCollectionEvents {
    /**
     * An event raised when a category is added to the collection.
     */
    onAdded?: (category: GraphCategory) => void;

    /**
     * An event raised when a category is removed from the collection.
     */
    onDeleted?: (category: GraphCategory) => void;
}

export interface GraphCategoryCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
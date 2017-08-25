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
import { GraphProperty } from "./graphProperty";
import { GraphNode } from "./graphNode";
import { Graph } from "./graph";

/**
 * The base definition of an extensible graph object.
 */
export abstract class GraphObject {
    private _owner: Graph | undefined;
    private _categories: Set<GraphCategory> | undefined;
    private _properties: Map<GraphProperty, any> | undefined;
    private _observers: Map<GraphObjectSubscription, GraphObjectEvents> | undefined;

    constructor(owner?: Graph, category?: GraphCategory) {
        this._owner = owner;
        if (category) this.addCategory(category);
    }

    /**
     * Gets the graph that this object belongs to.
     */
    public get owner() { return this._owner; }

    /**
     * Gets the document schema for this object.
     */
    public get schema() { return this._owner && this._owner.schema; }

    /**
     * Gets the number of categories in the object.
     */
    public get categoryCount() { return this._categories ? this._categories.size : 0; }

    /**
     * Gets the number of properties in the object.
     */
    public get propertyCount() { return this._properties ? this._properties.size : 0; }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphObjectEvents) {
        const observers = this._observers || (this._observers = new Map<GraphObjectSubscription, GraphObjectEvents>());
        const subscription: GraphObjectSubscription = { unsubscribe: () => { observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    /**
     * Determines whether the object has the specified category or categories.
     */
    public hasCategory(category: string | GraphCategory | Iterable<GraphCategory>) {
        if (!this._categories) {
            return false;
        }

        if (isIterableObject(category)) {
            return this.hasCategoryInSet(new Set(category), "exact");
        }

        const id = typeof category === "string" ? category : category.id;
        for (const category of this._categories) {
            if (category.isBasedOn(id)) return true;
        }

        return false;
    }

    /**
     * Determines whether the object has any of the categories in the provided Set.
     * @param match Either `"exact"` to only match any category in the set, or `"inherited"` to match any category or any of its base categories in the set.
     */
    public hasCategoryInSet(categorySet: ReadonlySet<GraphCategory>, match: "exact" | "inherited") {
        if (!this._categories) {
            return false;
        }

        if (match === "inherited") {
            let inherited: Set<GraphCategory> | undefined;
            let category: GraphCategory | undefined;
            for (category of categorySet) {
                while (category) {
                    if (!inherited) inherited = new Set<GraphCategory>();
                    inherited.add(category);
                    category = category.basedOn;
                }
            }
            if (inherited) {
                categorySet = inherited;
            }
        }

        let category: GraphCategory | undefined;
        for (category of this._categories) {
            while (category) {
                if (categorySet.has(category)) return true;
                category = category.basedOn;
            }
        }

        return false;
    }

    /**
     * Adds a category to the object.
     */
    public addCategory(category: GraphCategory) {
        if (!this._categories) this._categories = new Set<GraphCategory>();
        if (!this._categories.has(category)) {
            this._categories.add(category);
            this._raiseOnCategoryChanged("add", category);
        }
        return this;
    }

    /**
     * Deletes a category from the object.
     */
    public deleteCategory(category: GraphCategory) {
        if (this._categories && this._categories.delete(category)) {
            this._raiseOnCategoryChanged("delete", category);
            return true;
        }
        return false;
    }

    /**
     * Determines whether the object has the specified property.
     */
    public has(key: string | GraphProperty) {
        const property = typeof key === "string" ? this.owner!.schema.findProperty(key) : key;
        return property !== undefined
            && this._properties !== undefined
            && this._properties.has(property);
    }

    /**
     * Gets the value for the specified property.
     */
    public get<V>(key: GraphProperty<V>): V | undefined;
    public get(key: string | GraphProperty): any;
    public get(key: string | GraphProperty): any {
        const property = typeof key === "string" ? this.owner!.schema.findProperty(key) : key;
        return property
            && this._properties
            && this._properties.get(property);
    }

    /**
     * Sets the value for the specified property.
     */
    public set<V>(key: GraphProperty<V>, value: V | undefined): this;
    public set(key: string | GraphProperty, value: any): this;
    public set(key: string | GraphProperty, value: any) {
        if (value === undefined || value === null) {
            this.delete(key);
            return this;
        }

        const property = typeof key === "string" ? this.owner!.schema.findProperty(key) : key;
        if (property) {
            if (!this._properties) this._properties = new Map<GraphProperty, any>();
            this._properties.set(property, value);
            this._raiseOnPropertyChanged(property);
        }
        return this;
    }

    /**
     * Removes the specified property from the object.
     */
    public delete(key: string | GraphProperty) {
        const property = typeof key === "string" ? this.owner!.schema.findProperty(key) : key;
        if (property && this._properties && this._properties.delete(property)) {
            this._raiseOnPropertyChanged(property);
            return false;
        }

        return true;
    }

    /**
     * Creates an iterator for the properties in the object.
     */
    public * keys() {
        if (this._properties) yield* this._properties.keys();
    }

    /**
     * Creates an iterator for the entries in the object.
     */
    public * entries() {
        if (this._properties) yield* this._properties.entries();
    }

    /**
     * Creates an iterator for the categories in the object.
     */
    public * categories() {
        if (this._categories) yield* this._categories.values();
    }

    /**
     * Creates an iterator for the entries in the object.
     */
    public [Symbol.iterator]() {
        return this.entries();
    }

    /*@internal*/
    public _setOwner(owner: Graph) {
        if (!this._owner) {
            this._owner = owner;
        }
    }

    /*@internal*/
    public _merge(other: this) {
        for (const category of other.categories()) this.addCategory(category);
        for (const [key, value] of other) this.set(key, value);
    }

    /*@internal*/
    public _raiseOnCategoryChanged(change: "add" | "delete", category: GraphCategory) {
        if (this._observers) {
            for (const { onCategoryChanged } of this._observers.values()) {
                if (onCategoryChanged) {
                    onCategoryChanged(change, category);
                }
            }
        }
    }

    /*@internal*/
    public _raiseOnPropertyChanged(property: GraphProperty) {
        if (this._observers) {
            for (const { onPropertyChanged } of this._observers.values()) {
                if (onPropertyChanged) {
                    onPropertyChanged(property.id);
                }
            }
        }
    }
}

export interface GraphObjectEvents {
    /**
     * An event raised when a category is added or removed from an object.
     */
    onCategoryChanged?: (change: "add" | "delete", category: GraphCategory) => void;

    /**
     * An event raised when a property changes on the object.
     */
    onPropertyChanged?: (name: string) => void;
}

export interface GraphObjectSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}

function isIterableObject(obj: any): obj is object & Iterable<any> {
    return obj
        && typeof obj === "object"
        && Symbol.iterator in obj;
}
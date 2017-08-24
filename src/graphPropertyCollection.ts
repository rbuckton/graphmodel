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
import { GraphProperty } from "./graphProperty";

/**
 * A collection of graph properties in a schema.
 */
export class GraphPropertyCollection<P extends object = any> {
    /**
     * Gets the schema that owns the collection.
     */
    public readonly schema: GraphSchema<P>;

    private _properties: Map<string, GraphProperty<P, keyof P>> | undefined;
    private _observers: Map<GraphPropertyCollectionSubscription, GraphPropertyCollectionEvents> | undefined;

    /*@internal*/
    public static _create<P extends object>(schema: GraphSchema<P>) {
        return new GraphPropertyCollection<P>(schema);
    }

    private constructor(schema: GraphSchema<P>) {
        this.schema = schema;
    }

    /**
     * Gets the number of properties in the collection.
     */
    public get size() { return this._properties ? this._properties.size : 0; }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphPropertyCollectionEvents<P>) {
        const observers = this._observers || (this._observers = new Map<GraphPropertyCollectionSubscription, GraphPropertyCollectionEvents>());
        const subscription: GraphPropertyCollectionSubscription = { unsubscribe: () => { observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    /**
     * Determines whether the collection contains the specified property.
     */
    public has(property: GraphProperty<P>) {
        return this._properties !== undefined
            && this._properties.get(property.id) === property;
    }

    /**
     * Gets the property with the specified id.
     */
    public get<K extends keyof P>(id: K) {
        return this._properties
            && this._properties.get(id) as GraphProperty<P, K> | undefined;
    }

    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    public getOrCreate<K extends keyof P>(id: K) {
        let property = this.get(id);
        if (!property) this.add(property = GraphProperty._create(id));
        return property as GraphProperty<P, K>;
    }

    /**
     * Adds a property to the collection.
     */
    public add<K extends keyof P>(property: GraphProperty<P, K>) {
        if (!this._properties) this._properties = new Map<string, GraphProperty<P, keyof P>>();
        this._properties.set(property.id, property);
        this._raiseOnAdded(property);
        return this;
    }

    /**
     * Removes a property from the collection.
     */
    public delete(property: GraphProperty) {
        if (this._properties) {
            const ownProperty = this._properties.get(property.id);
            if (ownProperty) {
                this._properties.delete(property.id);
                this._raiseOnDeleted(ownProperty);
                return true;
            }
        }
        return false;
    }

    /**
     * Removes all properties from the collection.
     */
    public clear() {
        if (this._properties) {
            for (const property of [...this._properties.values()]) {
                this.delete(property);
            }
        }
    }

    /**
     * Gets the properties in the collection.
     */
    public values(): IterableIterator<GraphProperty<P, keyof P>>;
    /*@internal*/
    public values<K extends keyof P>(propertyIds: Iterable<K>): IterableIterator<GraphProperty<P, K>>;
    public * values(propertyIds?: Iterable<keyof P>) {
        if (propertyIds) {
            for (const id of propertyIds) {
                const property = this.get(id);
                if (property) yield property;
            }
        }
        else if (this._properties) {
            yield* this._properties.values();
        }
    }

    /**
     * Gets the properties in the collection.
     */
    public [Symbol.iterator]() {
        return this.values();
    }

    private _raiseOnAdded(property: GraphProperty<P, keyof P>) {
        if (this._observers) {
            for (const { onAdded } of this._observers.values()) {
                if (onAdded) {
                    onAdded(property);
                }
            }
        }
    }

    private _raiseOnDeleted(property: GraphProperty<P, keyof P>) {
        if (this._observers) {
            for (const { onDeleted } of this._observers.values()) {
                if (onDeleted) {
                    onDeleted(property);
                }
            }
        }
    }
}

export interface GraphPropertyCollectionEvents<P extends object = any> {
    /**
     * An event raised when a property is added to the collection.
     */
    onAdded?: (category: GraphProperty<P, keyof P>) => void;

    /**
     * An event raised when a property is removed from the collection.
     */
    onDeleted?: (category: GraphProperty<P, keyof P>) => void;
}

export interface GraphPropertyCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
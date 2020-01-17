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
import { GraphProperty, GraphPropertyIdLike } from "./graphProperty";
import { GraphMetadata } from "./graphMetadata";
import { isGraphPropertyIdLIke } from "./utils";
import { BaseCollection } from "./baseCollection";

/**
 * A collection of graph properties in a schema.
 */
export class GraphPropertyCollection extends BaseCollection<GraphProperty> {
    private _schema: GraphSchema;
    private _properties: Map<GraphPropertyIdLike, GraphProperty> | undefined;
    private _observers: Map<GraphPropertyCollectionSubscription, GraphPropertyCollectionEvents> | undefined;

    /* @internal */ static _create(schema: GraphSchema) {
        return new GraphPropertyCollection(schema);
    }

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
     * Gets the number of properties in the collection.
     */
    public get size(): number {
        return this._properties?.size ?? 0;
    }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphPropertyCollectionEvents): GraphPropertyCollectionSubscription {
        const observers = this._observers ?? (this._observers = new Map<GraphPropertyCollectionSubscription, GraphPropertyCollectionEvents>());
        const subscription: GraphPropertyCollectionSubscription = { unsubscribe: () => { observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    /**
     * Determines whether the collection contains the specified property.
     */
    public has(property: GraphProperty | GraphPropertyIdLike): boolean {
        return isGraphPropertyIdLIke(property) ?
            this._properties?.has(property) ?? false :
            this._properties?.get(property.id) === property;
    }

    /**
     * Gets the property with the specified id.
     */
    public get(id: GraphPropertyIdLike): GraphProperty | undefined {
        return this._properties?.get(id);
    }

    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    public getOrCreate<V = any>(id: GraphPropertyIdLike, metadataFactory?: () => GraphMetadata<V>): GraphProperty<V> {
        let property = this.get(id);
        if (property === undefined) {
            this.add(property = GraphProperty._create(id, metadataFactory));
        }
        return property as GraphProperty<V>;
    }

    /**
     * Adds a property to the collection.
     */
    public add(property: GraphProperty): this {
        if (this._properties === undefined) {
            this._properties = new Map<GraphPropertyIdLike, GraphProperty>();
        }
        this._properties.set(property.id, property);
        this._raiseOnAdded(property);
        return this;
    }

    /**
     * Removes a property from the collection.
     */
    public delete(property: GraphProperty): boolean;
    /**
     * Removes a property from the collection.
     */
    public delete(property: GraphPropertyIdLike): GraphProperty | false;
    /**
     * Removes a property from the collection.
     */
    public delete(property: GraphProperty | GraphPropertyIdLike): GraphProperty | boolean;
    public delete(property: GraphProperty | GraphPropertyIdLike): GraphProperty | boolean {
        const id = isGraphPropertyIdLIke(property) ? property : property.id;
        if (this._properties !== undefined) {
            const ownProperty = this._properties.get(id);
            if (ownProperty !== undefined) {
                this._properties.delete(id);
                this._raiseOnDeleted(ownProperty);
                return isGraphPropertyIdLIke(property) ? ownProperty : true;
            }
        }
        return false;
    }

    /**
     * Removes all properties from the collection.
     */
    public clear(): void {
        if (this._properties !== undefined) {
            for (const property of [...this._properties.values()]) {
                this.delete(property);
            }
        }
    }

    /**
     * Gets the property keys in the collection.
     */
    public * keys(): IterableIterator<GraphPropertyIdLike> {
        if (this._properties !== undefined) {
            yield* this._properties.keys();
        }
    }

    /**
     * Gets the properties in the collection.
     */
    public * values(propertyIds?: Iterable<GraphPropertyIdLike>): IterableIterator<GraphProperty> {
        if (propertyIds !== undefined) {
            for (const id of propertyIds) {
                const property = this.get(id);
                if (property !== undefined) {
                    yield property;
                }
            }
        }
        else if (this._properties !== undefined) {
            yield* this._properties.values();
        }
    }

    /**
     * Gets the property entries in the collection.
     */
    public * entries(): IterableIterator<[GraphPropertyIdLike, GraphProperty]> {
        if (this._properties !== undefined) {
            yield* this._properties.entries();
        }
    }

    /**
     * Gets the properties in the collection.
     */
    public [Symbol.iterator](): IterableIterator<GraphProperty> {
        return this.values();
    }

    private _raiseOnAdded(property: GraphProperty) {
        this._schema._raiseOnChanged();
        if (this._observers !== undefined) {
            for (const { onAdded } of this._observers.values()) {
                onAdded?.(property);
            }
        }
    }

    private _raiseOnDeleted(property: GraphProperty) {
        this._schema._raiseOnChanged();
        if (this._observers !== undefined) {
            for (const { onDeleted } of this._observers.values()) {
                onDeleted?.(property);
            }
        }
    }
}

export interface GraphPropertyCollectionEvents {
    /**
     * An event raised when a property is added to the collection.
     */
    onAdded?: (category: GraphProperty) => void;

    /**
     * An event raised when a property is removed from the collection.
     */
    onDeleted?: (category: GraphProperty) => void;
}

export interface GraphPropertyCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
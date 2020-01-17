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

import { GraphSchema, GraphSchemaNameLike } from "./graphSchema";
import { isGraphSchemaNameLIke } from "./utils";
import { BaseCollection } from "./baseCollection";

/**
 * A collection of child schemas in a schema.
 */
export class GraphSchemaCollection extends BaseCollection<GraphSchema> {
    private _schema: GraphSchema;
    private _schemas: Map<GraphSchemaNameLike, GraphSchema> | undefined;
    private _observers: Map<GraphSchemaCollectionSubscription, GraphSchemaCollectionEvents> | undefined;

    /* @internal */ static _create(schema: GraphSchema) {
        return new GraphSchemaCollection(schema);
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
     * Gets the number of schemas in the collection.
     */
    public get size(): number {
        return this._schemas?.size ?? 0;
    }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphSchemaCollectionEvents): GraphSchemaCollectionSubscription {
        const observers = this._observers ?? (this._observers = new Map<GraphSchemaCollectionSubscription, GraphSchemaCollectionEvents>());
        const subscription: GraphSchemaCollectionSubscription = { unsubscribe: () => { observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    /**
     * Determines whether the collection contains the specified schema.
     */
    public has(schema: GraphSchema | GraphSchemaNameLike): boolean {
        return isGraphSchemaNameLIke(schema) ?
            this._schemas?.has(schema) ?? false :
            this._schemas?.get(schema.name) === schema;
    }

    /**
     * Gets the property with the specified name.
     */
    public get(name: GraphSchemaNameLike): GraphSchema | undefined {
        return this._schemas?.get(name);
    }

    /**
     * Adds a schema to the collection.
     */
    public add(schema: GraphSchema): this {
        if (schema.hasSchema(this.schema)) {
            throw new Error("Schemas cannot be circular.");
        }
        if (schema.graph === undefined) {
            if (this._schemas === undefined) {
                this._schemas = new Map<string, GraphSchema>();
            }
            this._schemas.set(schema.name, schema);
            schema.subscribe({ onChanged: () => this._schema._raiseOnChanged() });
            this._raiseOnAdded(schema);
        }
        return this;
    }

    /**
     * Gets the schema names in the collection.
     */
    public * keys(): IterableIterator<GraphSchemaNameLike> {
        if (this._schemas !== undefined) {
            yield* this._schemas.keys();
        }
    }

    /**
     * Gets the schemas in the collection.
     */
    public * values(): IterableIterator<GraphSchema> {
        if (this._schemas !== undefined) {
            yield* this._schemas.values();
        }
    }

    /**
     * Gets the schemas in the collection.
     */
    public * entries(): IterableIterator<[GraphSchemaNameLike, GraphSchema]> {
        if (this._schemas !== undefined) {
            yield* this._schemas.entries();
        }
    }

    /**
     * Gets the schemas in the collection.
     */
    public [Symbol.iterator](): IterableIterator<GraphSchema> {
        return this.values();
    }

    private _raiseOnAdded(schema: GraphSchema) {
        this._schema._raiseOnChanged();
        if (this._observers !== undefined) {
            for (const { onAdded } of this._observers.values()) {
                onAdded?.(schema);
            }
        }
    }
}

export interface GraphSchemaCollectionEvents {
    /**
     * An event raised when a schema is added to the collection.
     */
    onAdded?: (schema: GraphSchema) => void;
}

export interface GraphSchemaCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
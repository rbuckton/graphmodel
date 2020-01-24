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

import type { DataTypeNameLike } from "./dataTypeNameLike";
import type { GraphSchema } from "./graphSchema";
import type { GraphMetadata } from "./graphMetadata";
import type { GraphPropertyIdLike } from "./graphPropertyIdLike";
import type { TypeOfDataTypeName } from "./typeOfDataTypeName";
import { BaseCollection } from "./baseCollection";
import { DataType } from "./dataType";
import { EventEmitter, EventSubscription } from "./events";
import { GraphProperty } from "./graphProperty";
import { isGraphPropertyIdLike } from "./graphPropertyIdLike";
import { isDataTypeNameLike } from "./dataTypeNameLike";

/**
 * A collection of graph properties in a schema.
 */
export class GraphPropertyCollection extends BaseCollection<GraphProperty> {
    private _schema: GraphSchema;
    private _properties: Map<GraphPropertyIdLike, GraphProperty> | undefined;
    private _events?: EventEmitter<GraphPropertyCollectionEvents>;

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
    public subscribe(events: GraphPropertyCollectionEvents): EventSubscription {
        const emitter = this._events ?? (this._events = new EventEmitter());
        return emitter.subscribe(events);
    }

    /**
     * Determines whether the collection contains the specified property.
     */
    public has(property: GraphProperty | GraphPropertyIdLike): boolean {
        return isGraphPropertyIdLike(property) ?
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
    public getOrCreate<V = any>(id: GraphPropertyIdLike, metadataFactory?: () => GraphMetadata<V>): GraphProperty<V>;
    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    public getOrCreate<V = any>(id: GraphPropertyIdLike, dataType?: DataType<V> | readonly DataType<V>[], metadataFactory?: () => GraphMetadata<V>): GraphProperty<V>;
    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    public getOrCreate<D extends DataTypeNameLike, Q extends string, V extends TypeOfDataTypeName<D, Q> = TypeOfDataTypeName<D, Q>>(id: GraphPropertyIdLike, dataType: D, packageQualifier: Q, metadataFactory?: () => GraphMetadata<V>): GraphProperty<V>;
    /**
     * Gets the property with the specified id. If one does not exist, a new property is created.
     */
    public getOrCreate<D extends readonly DataTypeNameLike[], V extends TypeOfDataTypeName<D[number]> = TypeOfDataTypeName<D[number]>>(id: GraphPropertyIdLike, dataType: D, metadataFactory?: () => GraphMetadata<V>): GraphProperty<V>;
    public getOrCreate(id: GraphPropertyIdLike, dataTypes?: DataTypeNameLike | DataType | readonly (DataTypeNameLike | DataType)[] | (() => GraphMetadata), packageQualifier?: string | (() => GraphMetadata), metadataFactory?: () => GraphMetadata): GraphProperty {
        if (typeof dataTypes === "function") {
            packageQualifier = dataTypes;
            dataTypes = undefined;
        }
        if (typeof packageQualifier === "function") {
            metadataFactory = packageQualifier;
            packageQualifier = undefined;
        }

        let dataType: DataType | undefined;
        if (isDataTypeNameLike(dataTypes)) {
            dataType = this.schema.findDataType(dataTypes, packageQualifier) ??
                this.schema.dataTypes.getOrCreate(dataTypes, packageQualifier);
        }
        else if ((Array.isArray as (value: any) => value is ReadonlyArray<any>)(dataTypes)) {
            const resolvedDataTypes: DataType[] = [];
            for (const dataType of dataTypes) {
                resolvedDataTypes.push(
                    isDataTypeNameLike(dataType) ?
                        this.schema.findDataType(dataType) ?? this.schema.dataTypes.getOrCreate(dataType) :
                        dataType);
            }
            dataTypes = DataType.union(...resolvedDataTypes);
        }
        else {
            dataType = dataTypes;
        }

        let property = this.get(id);
        if (property === undefined) {
            this.add(property = GraphProperty._create(id, dataType, metadataFactory));
        }

        return property as GraphProperty;
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
        const id = isGraphPropertyIdLike(property) ? property : property.id;
        if (this._properties !== undefined) {
            const ownProperty = this._properties.get(id);
            if (ownProperty !== undefined) {
                this._properties.delete(id);
                this._raiseOnDeleted(ownProperty);
                return isGraphPropertyIdLike(property) ? ownProperty : true;
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
        this._events?.emit("onAdded", property);
    }
    
    private _raiseOnDeleted(property: GraphProperty) {
        this._schema._raiseOnChanged();
        this._events?.emit("onDeleted", property);
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

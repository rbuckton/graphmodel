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

import { GraphSchema } from "./graphSchema";
import { BaseCollection } from "./baseCollection";
import { DataType, DataTypeNameLike, DataTypeKey } from "./dataType";
import { EventEmitter, EventSubscription } from "./events";
import { isDataTypeNameLike } from "./utils";

/**
 * A collection of graph properties in a schema.
 */
export class DataTypeCollection extends BaseCollection<DataType> {
    private _schema: GraphSchema;
    private _size = 0;
    private _types: Map<string, DataType> | undefined;
    private _events?: EventEmitter<DataTypeCollectionEvents>;

    /* @internal */ static _create(schema: GraphSchema) {
        return new DataTypeCollection(schema);
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
        return this._size;
    }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: DataTypeCollectionEvents): EventSubscription {
        const emitter = this._events ?? (this._events = new EventEmitter());
        return emitter.subscribe(events);
    }

    /**
     * Determines whether the collection contains the specified data type.
     */
    public has(type: DataTypeNameLike, packageQualifier?: string): boolean;
    /**
     * Determines whether the collection contains the specified data type.
     */
    public has(type: DataTypeNameLike | DataType): boolean;
    public has(type: DataTypeNameLike | DataType, packageQualifier?: string): boolean {
        const key = DataTypeKey.from(type, packageQualifier);
        return isDataTypeNameLike(type) ?
            this._types?.has(key.id) ?? false :
            this._types?.get(key.id) === type;
    }

    /**
     * Gets the data type with the specified id.
     */
    public get(name: DataTypeNameLike, packageQualifier?: string): DataType | undefined {
        const key = DataTypeKey.from(name, packageQualifier);
        return this._types?.get(key.id);
    }

    /**
     * Gets the data type with the specified name. If one does not exist, a new data type is created.
     */
    public getOrCreate<V = any>(name: DataTypeNameLike, validator?: ((value: any) => value is V) | ((value: any) => boolean)): DataType<V>;
    /**
     * Gets the data type with the specified name. If one does not exist, a new data type is created.
     */
    public getOrCreate<V = any>(name: DataTypeNameLike, packageQualifier?: string, validator?: ((value: any) => value is V) | ((value: any) => boolean)): DataType<V>;
    public getOrCreate(name: DataTypeNameLike, packageQualifierOrValidator?: string | ((value: any) => boolean), validator?: ((value: any) => boolean)): DataType {
        let packageQualifier: string | undefined;
        if (typeof packageQualifierOrValidator === "function") {
            validator = packageQualifierOrValidator;
        }
        else {
            packageQualifier = packageQualifierOrValidator;
        }

        const key = DataTypeKey.from(name, packageQualifier);
        let dataType = this._types?.get(key.id);
        if (dataType === undefined) {
            this.add(dataType = DataType._create(key, validator));
        }

        return dataType as DataType;
    }

    /**
     * Gets the data type for the provided class. If one does not exist, a new data type is created.
     */
    public getOrCreateClass<V = any>(ctor: new (...args: any) => V, packageQualifier?: string) {
        const key = DataTypeKey.fromClass(ctor, packageQualifier);
        let dataType = this._types?.get(key.id);
        if (dataType === undefined) {
            const validator = (value: any) => value instanceof ctor;
            this.add(dataType = DataType._create(key, validator));
        }
        return dataType as DataType<V>;
    }

    /**
     * Adds a data type to the collection.
     */
    public add(dataType: DataType): this {
        if (this._types === undefined) {
            this._types = new Map();
        }

        const key = DataTypeKey.fromDataType(dataType);
        const oldSize = this._types.size;
        this._types.set(key.id, dataType);
        this._size += this._types.size - oldSize;
        this._raiseOnAdded(dataType);
        return this;
    }

    /**
     * Removes a data type from the collection.
     */
    public delete(dataType: DataType): boolean;
    /**
     * Removes a data type from the collection.
     */
    public delete(dataType: DataTypeNameLike, packageQualifier?: string): DataType | false;
    /**
     * Removes a data type from the collection.
     */
    public delete(dataType: DataType | DataTypeNameLike): DataType | boolean;
    public delete(dataType: DataType | DataTypeNameLike, packageQualifier?: string): DataType | boolean {
        const key = DataTypeKey.from(dataType, packageQualifier);
        if (this._types !== undefined) {
            const ownDataType = this._types.get(key.id);
            if (ownDataType !== undefined) {
                const oldSize = this._types.size;
                this._types.delete(name);
                this._size -= oldSize - this._types.size;
                this._raiseOnDeleted(ownDataType);
                return isDataTypeNameLike(dataType) ? ownDataType : true;
            }
        }
        return false;
    }

    /**
     * Removes all data types from the collection.
     */
    public clear(): void {
        if (this._types !== undefined) {
            for (const dataType of [...this.values()]) {
                this.delete(dataType);
            }
        }
    }

    /**
     * Gets the data types in the collection.
     */
    public * values(): IterableIterator<DataType> {
        if (this._types !== undefined) {
            yield* this._types.values();
        }
    }

    /**
     * Gets the data types in the collection.
     */
    public [Symbol.iterator](): IterableIterator<DataType> {
        return this.values();
    }

    private _raiseOnAdded(dataType: DataType) {
        this._schema._raiseOnChanged();
        this._events?.emit("onAdded", dataType);
    }

    private _raiseOnDeleted(dataType: DataType) {
        this._schema._raiseOnChanged();
        this._events?.emit("onDeleted", dataType);
    }
}

export interface DataTypeCollectionEvents {
    /**
     * An event raised when a data type is added to the collection.
     */
    onAdded?: (type: DataType) => void;

    /**
     * An event raised when a data type is removed from the collection.
     */
    onDeleted?: (type: DataType) => void;
}
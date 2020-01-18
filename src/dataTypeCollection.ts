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
import { BaseCollection } from "./baseCollection";
import { DataType, DataTypeNameLike } from "./dataType";
import { isDataTypeNameLike, DataTypeKey } from "./utils";

/**
 * A collection of graph properties in a schema.
 */
export class DataTypeCollection extends BaseCollection<DataType> {
    private _schema: GraphSchema;
    private _size = 0;
    private _types: Map<string, Map<DataTypeNameLike, DataType>> | undefined;
    private _observers: Map<DataTypeCollectionSubscription, DataTypeCollectionEvents> | undefined;

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
    public subscribe(events: DataTypeCollectionEvents): DataTypeCollectionSubscription {
        const observers = this._observers ?? (this._observers = new Map<DataTypeCollectionSubscription, DataTypeCollectionEvents>());
        const subscription: DataTypeCollectionSubscription = { unsubscribe: () => { observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
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
            this._types?.get(key.packageQualifier)?.has(key.name) ?? false :
            this._types?.get(key.packageQualifier)?.get(key.name) === type;
    }

    /**
     * Gets the data type with the specified id.
     */
    public get(name: DataTypeNameLike, packageQualifier?: string): DataType | undefined {
        const key = DataTypeKey.from(name, packageQualifier);
        return this._types?.get(key.packageQualifier)?.get(key.name);
    }

    /**
     * Gets the data type with the specified name. If one does not exist, a new data type is created.
     */
    public getOrCreate<V = any>(name: DataTypeNameLike, validator?: ((value: any) => value is V) | ((value: any) => boolean)): DataType<V>;
    public getOrCreate<V = any>(name: DataTypeNameLike, packageQualifier?: string, validator?: ((value: any) => value is V) | ((value: any) => boolean)): DataType<V>;
    public getOrCreate(name: DataTypeNameLike, packageQualifierOrValidator?: string | ((value: any) => boolean), validator?: ((value: any) => boolean)): DataType {
        let packageQualifier: string | undefined;
        if (typeof packageQualifierOrValidator === "function") {
            validator = packageQualifierOrValidator;
        }
        else {
            packageQualifier = packageQualifierOrValidator;
        }

        let dataType = this.get(name, packageQualifier);
        if (dataType === undefined) {
            this.add(dataType = DataType._create(name, packageQualifier, validator));
        }
        return dataType as DataType;
    }

    /**
     * Gets the data type for the provided class. If one does not exist, a new data type is created.
     */
    public getOrCreateClass<V = any>(ctor: new (...args: any) => V, packageQualifier?: string) {
        let dataType = this.get(ctor.name, packageQualifier);
        if (dataType === undefined) {
            const validator = (value: any) => value instanceof ctor;
            this.add(dataType = DataType._create(ctor.name, packageQualifier, validator));
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

        let packageTypes = this._types.get(dataType.packageQualifier);
        if (packageTypes === undefined) {
            this._types.set(dataType.packageQualifier, packageTypes = new Map());
        }

        const oldSize = packageTypes.size;
        packageTypes.set(dataType.name, dataType);
        this._size += packageTypes.size - oldSize;
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
            const packageTypes = this._types.get(key.packageQualifier);
            if (packageTypes !== undefined) {
                const ownDataType = packageTypes.get(key.name);
                if (ownDataType !== undefined) {
                    const oldSize = packageTypes.size;
                    packageTypes.delete(name);
                    this._size -= oldSize - packageTypes.size;
                    if (packageTypes.size === 0) {
                        this._types.delete(key.packageQualifier);
                    }

                    this._raiseOnDeleted(ownDataType);
                    return isDataTypeNameLike(dataType) ? ownDataType : true;
                }
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
            for (const packageTypes of this._types.values()) {
                for (const dataType of packageTypes.values()) {
                    yield dataType;
                }
            }
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
        if (this._observers !== undefined) {
            for (const { onAdded } of this._observers.values()) {
                onAdded?.(dataType);
            }
        }
    }

    private _raiseOnDeleted(dataType: DataType) {
        this._schema._raiseOnChanged();
        if (this._observers !== undefined) {
            for (const { onDeleted } of this._observers.values()) {
                onDeleted?.(dataType);
            }
        }
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

export interface DataTypeCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}

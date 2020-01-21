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

import { GraphNode, GraphNodeIdLike } from "./graphNode";
import { GraphLink } from "./graphLink";
import { GraphCategory, GraphCategoryIdLike } from "./graphCategory";
import { GraphProperty, GraphPropertyIdLike } from "./graphProperty";
import { GraphObject } from "./graphObject";
import { GraphMetadata } from "./graphMetadata";
import { GraphSchema, GraphSchemaNameLike } from "./graphSchema";
import { Graph } from "./graph";
import { getTaggedId } from "./utils";
import * as validators from "./validators";

/* @internal */
export class DataTypeKey {
    readonly name: DataTypeNameLike;
    readonly packageQualifier: string;
    readonly fullName: DataTypeNameLike;
    readonly id: string;

    private constructor(name: DataTypeNameLike, packageQualifier: string, id?: string) {
        this.name = name;
        this.packageQualifier = packageQualifier;
        this.fullName =
            typeof this.name === "symbol" ? this.name :
            this.packageQualifier ? `${this.packageQualifier}!${this.name}` :
            this.name;
        this.id = id ?? getTaggedId(this.fullName);
    }

    static fromDataType(dataType: DataType) {
        return dataType._key;
    }

    static fromSymbol(name: symbol) {
        return new DataTypeKey(name, /*packageQualifier*/ "");
    }

    static fromString(name: string, packageQualifier?: string) {
        if (packageQualifier !== undefined) {
            if (name.includes("!") || name.includes("|")) {
                throw new Error("Invalid token in argument 'name'. The '!' and '|' tokens are reserved in a package-qualified name.");
            }
            if (packageQualifier.includes("!") || packageQualifier.includes("|")) {
                throw new Error("Invalid token in argument 'packageQualifier'. The '!' and '|' tokens are reserved in a package-qualified name.");
            }
        }
        else {
            const match = /^([^!|]+)!([^!|]+)$/.exec(name);
            if (match) {
                [, packageQualifier, name] = match;
            }
            if (name.includes("!")) {
                throw new Error("Invalid token in argument 'name'. The '!' token is reserved in a package-qualified names.");
            }
        }
        return new DataTypeKey(name, packageQualifier ?? "");
    }

    static fromClass(ctor: new (...args: any) => any, packageQualifier?: string) {
        return this.fromString(ctor.name, packageQualifier);
    }

    static fromUnion(constituentTypes: readonly DataType[]) {
        return new DataTypeKey(
            constituentTypes.map(constituentType => constituentType.fullName.toString()).join("|"),
            "",
            constituentTypes.map(constituentType => DataTypeKey.fromDataType(constituentType).id).join("|"));
    }

    static from(type: DataTypeNameLike | DataType, packageQualifier?: string) {
        return typeof type === "symbol" ? this.fromSymbol(type) :
            typeof type === "string" ? this.fromString(type, packageQualifier) :
            this.fromDataType(type);
    }
}

export type DataTypeNameLike = string | symbol;

export class DataType<T = any> {
    /**
     * The default DataType representing the `string` type.
     */
    static readonly string = new DataType<string>(DataTypeKey.fromString("string"), validators.isString, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the `symbol` type.
     */
    static readonly symbol = new DataType<symbol>(DataTypeKey.fromString("symbol"), validators.isSymbol, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the `number` type.
     */
    static readonly number = new DataType<number>(DataTypeKey.fromString("number"), validators.isNumber, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the `bigint` type.
     */
    static readonly bigint = new DataType<bigint>(DataTypeKey.fromString("bigint"), validators.isBigInt, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the `boolean` type.
     */
    static readonly boolean = new DataType<boolean>(DataTypeKey.fromString("boolean"), validators.isBoolean, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the `object` type.
     */
    static readonly object = new DataType<object>(DataTypeKey.fromString("object"), validators.isObject, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the `function` type.
     */
    static readonly function = new DataType<Function>(DataTypeKey.fromString("function"), validators.isFunction, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the `null` type.
     */
    static readonly null = new DataType<null>(DataTypeKey.fromString("null"), validators.isUndefined, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the `undefined` type.
     */
    static readonly undefined = new DataType<undefined>(DataTypeKey.fromString("undefined"), validators.isNull, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the TypeScript `unknown` type.
     */
    static readonly unknown = new DataType<unknown>(DataTypeKey.fromString("unknown"), validators.isUnknown, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the TypeScript `never` type.
     */
    static readonly never = new DataType<never>(DataTypeKey.fromString("never"), validators.isNever, /*unionTypes*/ undefined);
    /**
     * The default DataType representing the TypeScript `any` type.
     */
    static readonly any = new DataType<any>(DataTypeKey.fromString("any"), validators.isAny, /*unionTypes*/ undefined);

    /* @internal */ readonly _constituentTypes?: readonly DataType[];
    /* @internal */ readonly _key: DataTypeKey;
    /* @internal */ _commonSchemaType?: boolean;
    private readonly _validator?: (value: any) => boolean;
    private _canValidateCache?: boolean;

    /* @internal */ static _create<T>(key: DataTypeKey, validator: ((value: any) => value is T) | ((value: any) => boolean) | undefined) {
        return new DataType<T>(key, validator, /*unionTypes*/ undefined);
    }

    /* @internal */ static _createUnion<T>(constituentTypes: readonly DataType[]) {
        return new DataType<T>(DataTypeKey.fromUnion(constituentTypes), /*validator*/ undefined, constituentTypes);
    }

    /**
     * For internal use only. Instances should be created via `GraphSchema.dataTypes.getOrCreate()`.
     */
    private constructor(key: DataTypeKey, validator: ((value: any) => value is T) | ((value: any) => boolean) | undefined, constituentTypes: readonly DataType[] | undefined) {
        this._key = key;
        this._validator = validator;
        this._constituentTypes = constituentTypes;
    }

    /**
     * Gets the name for the data type
     */
    get name(): DataTypeNameLike {
        return this._key.name;
    }

    /**
     * Gets the package name and submodule path for this data type (if available).
     */
    get packageQualifier(): string {
        return this._key.packageQualifier;
    }

    /**
     * Gets the fully-qualified name for the data type.
     */
    get fullName(): DataTypeNameLike {
        return this._key.fullName;
    }

    /**
     * Gets a value indicating whether this data type supports validation.
     */
    get canValidate(): boolean {
        if (this._constituentTypes !== undefined) {
            if (this._canValidateCache === undefined) {
                let canValidate = true;
                for (const constituent of this._constituentTypes) {
                    if (!constituent.canValidate) {
                        canValidate = false;
                        break;
                    }
                }
                this._canValidateCache = canValidate;
            }
            return this._canValidateCache;
        }
        return this._validator !== undefined;
    }

    /**
     * Gets a data type that represents a union of multiple data types.
     */
    static union<A extends readonly DataType[]>(...constituentTypes: A): DataType<A[number] extends DataType<infer T> ? T : never>;
    static union(...constituentTypes: DataType[]): DataType {
        if (constituentTypes.length === 0) {
            return DataType.never;
        }

        if (constituentTypes.length === 1) {
            return constituentTypes[0];
        }

        const dataTypeSet = new Set<DataType>();
        for (const dataType of constituentTypes) {
            if (dataType._constituentTypes !== undefined) {
                for (const constituentType of dataType._constituentTypes) {
                    if (constituentType._constituentTypes !== undefined) {
                        throw new Error("Illegal state");
                    }
                    dataTypeSet.add(dataType);
                }
            }
            else {
                dataTypeSet.add(dataType);
            }
        }

        dataTypeSet.delete(DataType.never);
        if (dataTypeSet.has(DataType.any)) {
            return DataType.any;
        }

        if (dataTypeSet.has(DataType.unknown)) {
            return DataType.unknown;
        }

        constituentTypes = [...dataTypeSet];
        if (constituentTypes.length === 1) {
            return constituentTypes[0];
        }

        constituentTypes.sort(compareDataTypes);

        return DataType._createUnion(constituentTypes);
    }

    /**
     * Validates whether a value is valid for this data type.
     */
    validate(value: any): value is T {
        if (this._constituentTypes !== undefined) {
            if (!this.canValidate) {
                return true;
            }
            for (const constituentType of this._constituentTypes) {
                if (constituentType.validate(value)) {
                    return true;
                }
            }
            return false;
        }
        return (void 0, this._validator)?.(value) ?? true;
    }
}

export type TypeOfDataTypeName<N extends DataTypeNameLike, Q extends string = ""> =
    Q extends "" ?
        N extends "string" ? string :
        N extends "symbol" ? symbol :
        N extends "number" ? number :
        N extends "bigint" ? bigint :
        N extends "boolean" ? boolean :
        N extends "object" ? object :
        N extends "function" ? Function :
        N extends "null" ? null :
        N extends "undefined" ? undefined :
        N extends "unknown" ? unknown :
        N extends "never" ? never :
        N extends "any" ? any :
        N extends "graphmodel!GraphNode" ? GraphNode :
        N extends "graphmodel!GraphNodeIdLike" ? GraphNodeIdLike :
        N extends "graphmodel!GraphLink" ? GraphLink :
        N extends "graphmodel!GraphProperty" ? GraphProperty :
        N extends "graphmodel!GraphPropertyIdLike" ? GraphPropertyIdLike :
        N extends "graphmodel!GraphCategory" ? GraphCategory :
        N extends "graphmodel!GraphCategoryIdLike" ? GraphCategoryIdLike :
        N extends "graphmodel!GraphObject" ? GraphObject :
        N extends "graphmodel!GraphMetadata" ? GraphMetadata :
        N extends "graphmodel!GraphSchema" ? GraphSchema :
        N extends "graphmodel!GraphSchemaNameLike" ? GraphSchemaNameLike :
        N extends "graphmodel!Graph" ? Graph :
        unknown :
    Q extends "graphmodel" ?
        N extends "GraphNode" ? GraphNode :
        N extends "GraphNodeIdLike" ? GraphNodeIdLike :
        N extends "GraphLink" ? GraphLink :
        N extends "GraphProperty" ? GraphProperty :
        N extends "GraphPropertyIdLike" ? GraphPropertyIdLike :
        N extends "GraphCategory" ? GraphCategory :
        N extends "GraphCategoryIdLike" ? GraphCategoryIdLike :
        N extends "GraphObject" ? GraphObject :
        N extends "GraphMetadata" ? GraphMetadata :
        N extends "GraphSchema" ? GraphSchema :
        N extends "GraphSchemaNameLike" ? GraphSchemaNameLike :
        N extends "Graph" ? Graph :
        unknown :
    unknown;

function compareDataTypes(a: DataType, b: DataType) {
    const aId = DataTypeKey.fromDataType(a).id;
    const bId = DataTypeKey.fromDataType(b).id;
    return aId < bId ? -1 : aId > bId ? +1 : 0;
}

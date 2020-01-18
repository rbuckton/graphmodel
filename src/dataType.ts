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

import { GraphNode, GraphNodeIdLike } from "./graphNode";
import { GraphLink } from "./graphLink";
import { GraphCategory, GraphCategoryIdLike } from "./graphCategory";
import { GraphProperty, GraphPropertyIdLike } from "./graphProperty";
import { GraphObject } from "./graphObject";
import { GraphMetadata } from "./graphMetadata";
import { GraphSchema, GraphSchemaNameLike } from "./graphSchema";
import { Graph } from "./graph";
import * as validators from "./validators";

export type DataTypeNameLike = string | symbol;

export class DataType<T = any> {
    static readonly string = new DataType<string>("string", /*packageQualifier*/ undefined, validators.isString);
    static readonly symbol = new DataType<symbol>("symbol", /*packageQualifier*/ undefined, validators.isSymbol);
    static readonly number = new DataType<number>("number", /*packageQualifier*/ undefined, validators.isNumber);
    static readonly bigint = new DataType<bigint>("bigint", /*packageQualifier*/ undefined, validators.isBigInt);
    static readonly boolean = new DataType<boolean>("boolean", /*packageQualifier*/ undefined, validators.isBoolean);
    static readonly object = new DataType<object>("object", /*packageQualifier*/ undefined, validators.isObject);
    static readonly function = new DataType<Function>("function", /*packageQualifier*/ undefined, validators.isFunction);
    static readonly null = new DataType<null>("null", /*packageQualifier*/ undefined, validators.isUndefined);
    static readonly undefined = new DataType<undefined>("undefined", /*packageQualifier*/ undefined, validators.isNull);
    static readonly unknown = new DataType<unknown>("unknown", /*packageQualifier*/ undefined, validators.isUnknown);
    static readonly never = new DataType<never>("never", /*packageQualifier*/ undefined, validators.isNever);
    static readonly any = new DataType<any>("any", /*packageQualifier*/ undefined, validators.isAny);

    private _name: DataTypeNameLike;
    private _packageQualifier?: string;
    private _validator?: (value: any) => boolean;

    /* @internal */ static _create<T>(name: DataTypeNameLike, packageQualifier: string | undefined, validator: ((value: any) => value is T) | ((value: any) => boolean) | undefined) {
        return new DataType<T>(name, packageQualifier, validator);
    }

    private constructor(name: DataTypeNameLike, packageQualifier: string | undefined, validator: ((value: any) => value is T) | ((value: any) => boolean) | undefined) {
        this._name = name;
        this._validator = validator;
        this._packageQualifier = packageQualifier;
    }

    /**
     * Gets the name for the data type
     */
    get name(): DataTypeNameLike {
        return this._name;
    }

    /**
     * Gets the package name and submodule path for this data type (if available).
     */
    get packageQualifier(): string {
        return this._packageQualifier ?? "";
    }

    /**
     * Gets the fully-qualified name for the data type.
     */
    get fullName(): DataTypeNameLike {
        return typeof this._name === "symbol" ? this._name :
            this._packageQualifier ? `${this._packageQualifier}!${this._name}` :
            this._name;

    }

    /**
     * Creates a data type that represents a union of multiple data types.
     */
    static union<A extends readonly DataType[]>(...dataTypes: A): DataType<A[number]>;
    static union(...dataTypes: DataType[]): DataType {
        if (dataTypes.length === 0) {
            return this.never;
        }
        if (dataTypes.length === 1) {
            return dataTypes[0];
        }

        const dataTypeSet = new Set(dataTypes);
        dataTypeSet.delete(DataType.never);
        if (dataTypeSet.has(this.any)) {
            return this.any;
        }
        if (dataTypeSet.has(this.unknown)) {
            return this.unknown;
        }

        dataTypes = [...dataTypeSet];
        if (dataTypes.length === 1) {
            return dataTypes[0];
        }

        const names: string[] = [];
        const validators: ((value: any) => boolean)[] = [];
        let canValidate = true;
        for (const dataType of dataTypes) {
            names.push(dataType.name.toString());
            if (!dataType.canValidate) {
                canValidate = false;
            }
            else if (canValidate) {
                validators.push(value => dataType.validate(value));
            }
        }

        const validator = canValidate ?
            (value: any) => validators.some(validator => validator(value)) :
            undefined;

        return new DataType(names.join("|"), /*packageQualifier*/ undefined, validator);
    }

    canValidate() {
        return this._validator !== undefined;
    }

    validate(value: any): value is T {
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

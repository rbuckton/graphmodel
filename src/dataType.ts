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
import { DataTypeKey } from "./dataTypeKey";
import * as validators from "./validators";

export class DataType<T = any> {
    /**
     * The default DataType representing the `string` type.
     */
    static readonly string = DataType._create<string>(DataTypeKey.fromString("string"), {
        validate: validators.isString,
        canConvert: value => typeof value !== "symbol",
        convert: value => String(value)
    });

    /**
     * The default DataType representing the `symbol` type.
     */
    static readonly symbol = DataType._create<symbol>(DataTypeKey.fromString("symbol"), {
        validate: validators.isSymbol,
    });

    /**
     * The default DataType representing the `number` type.
     */
    static readonly number = DataType._create<number>(DataTypeKey.fromString("number"), {
        validate: validators.isNumber,
        canConvert: value => typeof value === "string" || (typeof value === "bigint" && value >= BigInt(Number.MIN_SAFE_INTEGER) && value <= BigInt(Number.MAX_SAFE_INTEGER)),
        convert: value => Number(value),
    });

    /**
     * The default DataType representing the `bigint` type.
     */
    static readonly bigint = DataType._create<bigint>(DataTypeKey.fromString("bigint"), {
        validate: validators.isBigInt,
        canConvert: value => (typeof value === "string" || typeof value === "number") && typeof BigInt === "function",
        convert: value => BigInt(value)
    });

    /**
     * The default DataType representing the `boolean` type.
     */
    static readonly boolean = DataType._create<boolean>(DataTypeKey.fromString("boolean"), {
        validate: validators.isBoolean,
        canConvert: () => true,
        convert: value => !!value
    });

    /**
     * The default DataType representing the `object` type.
     */
    static readonly object = DataType._create<object>(DataTypeKey.fromString("object"), {
        validate: validators.isObject,
        canConvert: value => value !== null && value !== undefined,
        convert: value => Object(value)
    });

    /**
     * The default DataType representing the `function` type.
     */
    static readonly function = DataType._create<Function>(DataTypeKey.fromString("function"), {
        validate: validators.isFunction
    });

    /**
     * The default DataType representing the `null` type.
     */
    static readonly null = DataType._create<null>(DataTypeKey.fromString("null"), {
        validate: validators.isUndefined,
        canConvert: () => true,
        convert: () => null,
    });

    /**
     * The default DataType representing the `undefined` type.
     */
    static readonly undefined = DataType._create<undefined>(DataTypeKey.fromString("undefined"), {
        validate: validators.isUndefined,
        canConvert: () => true,
        convert: () => undefined,
    });

    /**
     * The default DataType representing the TypeScript `unknown` type.
     */
    static readonly unknown = DataType._create<unknown>(DataTypeKey.fromString("unknown"), {
        validate: validators.isUnknown,
        canConvert: () => true,
        convert: value => value
    });

    /**
     * The default DataType representing the TypeScript `never` type.
     */
    static readonly never = DataType._create<never>(DataTypeKey.fromString("never"), {
        validate: validators.isNever
    });

    /**
     * The default DataType representing the TypeScript `any` type.
     */
    static readonly any = DataType._create<any>(DataTypeKey.fromString("any"), {
        validate: validators.isAny,
        canConvert: () => true,
        convert: value => value
    });

    static readonly DataType = DataType._create<DataType>(DataTypeKey.fromString("DataType", "graphmodel"), {
        validate: isDataType,
    });

    /* @internal */ readonly _constituentTypes?: readonly DataType[];
    /* @internal */ readonly _key: DataTypeKey;
    /* @internal */ _commonSchemaType?: boolean;
    private readonly _validator?: (value: any) => boolean;
    private _canValidateCache?: boolean;
    private readonly _canConvert?: (value: any) => boolean;
    private readonly _convert?: (value: any) => T;

    /* @internal */ static _create<T>(key: DataTypeKey, options: DataTypeOptions<T> | undefined) {
        return new DataType<T>(key, options, /*constituentTypes*/ undefined);
    }

    /* @internal */ static _createUnion<T>(constituentTypes: readonly DataType[]) {
        return new DataType<T>(DataTypeKey.fromUnion(constituentTypes), /*validator*/ undefined, constituentTypes);
    }

    /**
     * For internal use only. Instances should be created via `GraphSchema.dataTypes.getOrCreate()`.
     */
    private constructor(key: DataTypeKey, options: DataTypeOptions<T> | undefined, constituentTypes: readonly DataType[] | undefined) {
        this._key = key;
        this._validator = options?.validate;
        this._canConvert = options?.canConvert;
        this._convert = options?.convert;
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

    /**
     * Tests whether the provided value can be converted into the underlying data-type value.
     */
    canConvert(value: any): "convertible" | "not-convertible" | "ambiguous" {
        if (this.validate(value)) {
            return "convertible";
        }
        if (this._constituentTypes !== undefined) {
            const possibleConversions = new Set<DataType>();
            let possiblyAmbiguous = false;
            for (const constituentType of this._constituentTypes) {
                if (constituentType.validate(value)) {
                    return "convertible";
                }
                switch (constituentType.canConvert(value)) {
                    case "convertible":
                        possibleConversions.add(constituentType);
                        break;
                    case "ambiguous":
                        possiblyAmbiguous = true;
                        break;
                }
            }
            if (possiblyAmbiguous) {
                return "ambiguous";
            }
            possibleConversions.delete(DataType.undefined);
            possibleConversions.delete(DataType.null);
            const hasString = possibleConversions.delete(DataType.string);
            const hasNumber = possibleConversions.delete(DataType.number);
            const hasBoolean = possibleConversions.delete(DataType.boolean);
            if (possibleConversions.size === 1) {
                return "convertible";
            }
            if (possibleConversions.size > 1) {
                return "ambiguous";
            }
            return hasString || hasNumber || hasBoolean ? "convertible" : "not-convertible";
        }
        if (this._convert !== undefined) {
            return ((void 0, this._canConvert)?.(value) ?? true) ? "convertible" : "not-convertible";
        }
        return "not-convertible";
    }

    /**
     * Converts the provided value to a value consistent with the datatype.
     */
    convert(value: any): T {
        if (this.validate(value)) {
            return value;
        }
        if (this._constituentTypes !== undefined) {
            const possibleConversions = new Set<DataType>();
            for (const constituentType of this._constituentTypes) {
                switch (constituentType.canConvert(value)) {
                    case "convertible":
                        possibleConversions.add(constituentType);
                        break;
                    case "ambiguous":
                        throw new Error("Conversion of value would be ambiguous");
                }
            }
            possibleConversions.delete(DataType.undefined);
            possibleConversions.delete(DataType.null);
            const hasString = possibleConversions.delete(DataType.string);
            const hasNumber = possibleConversions.delete(DataType.number);
            const hasBoolean = possibleConversions.delete(DataType.boolean);
            if (possibleConversions.size === 1) {
                for (const constituentType of possibleConversions) {
                    return constituentType.convert(value);
                }
            }
            if (possibleConversions.size === 0) {
                if (hasNumber) {
                    return DataType.number.convert(value) as any as T;
                }
                if (hasString) {
                    return DataType.string.convert(value) as any as T;
                }
                if (hasBoolean) {
                    return DataType.boolean.convert(value) as any as T;
                }
            }
            throw new Error("Conversion of value not supported");
        }
        else if (this._convert !== undefined && this.canConvert(value)) {
            return (void 0, this._convert)(value);
        }
        throw new Error("Conversion of value not supported");
    }

    toString(): string {
        return typeof this._key.fullName === "symbol" ?
            this._key.fullName.toString() :
            this._key.fullName;
    }
}

export interface DataTypeOptions<T> {
    validate?: ((value: any) => value is T) | ((value: any) => boolean);
    canConvert?: (value: any) => boolean,
    convert?: (value: any) => T;
}

function compareDataTypes(a: DataType, b: DataType) {
    const aId = DataTypeKey.fromDataType(a).id;
    const bId = DataTypeKey.fromDataType(b).id;
    return aId < bId ? -1 : aId > bId ? +1 : 0;
}

/* @internal */
export function isDataType(value: any): value is DataType {
    return value instanceof DataType;
}

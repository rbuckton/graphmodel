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

import type { DataType } from "./dataType";
import type { DataTypeNameLike } from "./dataTypeNameLike";
import { getTaggedId } from "./utils";

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


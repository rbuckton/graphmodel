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
import { GraphMetadata, GraphMetadataFlags } from "./graphMetadata";
import { DataType } from "./dataType";
import * as validators from "./validators";

// NOTE: GraphCommonSchema depends on an unfortunate circularity on GraphSchema

function lazyInit<T, K extends keyof T>(obj: T, key: K, factory: () => T[K]) {
    let hasValue = false;
    let value: T[K];
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {
            if (hasValue) {
                return value;
            }
            value = factory();
            hasValue = true;
            try {
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true,
                    writable: false,
                    value
                });
            } catch {
            }
            return value;
        }
    });
}

export namespace GraphCommonSchema {
    export declare const Schema: GraphSchema;
    export declare namespace DataTypes {
        export const string: DataType<string>;
        export const symbol: DataType<symbol>;
        export const number: DataType<number>;
        export const bigint: DataType<bigint>;
        export const boolean: DataType<boolean>;
        export const object: DataType<object>;
        const _function: DataType<Function>;
        export { _function as function };
        const _null: DataType<null>;
        export { _null as null };
        export const undefined: DataType<undefined>;
        export const unknown: DataType<unknown>;
        export const never: DataType<never>;
        export const any: DataType<any>;
        export const GraphNode: DataType<import("./graphNode").GraphNode>;
        export const GraphNodeIdLike: DataType<import("./graphNode").GraphNodeIdLike>;
        export const GraphLink: DataType<import("./graphLink").GraphLink>;
        export const GraphProperty: DataType<import("./graphProperty").GraphProperty>;
        export const GraphPropertyIdLike: DataType<import("./graphProperty").GraphPropertyIdLike>;
        export const GraphCategory: DataType<import("./graphCategory").GraphCategory>;
        export const GraphCategoryIdLike: DataType<import("./graphCategory").GraphCategoryIdLike>;
        export const GraphObject: DataType<import("./graphObject").GraphObject>;
        export const GraphMetadata: DataType<import("./graphMetadata").GraphMetadata>;
        export const GraphSchema: DataType<import("./graphSchema").GraphSchema>;
        export const GraphSchemaNameLike: DataType<import("./graphSchema").GraphSchemaNameLike>;
        export const Graph: DataType<import("./graph").Graph>;
    }
    export declare const BaseUri: import("./graphProperty").GraphProperty<string>;
    export declare const Version: import("./graphProperty").GraphProperty<number>;
    export declare const SourceNode: import("./graphProperty").GraphProperty<import("./graphNode").GraphNode>;
    export declare const TargetNode: import("./graphProperty").GraphProperty<import("./graphNode").GraphNode>;
    export declare const IsContainment: import("./graphProperty").GraphProperty<boolean>;
    export declare const IsPseudo: import("./graphProperty").GraphProperty<boolean>;
    export declare const IsTag: import("./graphProperty").GraphProperty<boolean>;
    export declare const Label: import("./graphProperty").GraphProperty<string>;
    export declare const UniqueId: import("./graphProperty").GraphProperty<import("./dataType").DataTypeNameLike>;
    export declare const Contains: import("./graphCategory").GraphCategory;
}
lazyInit(GraphCommonSchema, "Schema", () => new GraphSchema("GraphCommonSchema.Schema"));

function addSchemaType<T>(dataType: DataType<T>): DataType<T> {
    GraphCommonSchema.Schema.dataTypes.add(dataType);
    dataType._commonSchemaType = true;
    return dataType;
}

function getOrCreateSchemaType<T>(name: string, validator: (value: any) => value is T): DataType<T> {
    const dataType = GraphCommonSchema.Schema.dataTypes.getOrCreate(name, /*packageQualifier*/ undefined, validator);
    dataType._commonSchemaType = true;
    return dataType;
}

lazyInit(GraphCommonSchema, "DataTypes", () => {
    const obj = {} as typeof GraphCommonSchema.DataTypes;
    lazyInit(obj, "string", () => addSchemaType(DataType.string));
    lazyInit(obj, "symbol", () => addSchemaType(DataType.symbol));
    lazyInit(obj, "number", () => addSchemaType(DataType.number));
    lazyInit(obj, "bigint", () => addSchemaType(DataType.bigint));
    lazyInit(obj, "boolean", () => addSchemaType(DataType.boolean));
    lazyInit(obj, "object", () => addSchemaType(DataType.object));
    lazyInit(obj, "function", () => addSchemaType(DataType.function));
    lazyInit(obj, "null", () => addSchemaType(DataType.null));
    lazyInit(obj, "undefined", () => addSchemaType(DataType.undefined));
    lazyInit(obj, "unknown", () => addSchemaType(DataType.unknown));
    lazyInit(obj, "never", () => addSchemaType(DataType.never));
    lazyInit(obj, "any", () => addSchemaType(DataType.any));
    lazyInit(obj, "GraphNode", () => getOrCreateSchemaType("graphModel!GraphNode", validators.isGraphNode));
    lazyInit(obj, "GraphNodeIdLike", () => getOrCreateSchemaType("graphModel!GraphNodeIdLike", validators.isGraphNodeIdLike));
    lazyInit(obj, "GraphLink", () => getOrCreateSchemaType("graphModel!GraphLink", validators.isGraphLink));
    lazyInit(obj, "GraphProperty", () => getOrCreateSchemaType("graphModel!GraphProperty", validators.isGraphProperty));
    lazyInit(obj, "GraphPropertyIdLike", () => getOrCreateSchemaType("graphModel!GraphPropertyIdLike", validators.isGraphPropertyIdLike));
    lazyInit(obj, "GraphCategory", () => getOrCreateSchemaType("graphModel!GraphCategory", validators.isGraphCategory));
    lazyInit(obj, "GraphCategoryIdLike", () => getOrCreateSchemaType("graphModel!GraphCategoryIdLike", validators.isGraphCategoryIdLike));
    lazyInit(obj, "GraphObject", () => getOrCreateSchemaType("graphModel!GraphObject", validators.isGraphObject));
    lazyInit(obj, "GraphMetadata", () => getOrCreateSchemaType("graphModel!GraphMetadata", validators.isGraphMetadata));
    lazyInit(obj, "GraphSchema", () => getOrCreateSchemaType("graphModel!GraphSchema", validators.isGraphSchema));
    lazyInit(obj, "GraphSchemaNameLike", () => getOrCreateSchemaType("graphModel!GraphSchemaNameLike", validators.isGraphSchemaNameLike));
    lazyInit(obj, "Graph", () => getOrCreateSchemaType("graphModel!Graph", validators.isGraph));
    return obj;
});

lazyInit(GraphCommonSchema, "BaseUri", () => GraphCommonSchema.Schema.properties.getOrCreate("BaseUri", GraphCommonSchema.DataTypes.string, () => new GraphMetadata({ flags: GraphMetadataFlags.Removable })));
lazyInit(GraphCommonSchema, "Version", () => GraphCommonSchema.Schema.properties.getOrCreate("Version", GraphCommonSchema.DataTypes.number, () => new GraphMetadata({ flags: GraphMetadataFlags.Removable })));
lazyInit(GraphCommonSchema, "SourceNode", () => GraphCommonSchema.Schema.properties.getOrCreate("SourceNode", GraphCommonSchema.DataTypes.GraphNode, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable })));
lazyInit(GraphCommonSchema, "TargetNode", () => GraphCommonSchema.Schema.properties.getOrCreate("TargetNode", GraphCommonSchema.DataTypes.GraphNode, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable })));
lazyInit(GraphCommonSchema, "IsContainment", () => GraphCommonSchema.Schema.properties.getOrCreate("IsContainment", GraphCommonSchema.DataTypes.boolean, () => new GraphMetadata({ defaultValue: false })));
lazyInit(GraphCommonSchema, "IsPseudo", () => GraphCommonSchema.Schema.properties.getOrCreate("IsPseudo", GraphCommonSchema.DataTypes.boolean, () => new GraphMetadata({ defaultValue: false, flags: GraphMetadataFlags.Removable | GraphMetadataFlags.Serializable | GraphMetadataFlags.Sharable })));
lazyInit(GraphCommonSchema, "IsTag", () => GraphCommonSchema.Schema.properties.getOrCreate("IsTag", GraphCommonSchema.DataTypes.boolean, () => new GraphMetadata({ defaultValue: false })));
lazyInit(GraphCommonSchema, "Label", () => GraphCommonSchema.Schema.properties.getOrCreate("Label", GraphCommonSchema.DataTypes.string, () => new GraphMetadata()));
lazyInit(GraphCommonSchema, "UniqueId", () => GraphCommonSchema.Schema.properties.getOrCreate("UniqueId", GraphCommonSchema.DataTypes.GraphNodeIdLike, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable })));
lazyInit(GraphCommonSchema, "Contains", () => GraphCommonSchema.Schema.categories.getOrCreate("Contains", () => new GraphMetadata({ properties: [[GraphCommonSchema.IsContainment, true]] })));
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
    export declare const SourceNode: import("./graphProperty").GraphProperty<any>;
    export declare const TargetNode: import("./graphProperty").GraphProperty<any>;
    export declare const IsContainment: import("./graphProperty").GraphProperty<boolean>;
    export declare const IsPseudo: import("./graphProperty").GraphProperty<boolean>;
    export declare const IsTag: import("./graphProperty").GraphProperty<boolean>;
    export declare const Label: import("./graphProperty").GraphProperty<string>;
    export declare const UniqueId: import("./graphProperty").GraphProperty<import("./dataType").DataTypeNameLike>;
    export declare const Contains: import("./graphCategory").GraphCategory;
}
lazyInit(GraphCommonSchema, "Schema", () => new GraphSchema("GraphCommonSchema.Schema"));
lazyInit(GraphCommonSchema, "DataTypes", () => ({
    string: (GraphCommonSchema.Schema.dataTypes.add(DataType.string), DataType.string),
    symbol: (GraphCommonSchema.Schema.dataTypes.add(DataType.symbol), DataType.symbol),
    number: (GraphCommonSchema.Schema.dataTypes.add(DataType.number), DataType.number),
    bigint: (GraphCommonSchema.Schema.dataTypes.add(DataType.bigint), DataType.bigint),
    boolean: (GraphCommonSchema.Schema.dataTypes.add(DataType.boolean), DataType.boolean),
    object: (GraphCommonSchema.Schema.dataTypes.add(DataType.object), DataType.object),
    function: (GraphCommonSchema.Schema.dataTypes.add(DataType.function), DataType.function),
    null: (GraphCommonSchema.Schema.dataTypes.add(DataType.null), DataType.null),
    undefined: (GraphCommonSchema.Schema.dataTypes.add(DataType.undefined), DataType.undefined),
    unknown: (GraphCommonSchema.Schema.dataTypes.add(DataType.unknown), DataType.unknown),
    never: (GraphCommonSchema.Schema.dataTypes.add(DataType.never), DataType.never),
    any: (GraphCommonSchema.Schema.dataTypes.add(DataType.any), DataType.any),
    GraphNode: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphNode", validators.isGraphNode),
    GraphNodeIdLike: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphNodeIdLike", validators.isGraphNodeIdLike),
    GraphLink: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphLink", validators.isGraphLink),
    GraphProperty: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphProperty", validators.isGraphProperty),
    GraphPropertyIdLike: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphPropertyIdLike", validators.isGraphPropertyIdLike),
    GraphCategory: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphCategory", validators.isGraphCategory),
    GraphCategoryIdLike: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphCategoryIdLike", validators.isGraphCategoryIdLike),
    GraphObject: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphObject", validators.isGraphObject),
    GraphMetadata: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphMetadata", validators.isGraphMetadata),
    GraphSchema: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphSchema", validators.isGraphSchema),
    GraphSchemaNameLike: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!GraphSchemaNameLike", validators.isGraphSchemaNameLike),
    Graph: GraphCommonSchema.Schema.dataTypes.getOrCreate("graphModel!Graph", validators.isGraph),
}));
lazyInit(GraphCommonSchema, "BaseUri", () => GraphCommonSchema.Schema.properties.getOrCreate("BaseUri", GraphCommonSchema.DataTypes.string, () => new GraphMetadata({ flags: GraphMetadataFlags.Removable })));
lazyInit(GraphCommonSchema, "Version", () => GraphCommonSchema.Schema.properties.getOrCreate("Version", GraphCommonSchema.DataTypes.number, () => new GraphMetadata({ flags: GraphMetadataFlags.Removable })));
lazyInit(GraphCommonSchema, "SourceNode", () => GraphCommonSchema.Schema.properties.getOrCreate("SourceNode", GraphCommonSchema.DataTypes.object /*GraphNode*/, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable })));
lazyInit(GraphCommonSchema, "TargetNode", () => GraphCommonSchema.Schema.properties.getOrCreate("TargetNode", GraphCommonSchema.DataTypes.object /*GraphNode*/, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable })));
lazyInit(GraphCommonSchema, "IsContainment", () => GraphCommonSchema.Schema.properties.getOrCreate("IsContainment", GraphCommonSchema.DataTypes.boolean, () => new GraphMetadata({ defaultValue: false })));
lazyInit(GraphCommonSchema, "IsPseudo", () => GraphCommonSchema.Schema.properties.getOrCreate("IsPseudo", GraphCommonSchema.DataTypes.boolean, () => new GraphMetadata({ defaultValue: false, flags: GraphMetadataFlags.Removable | GraphMetadataFlags.Serializable | GraphMetadataFlags.Sharable })));
lazyInit(GraphCommonSchema, "IsTag", () => GraphCommonSchema.Schema.properties.getOrCreate("IsTag", GraphCommonSchema.DataTypes.boolean, () => new GraphMetadata({ defaultValue: false })));
lazyInit(GraphCommonSchema, "Label", () => GraphCommonSchema.Schema.properties.getOrCreate("Label", GraphCommonSchema.DataTypes.string, () => new GraphMetadata()));
lazyInit(GraphCommonSchema, "UniqueId", () => GraphCommonSchema.Schema.properties.getOrCreate("UniqueId", GraphCommonSchema.DataTypes.GraphNodeIdLike, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable })));
lazyInit(GraphCommonSchema, "Contains", () => GraphCommonSchema.Schema.categories.getOrCreate("Contains", () => new GraphMetadata({ properties: [[GraphCommonSchema.IsContainment, true]] })));
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

import type { GraphNode } from "./graphNode";
import type { GraphNodeIdLike } from "./graphNodeIdLike";
import type { GraphLink } from "./graphLink";
import type { GraphProperty } from "./graphProperty";
import type { GraphPropertyIdLike } from "./graphPropertyIdLike";
import type { GraphCategory } from "./graphCategory";
import type { GraphCategoryIdLike } from "./graphCategoryIdLike";
import type { GraphObject } from "./graphObject";
import type { GraphSchemaNameLike } from "./graphSchemaNameLike";
import type { Graph } from "./graph";
import { GraphSchema } from "./graphSchema";
import { GraphMetadata, GraphMetadataFlags } from "./graphMetadata";
import { DataType } from "./dataType";
import { lazy, lazyInit } from "./utils";

// NOTE: GraphCommonSchema depends on an unfortunate circularity on GraphSchema

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
        export const DataType: DataType<DataType>;
        export const GraphNode: DataType<GraphNode>;
        export const GraphNodeIdLike: DataType<GraphNodeIdLike>;
        export const GraphLink: DataType<GraphLink>;
        export const GraphProperty: DataType<GraphProperty>;
        export const GraphPropertyIdLike: DataType<GraphPropertyIdLike>;
        export const GraphCategory: DataType<GraphCategory>;
        export const GraphCategoryIdLike: DataType<GraphCategoryIdLike>;
        export const GraphObject: DataType<GraphObject>;
        export const GraphMetadata: DataType<GraphMetadata>;
        export const GraphSchema: DataType<GraphSchema>;
        export const GraphSchemaNameLike: DataType<GraphSchemaNameLike>;
        export const Graph: DataType<Graph>;
    }
    export declare const BaseUri: import("./graphProperty").GraphProperty<string>;
    export declare const Version: import("./graphProperty").GraphProperty<number>;
    export declare const SourceNode: import("./graphProperty").GraphProperty<GraphNode>;
    export declare const TargetNode: import("./graphProperty").GraphProperty<GraphNode>;
    export declare const IsContainment: import("./graphProperty").GraphProperty<boolean>;
    export declare const IsPseudo: import("./graphProperty").GraphProperty<boolean>;
    export declare const IsTag: import("./graphProperty").GraphProperty<boolean>;
    export declare const Label: import("./graphProperty").GraphProperty<string>;
    export declare const UniqueId: import("./graphProperty").GraphProperty<GraphNodeIdLike>;
    export declare const Contains: import("./graphCategory").GraphCategory;
}

declare const require: any;

const lazyGraphCommonSchema = lazy(() => {
    const { DATATYPE_GraphNode } = require("./graphNode") as typeof import("./graphNode");
    const { DATATYPE_GraphNodeIdLike } = require("./graphNodeIdLike") as typeof import("./graphNodeIdLike");
    const { DATATYPE_GraphLink } = require("./graphLink") as typeof import("./graphLink");
    const { DATATYPE_GraphProperty } = require("./graphProperty") as typeof import("./graphProperty");
    const { DATATYPE_GraphPropertyIdLike } = require("./graphPropertyIdLike") as typeof import("./graphPropertyIdLike");
    const { DATATYPE_GraphCategory } = require("./graphCategory") as typeof import("./graphCategory");
    const { DATATYPE_GraphCategoryIdLike } = require("./graphCategoryIdLike") as typeof import("./graphCategoryIdLike");
    const { DATATYPE_GraphObject } = require("./graphObject") as typeof import("./graphObject");
    const { DATATYPE_GraphMetadata } = require("./graphMetadata") as typeof import("./graphMetadata");
    const { DATATYPE_GraphSchema } = require("./graphSchema") as typeof import("./graphSchema");
    const { DATATYPE_GraphSchemaNameLike } = require("./graphSchemaNameLike") as typeof import("./graphSchemaNameLike");
    const { DATATYPE_Graph } = require("./graph") as typeof import("./graph");
    const Schema = new GraphSchema("GraphCommonSchema.Schema");
    const DataTypes = {
        string: addSchemaType(DataType.string),
        symbol: addSchemaType(DataType.symbol),
        number: addSchemaType(DataType.number),
        bigint: addSchemaType(DataType.bigint),
        boolean: addSchemaType(DataType.boolean),
        object: addSchemaType(DataType.object),
        function: addSchemaType(DataType.function),
        null: addSchemaType(DataType.null),
        undefined: addSchemaType(DataType.undefined),
        unknown: addSchemaType(DataType.unknown),
        never: addSchemaType(DataType.never),
        any: addSchemaType(DataType.any),
        DataType: addSchemaType(DataType.DataType),
        GraphNode: addSchemaType(DATATYPE_GraphNode),
        GraphNodeIdLike: addSchemaType(DATATYPE_GraphNodeIdLike),
        GraphLink: addSchemaType(DATATYPE_GraphLink),
        GraphProperty: addSchemaType(DATATYPE_GraphProperty),
        GraphPropertyIdLike: addSchemaType(DATATYPE_GraphPropertyIdLike),
        GraphCategory: addSchemaType(DATATYPE_GraphCategory),
        GraphCategoryIdLike: addSchemaType(DATATYPE_GraphCategoryIdLike),
        GraphObject: addSchemaType(DATATYPE_GraphObject),
        GraphMetadata: addSchemaType(DATATYPE_GraphMetadata),
        GraphSchema: addSchemaType(DATATYPE_GraphSchema),
        GraphSchemaNameLike: addSchemaType(DATATYPE_GraphSchemaNameLike),
        Graph: addSchemaType(DATATYPE_Graph),
    };
    const BaseUri = Schema.properties.getOrCreate("BaseUri", DataType.string, () => new GraphMetadata({ flags: GraphMetadataFlags.Removable }));
    const Version = Schema.properties.getOrCreate("Version", DataType.number, () => new GraphMetadata({ flags: GraphMetadataFlags.Removable }));
    const SourceNode = Schema.properties.getOrCreate("SourceNode", DATATYPE_GraphNode, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    const TargetNode = Schema.properties.getOrCreate("TargetNode", DATATYPE_GraphNode, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    const IsContainment = Schema.properties.getOrCreate("IsContainment", DataType.boolean, () => new GraphMetadata({ defaultValue: false }));
    const IsPseudo = Schema.properties.getOrCreate("IsPseudo", DataType.boolean, () => new GraphMetadata({ defaultValue: false, flags: GraphMetadataFlags.Removable | GraphMetadataFlags.Serializable | GraphMetadataFlags.Sharable }));
    const IsTag = Schema.properties.getOrCreate("IsTag", DataType.boolean, () => new GraphMetadata({ defaultValue: false }));
    const Label = Schema.properties.getOrCreate("Label", DataType.string, () => new GraphMetadata());
    const UniqueId = Schema.properties.getOrCreate("UniqueId", DATATYPE_GraphNodeIdLike, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    const Contains = Schema.categories.getOrCreate("Contains", () => new GraphMetadata({ properties: [[IsContainment, true]] }));
    return {
        Schema,
        DataTypes,
        BaseUri,
        Version,
        SourceNode,
        TargetNode,
        IsContainment,
        IsPseudo,
        IsTag,
        Label,
        UniqueId,
        Contains,
    };

    function addSchemaType<T>(dataType: DataType<T>): DataType<T> {
        Schema.dataTypes.add(dataType);
        dataType._commonSchemaType = true;
        return dataType;
    }
});

lazyInit(GraphCommonSchema, "Schema", () => lazyGraphCommonSchema().Schema);
lazyInit(GraphCommonSchema, "DataTypes", () => lazyGraphCommonSchema().DataTypes);
lazyInit(GraphCommonSchema, "BaseUri", () => lazyGraphCommonSchema().BaseUri);
lazyInit(GraphCommonSchema, "Version", () => lazyGraphCommonSchema().Version);
lazyInit(GraphCommonSchema, "SourceNode", () => lazyGraphCommonSchema().SourceNode);
lazyInit(GraphCommonSchema, "TargetNode", () => lazyGraphCommonSchema().TargetNode);
lazyInit(GraphCommonSchema, "IsContainment", () => lazyGraphCommonSchema().IsContainment);
lazyInit(GraphCommonSchema, "IsPseudo", () => lazyGraphCommonSchema().IsPseudo);
lazyInit(GraphCommonSchema, "IsTag", () => lazyGraphCommonSchema().IsTag);
lazyInit(GraphCommonSchema, "Label", () => lazyGraphCommonSchema().Label);
lazyInit(GraphCommonSchema, "UniqueId", () => lazyGraphCommonSchema().UniqueId);
lazyInit(GraphCommonSchema, "Contains", () => lazyGraphCommonSchema().Contains);
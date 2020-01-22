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
import { lazy } from "./utils";
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

const lazyGraphCommonSchema = lazy(() => {
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
        GraphNode: getOrCreateSchemaType("graphModel!GraphNode", validators.isGraphNode),
        GraphNodeIdLike: getOrCreateSchemaType("graphModel!GraphNodeIdLike", validators.isGraphNodeIdLike),
        GraphLink: getOrCreateSchemaType("graphModel!GraphLink", validators.isGraphLink),
        GraphProperty: getOrCreateSchemaType("graphModel!GraphProperty", validators.isGraphProperty),
        GraphPropertyIdLike: getOrCreateSchemaType("graphModel!GraphPropertyIdLike", validators.isGraphPropertyIdLike),
        GraphCategory: getOrCreateSchemaType("graphModel!GraphCategory", validators.isGraphCategory),
        GraphCategoryIdLike: getOrCreateSchemaType("graphModel!GraphCategoryIdLike", validators.isGraphCategoryIdLike),
        GraphObject: getOrCreateSchemaType("graphModel!GraphObject", validators.isGraphObject),
        GraphMetadata: getOrCreateSchemaType("graphModel!GraphMetadata", validators.isGraphMetadata),
        GraphSchema: getOrCreateSchemaType("graphModel!GraphSchema", validators.isGraphSchema),
        GraphSchemaNameLike: getOrCreateSchemaType("graphModel!GraphSchemaNameLike", validators.isGraphSchemaNameLike),
        Graph: getOrCreateSchemaType("graphModel!Graph", validators.isGraph),
    };
    const BaseUri = Schema.properties.getOrCreate("BaseUri", DataTypes.string, () => new GraphMetadata({ flags: GraphMetadataFlags.Removable }));
    const Version = Schema.properties.getOrCreate("Version", DataTypes.number, () => new GraphMetadata({ flags: GraphMetadataFlags.Removable }));
    const SourceNode = Schema.properties.getOrCreate("SourceNode", DataTypes.GraphNode, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    const TargetNode = Schema.properties.getOrCreate("TargetNode", DataTypes.GraphNode, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    const IsContainment = Schema.properties.getOrCreate("IsContainment", DataTypes.boolean, () => new GraphMetadata({ defaultValue: false }));
    const IsPseudo = Schema.properties.getOrCreate("IsPseudo", DataTypes.boolean, () => new GraphMetadata({ defaultValue: false, flags: GraphMetadataFlags.Removable | GraphMetadataFlags.Serializable | GraphMetadataFlags.Sharable }));
    const IsTag = Schema.properties.getOrCreate("IsTag", DataTypes.boolean, () => new GraphMetadata({ defaultValue: false }));
    const Label = Schema.properties.getOrCreate("Label", DataTypes.string, () => new GraphMetadata());
    const UniqueId = Schema.properties.getOrCreate("UniqueId", DataTypes.GraphNodeIdLike, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
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

    function getOrCreateSchemaType<T>(name: string, validator: (value: any) => value is T): DataType<T> {
        const dataType = Schema.dataTypes.getOrCreate(name, /*packageQualifier*/ undefined, validator);
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
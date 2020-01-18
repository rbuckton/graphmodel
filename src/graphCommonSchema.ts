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
import { GraphMetadata, GraphMetadataFlags } from "./graphMetadata";
import { DataType } from "./dataType";
import * as validators from "./validators";

export namespace GraphCommonSchema {
    export const Schema = new GraphSchema("GraphCommonSchema.Schema");
    export const DataTypes = {
        string: (Schema.dataTypes.add(DataType.string), DataType.string),
        symbol: (Schema.dataTypes.add(DataType.symbol), DataType.symbol),
        number: (Schema.dataTypes.add(DataType.number), DataType.number),
        bigint: (Schema.dataTypes.add(DataType.bigint), DataType.bigint),
        boolean: (Schema.dataTypes.add(DataType.boolean), DataType.boolean),
        object: (Schema.dataTypes.add(DataType.object), DataType.object),
        function: (Schema.dataTypes.add(DataType.function), DataType.function),
        null: (Schema.dataTypes.add(DataType.null), DataType.null),
        undefined: (Schema.dataTypes.add(DataType.undefined), DataType.undefined),
        unknown: (Schema.dataTypes.add(DataType.unknown), DataType.unknown),
        never: (Schema.dataTypes.add(DataType.never), DataType.never),
        any: (Schema.dataTypes.add(DataType.any), DataType.any),
        GraphNode: Schema.dataTypes.getOrCreate("graphModel!GraphNode", validators.isGraphNode),
        GraphNodeIdLike: Schema.dataTypes.getOrCreate("graphModel!GraphNodeIdLike", validators.isGraphNodeIdLike),
        GraphLink: Schema.dataTypes.getOrCreate("graphModel!GraphLink", validators.isGraphLink),
        GraphProperty: Schema.dataTypes.getOrCreate("graphModel!GraphProperty", validators.isGraphProperty),
        GraphPropertyIdLike: Schema.dataTypes.getOrCreate("graphModel!GraphPropertyIdLike", validators.isGraphPropertyIdLike),
        GraphCategory: Schema.dataTypes.getOrCreate("graphModel!GraphCategory", validators.isGraphCategory),
        GraphCategoryIdLike: Schema.dataTypes.getOrCreate("graphModel!GraphCategoryIdLike", validators.isGraphCategoryIdLike),
        GraphObject: Schema.dataTypes.getOrCreate("graphModel!GraphObject", validators.isGraphObject),
        GraphMetadata: Schema.dataTypes.getOrCreate("graphModel!GraphMetadata", validators.isGraphMetadata),
        GraphSchema: Schema.dataTypes.getOrCreate("graphModel!GraphSchema", validators.isGraphSchema),
        GraphSchemaNameLike: Schema.dataTypes.getOrCreate("graphModel!GraphSchemaNameLike", validators.isGraphSchemaNameLike),
        Graph: Schema.dataTypes.getOrCreate("graphModel!Graph", validators.isGraph),
    };
    export const BaseUri = Schema.properties.getOrCreate("BaseUri", DataTypes.string, () => new GraphMetadata({ flags: GraphMetadataFlags.Removable }));
    export const Version = Schema.properties.getOrCreate("Version", DataTypes.number, () => new GraphMetadata({ flags: GraphMetadataFlags.Removable }));
    export const SourceNode = Schema.properties.getOrCreate("SourceNode", DataTypes.GraphNode, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    export const TargetNode = Schema.properties.getOrCreate("TargetNode", DataTypes.GraphNode, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    export const IsContainment = Schema.properties.getOrCreate("IsContainment", DataTypes.boolean, () => new GraphMetadata({ defaultValue: false }));
    export const IsPseudo = Schema.properties.getOrCreate("IsPseudo", DataTypes.boolean, () => new GraphMetadata({ defaultValue: false, flags: GraphMetadataFlags.Removable | GraphMetadataFlags.Serializable | GraphMetadataFlags.Sharable }));
    export const IsTag = Schema.properties.getOrCreate("IsTag", DataTypes.boolean, () => new GraphMetadata({ defaultValue: false }));
    export const Label = Schema.properties.getOrCreate("Label", DataTypes.string, () => new GraphMetadata());
    export const UniqueId = Schema.properties.getOrCreate("UniqueId", DataTypes.GraphNodeIdLike, () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    export const Contains = Schema.categories.getOrCreate("Contains", () => new GraphMetadata({ properties: [[IsContainment, true]] }));
}
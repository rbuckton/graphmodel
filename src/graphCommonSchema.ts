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
import { GraphNode, GraphNodeIdLike } from "./graphNode";
import { isGraphNodeIdLike } from "./utils";

export namespace GraphCommonSchema {
    export const Schema = new GraphSchema("GraphCommonSchema.Schema");
    export const UniqueId = Schema.properties.getOrCreate<GraphNodeIdLike>("UniqueId", () => new GraphMetadata<GraphNodeIdLike>({ flags: GraphMetadataFlags.Immutable, validate: isGraphNodeIdLike }));
    export const SourceNode = Schema.properties.getOrCreate<GraphNode>("SourceNode", () => new GraphMetadata<GraphNode>({ flags: GraphMetadataFlags.Immutable }));
    export const TargetNode = Schema.properties.getOrCreate<GraphNode>("TargetNode", () => new GraphMetadata<GraphNode>({ flags: GraphMetadataFlags.Immutable }));
    export const IsContainment = Schema.properties.getOrCreate<boolean>("IsContainment", () => new GraphMetadata<boolean>({ defaultValue: false, validate: (value): value is boolean => typeof value === "boolean" }));
    export const Contains = Schema.categories.getOrCreate("Contains", () => new GraphMetadata({ properties: [[IsContainment, true]] }));
}
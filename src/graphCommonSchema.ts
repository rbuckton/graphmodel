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
import { GraphProperty } from "./graphProperty";
import { GraphCategory } from "./graphCategory";
import { GraphNode } from "./graphNode";

export namespace GraphCommonSchema {
    export const Schema = new GraphSchema("GraphCommonSchema.Schema");
    export const UniqueId = Schema.properties.getOrCreate<string>("UniqueId", () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    export const SourceNode = Schema.properties.getOrCreate<GraphNode>("SourceNode", () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    export const TargetNode = Schema.properties.getOrCreate<GraphNode>("TargetNode", () => new GraphMetadata({ flags: GraphMetadataFlags.Immutable }));
    export const IsContainment = Schema.properties.getOrCreate<boolean>("IsContainment", () => new GraphMetadata({ defaultValue: false }));
    export const Contains = Schema.categories.getOrCreate("Contains", () => new GraphMetadata({ properties: [[IsContainment, true]] }));
}
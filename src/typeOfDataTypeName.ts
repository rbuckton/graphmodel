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
import type { GraphCategory } from "./graphCategory";
import type { GraphProperty } from "./graphProperty";
import type { GraphObject } from "./graphObject";
import type { GraphMetadata } from "./graphMetadata";
import type { GraphSchema } from "./graphSchema";
import type { Graph } from "./graph";
import type { GraphPropertyIdLike } from "./graphPropertyIdLike";
import type { GraphCategoryIdLike } from "./graphCategoryIdLike";
import type { GraphSchemaNameLike } from "./graphSchemaNameLike";
import type { DataTypeNameLike } from "./dataTypeNameLike";

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


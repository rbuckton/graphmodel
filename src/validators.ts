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

import { GraphNode, GraphNodeIdLike } from "./graphNode";
import { GraphLink } from "./graphLink";
import { Graph } from "./graph";
import { GraphProperty, GraphPropertyIdLike } from "./graphProperty";
import { GraphCategory, GraphCategoryIdLike } from "./graphCategory";
import { GraphObject } from "./graphObject";
import { GraphMetadata } from "./graphMetadata";
import { GraphSchema, GraphSchemaNameLike } from "./graphSchema";

/* @internal */
export const isString = (value: any): value is string => typeof value === "string";
/* @internal */
export const isSymbol = (value: any): value is symbol => typeof value === "symbol";
/* @internal */
export const isNumber = (value: any): value is number => typeof value === "number";
/* @internal */
export const isBigInt = (value: any): value is bigint => typeof value === "bigint";
/* @internal */
export const isBoolean = (value: any): value is boolean => typeof value === "boolean";
/* @internal */
export const isObject = (value: any): value is object => typeof value === "object" && value !== null;
/* @internal */
export const isFunction = (value: any): value is Function => typeof value === "function";
/* @internal */
export const isUndefined = (value: any): value is undefined => value === undefined;
/* @internal */
export const isNull = (value: any): value is null => value === null;
/* @internal */
export const isUnknown = (value: any): value is unknown => true;
/* @internal */
export const isNever = (value: any): value is never => false;
/* @internal */
export const isAny = (value: any): value is any => true;
/* @internal */
export const isGraphNode = (value: any): value is GraphNode => value instanceof GraphNode;
/* @internal */
export const isGraphLink = (value: any): value is GraphLink => value instanceof GraphLink;
/* @internal */
export const isGraphProperty = (value: any): value is GraphProperty => value instanceof GraphProperty;
/* @internal */
export const isGraphCategory = (value: any): value is GraphCategory => value instanceof GraphCategory;
/* @internal */
export const isGraphObject = (value: any): value is GraphObject => value instanceof GraphObject;
/* @internal */
export const isGraphMetadata = (value: any): value is GraphMetadata => value instanceof GraphMetadata;
/* @internal */
export const isGraphSchema = (value: any): value is GraphSchema => value instanceof GraphSchema;
/* @internal */
export const isGraph = (value: any): value is Graph => value instanceof Graph;
/* @internal */
export const isGraphNodeIdLike = (value: any): value is GraphNodeIdLike => isSymbol(value) || isString(value);
/* @internal */
export const isGraphCategoryIdLike = (value: any): value is GraphCategoryIdLike => isSymbol(value) || isString(value);
/* @internal */
export const isGraphPropertyIdLike = (value: any): value is GraphPropertyIdLike => isSymbol(value) || isString(value);
/* @internal */
export const isGraphSchemaNameLike = (value: any): value is GraphSchemaNameLike => isSymbol(value) || isString(value);

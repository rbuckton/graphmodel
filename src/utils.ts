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

import { GraphObject } from "./graphObject";
import { GraphCategory, GraphCategoryIdLike } from "./graphCategory";
import { GraphNodeIdLike } from "./graphNode";
import { GraphPropertyIdLike } from "./graphProperty";
import { GraphSchemaNameLike } from "./graphSchema";

/* @internal */
export function isGraphNodeIdLike(value: any): value is GraphNodeIdLike {
    return typeof value === "string" || typeof value === "symbol";
}

/* @internal */
export function isGraphCategoryIdLike(value: any): value is GraphCategoryIdLike {
    return typeof value === "string" || typeof value === "symbol";
}

/* @internal */
export function isGraphPropertyIdLIke(value: any): value is GraphPropertyIdLike {
    return typeof value === "string" || typeof value === "symbol";
}

/* @internal */
export function isGraphSchemaNameLIke(value: any): value is GraphSchemaNameLike {
    return typeof value === "string" || typeof value === "symbol";
}

/* @internal */
export function isIterableObject(obj: any): obj is object & Iterable<any> {
    return obj
        && typeof obj === "object"
        && Symbol.iterator in obj;
}

/* @internal */
export function hasCategoryInSetExact(obj: GraphObject, set: ReadonlySet<GraphCategory | GraphCategoryIdLike> | undefined) {
    return set === undefined || obj.hasCategoryInSet(set, "exact");
}

/* @internal */
export function getCategorySet(categories: Iterable<GraphCategory | GraphCategoryIdLike>): ReadonlySet<GraphCategory | GraphCategoryIdLike> | undefined {
    return categories instanceof Set ? categories.size ? categories : undefined :
        Array.isArray(categories) ? categories.length ? new Set(categories) : undefined :
        toSetOrUndefined(categories);
}

function toSetOrUndefined<T>(iterable: Iterable<T>): Set<T> | undefined {
    let set: Set<T> | undefined;
    for (const value of iterable) {
        if (set === undefined) {
            set = new Set();
        }
        set.add(value);
    }
    return set;
}
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

import { GraphObject } from "./graphObject";
import { GraphCategory, GraphCategoryIdLike } from "./graphCategory";
import { DataTypeNameLike } from "./dataType";

/* @internal */
export function isDataTypeNameLike(value: any): value is DataTypeNameLike {
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

let nextSymbolId = 0;
const symbolIds = new Map<symbol, number>();

const TAG_SYMBOL = "@";
const TAG_SYMBOLFOR = "%";
const TAG_STRING = "S";

/* @internal */
export function getTaggedId(id: string | symbol) {
    if (typeof id === "string") {
        return `${TAG_STRING},${id}`;
    }
    if (Symbol.keyFor(id) !== undefined) {
        return `${TAG_SYMBOLFOR},${id.toString()}`;
    }
    let symbolId = symbolIds.get(id);
    if (symbolId === undefined) {
        symbolId = nextSymbolId++;
        symbolIds.set(id, symbolId);
    }
    return `${TAG_SYMBOL},${symbolId},${id.toString()}`;
}

const done: IteratorResult<any> = { done: true, value: undefined };
Object.freeze(done);

/* @internal */
export const emptyIterable: IterableIterator<any> = {
    next() { return done; },
    [Symbol.iterator](): IterableIterator<any> {
        return emptyIterable;
    }
};
Object.freeze(emptyIterable);

/* @internal */
export function lazy<T>(factory: () => T): () => T {
    let f: () => T = () => {
        try {
            const value = factory();
            f = () => value;
        }
        catch (e) {
            f = () => { throw e; }
        }
        return f();
    };
    return () => f();
}
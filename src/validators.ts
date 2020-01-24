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

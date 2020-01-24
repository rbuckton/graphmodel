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

import { DataType } from "./dataType";

/**
 * Represents a valid id for a category.
 */
export type GraphCategoryIdLike = string | symbol;

/* @internal */
export const isGraphCategoryIdLike = (value: any): value is GraphCategoryIdLike => typeof value === "symbol" || typeof value === "string";

/* @internal */
export const DATATYPE_GraphCategoryIdLike = DataType._createUnion<GraphCategoryIdLike>([DataType.string, DataType.symbol]);

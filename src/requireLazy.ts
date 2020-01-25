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

import { lazy } from "./utils";

interface LazyImportMap {
    "./baseCollection": typeof import("./baseCollection");
    "./changeTrackedMap": typeof import("./changeTrackedMap");
    "./changeTrackedSet": typeof import("./changeTrackedSet");
    "./dataType": typeof import("./dataType");
    "./dataTypeCollection": typeof import("./dataTypeCollection");
    "./dataTypeKey": typeof import("./dataTypeKey");
    "./dataTypeNameLike": typeof import("./dataTypeNameLike");
    "./events": typeof import("./events");
    "./graph": typeof import("./graph");
    "./graphCategory": typeof import("./graphCategory");
    "./graphCategoryCollection": typeof import("./graphCategoryCollection");
    "./graphCategoryIdLike": typeof import("./graphCategoryIdLike");
    "./graphCommonSchema": typeof import("./graphCommonSchema");
    "./graphLink": typeof import("./graphLink");
    "./graphLinkCollection": typeof import("./graphLinkCollection");
    "./graphMetadata": typeof import("./graphMetadata");
    "./graphMetadataContainer": typeof import("./graphMetadataContainer");
    "./graphNode": typeof import("./graphNode");
    "./graphNodeCollection": typeof import("./graphNodeCollection");
    "./graphNodeIdLike": typeof import("./graphNodeIdLike");
    "./graphObject": typeof import("./graphObject");
    "./graphProperty": typeof import("./graphProperty");
    "./graphPropertyCollection": typeof import("./graphPropertyCollection");
    "./graphPropertyIdLike": typeof import("./graphPropertyIdLike");
    "./graphSchema": typeof import("./graphSchema");
    "./graphSchemaCollection": typeof import("./graphSchemaCollection");
    "./graphSchemaNameLike": typeof import("./graphSchemaNameLike");
    "./graphTransactionScope": typeof import("./graphTransactionScope");
}

/* @internal */
export function requireLazy<S extends keyof LazyImportMap>(file: S): () => LazyImportMap[S] {
    return lazy(() => requireImmediate(file));
}

declare const require: any;

// NOTE: all require calls are explicit to better support WebPack
function requireImmediate<S extends keyof LazyImportMap>(file: S): LazyImportMap[S];
function requireImmediate(file: keyof LazyImportMap) {
    switch (file) {
        case "./baseCollection": return require("./baseCollection");
        case "./changeTrackedMap": return require("./changeTrackedMap");
        case "./changeTrackedSet": return require("./changeTrackedSet");
        case "./dataType": return require("./dataType");
        case "./dataTypeCollection": return require("./dataTypeCollection");
        case "./dataTypeKey": return require("./dataTypeKey");
        case "./dataTypeNameLike": return require("./dataTypeNameLike");
        case "./events": return require("./events");
        case "./graph": return require("./graph");
        case "./graphCategory": return require("./graphCategory");
        case "./graphCategoryCollection": return require("./graphCategoryCollection");
        case "./graphCategoryIdLike": return require("./graphCategoryIdLike");
        case "./graphCommonSchema": return require("./graphCommonSchema");
        case "./graphLink": return require("./graphLink");
        case "./graphLinkCollection": return require("./graphLinkCollection");
        case "./graphMetadata": return require("./graphMetadata");
        case "./graphMetadataContainer": return require("./graphMetadataContainer");
        case "./graphNode": return require("./graphNode");
        case "./graphNodeCollection": return require("./graphNodeCollection");
        case "./graphNodeIdLike": return require("./graphNodeIdLike");
        case "./graphObject": return require("./graphObject");
        case "./graphProperty": return require("./graphProperty");
        case "./graphPropertyCollection": return require("./graphPropertyCollection");
        case "./graphPropertyIdLike": return require("./graphPropertyIdLike");
        case "./graphSchema": return require("./graphSchema");
        case "./graphSchemaCollection": return require("./graphSchemaCollection");
        case "./graphSchemaNameLike": return require("./graphSchemaNameLike");
        case "./graphTransactionScope": return require("./graphTransactionScope");
        default: throw new Error();
    }
}
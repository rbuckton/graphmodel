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

import { GraphMetadataContainer } from "./graphMetadataContainer";
import { GraphMetadata } from "./graphMetadata";

/**
 * Represents a valid value for the id of a GraphProperty.
 */
export type GraphPropertyIdLike = string | symbol;

declare const DataType: unique symbol;

/**
 * Graph properties are used to annotate graph objects such as nodes or links.
 */
export class GraphProperty<V = any> extends GraphMetadataContainer<V> {
    /**
     * The underlying data type of the property. This will never have a value and is only used for type checking and type inference purposes.
     */
    public readonly [DataType]: V;

    private _id: GraphPropertyIdLike;

    /*@internal*/
    public static _create<V>(id: GraphPropertyIdLike, metadataFactory?: () => GraphMetadata<V>) {
        return new GraphProperty<V>(id, metadataFactory);
    }

    private constructor(id: GraphPropertyIdLike, metadataFactory?: () => GraphMetadata<V>) {
        super(metadataFactory);
        this._id = id;
    }

    /**
     * The unique id of the property.
     */
    public get id(): GraphPropertyIdLike {
        return this._id;
    }
}
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
import { Graph } from "./graph";
import { GraphProperty } from "./graphProperty";

/**
 * Graph metadata defines information about a GraphProperty or GraphCategory.
 */
export class GraphMetadata<V = any> extends GraphObject {
    private _defaultValue: V | undefined;
    private _flags: GraphMetadataFlags;

    constructor({ defaultValue, properties, flags = GraphMetadataFlags.Default }: GraphMetadataOptions<V> = {}) {
        super();
        this._defaultValue = defaultValue;
        this._flags = flags;
        if (properties) {
            for (const [property, value] of properties) {
                this.set(property, value);
            }
        }
    }

    /**
     * Gets the default value for a property. Only used for a GraphMetadata associated with a property.
     */
    public get defaultValue() { return this._defaultValue; }

    /**
     * Gets the flags that control the behavior of a property or category.
     */
    public get flags() { return this._flags; }

    /**
     * Gets a value indicating whether the property can be changed once it is set.
     */
    public get isImmutable() { return !!(this._flags & GraphMetadataFlags.Immutable); }

    /**
     * Gets a value indicating whether the property can be removed.
     */
    public get isRemovable() { return !!(this._flags & GraphMetadataFlags.Removable); }

    /**
     * Gets a value indicating whether the property can be shared.
     */
    public get isSharable() { return !!(this._flags & GraphMetadataFlags.Sharable); }

    /**
     * Creates a copy of the metadata.
     */
    public copy() {
        const copy = new GraphMetadata();
        copy._mergeFrom(this);
        return copy;
    }
}

export interface GraphMetadataOptions<V = any> {
    /**
     * The default value for a graph property. Only used for a GraphMetadata associated with a property.
     */
    defaultValue?: V;

    /**
     * Flags that control the behavior of a property or category.
     */
    flags?: GraphMetadataFlags;

    /**
     * Properties to define on the metadata object. Only used for a GraphMetadata associated with a category.
     */
    properties?: Iterable<[GraphProperty, any]>;
}

export const enum GraphMetadataFlags {
    None = 0,
    Immutable = 1 << 0,
    Removable = 1 << 1,
    Sharable = 1 << 5,
    Default = Removable | Sharable
}
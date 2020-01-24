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

import type { GraphProperty } from "./graphProperty";
import { GraphObject } from "./graphObject";
import { DataType } from "./dataType";
import { DataTypeKey } from "./dataTypeKey";

/**
 * Graph metadata defines information about a GraphProperty or GraphCategory.
 */
export class GraphMetadata<V = any> extends GraphObject {
    private _label: string;
    private _description: string;
    private _group: string;
    private _defaultValue: V | undefined;
    private _flags: GraphMetadataFlags;

    constructor({
        label = "",
        description = "",
        group = "",
        defaultValue,
        properties,
        flags = GraphMetadataFlags.Default,
    }: GraphMetadataOptions<V> = {}) {
        super();
        this._label = label;
        this._description = description;
        this._group = group;
        this._defaultValue = defaultValue;
        this._flags = flags;
        if (properties !== undefined) {
            for (const [property, value] of properties) {
                this.set(property, value);
            }
        }
    }

    /**
     * Gets or sets a descriptive label for the property.
     */
    public get label(): string {
        return this._label;
    }

    public set label(value: string) {
        this._label = value;
    }

    /**
     * Gets or sets a description for the property.
     */
    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }

    /**
     * Gets or sets a group for the property.
     */
    public get group(): string {
        return this._group;
    }

    public set group(value: string) {
        this._group = value;
    }

    /**
     * Gets or sets the default value for a property. Only used for a GraphMetadata associated with a property.
     */
    public get defaultValue(): V | undefined {
        return this._defaultValue;
    }

    public set defaultValue(value: V | undefined) {
        this._defaultValue = value;
    }

    /**
     * Gets or sets the flags that control the behavior of a property or category.
     */
    public get flags(): GraphMetadataFlags {
        return this._flags;
    }

    public set flags(flags: GraphMetadataFlags) {
        this._flags = flags;
    }

    /**
     * Gets a value indicating whether the property can be changed once it is set.
     */
    public get isImmutable(): boolean {
        return !!(this._flags & GraphMetadataFlags.Immutable);
    }

    /**
     * Gets a value indicating whether the property can be removed.
     */
    public get isRemovable(): boolean {
        return !!(this._flags & GraphMetadataFlags.Removable);
    }

    // /**
    //  * Gets a value indicating whether the property can be browsed.
    //  */
    // public get isBrowsable(): boolean {
    //     return !!(this._flags & GraphMetadataFlags.Browsable);
    // }

    /**
     * Gets a value indicating whether the property can be serialized.
     */
    public get isSerializable(): boolean {
        return !!(this._flags & GraphMetadataFlags.Serializable);
    }

    /**
     * Gets a value indicating whether the property can be shared.
     */
    public get isSharable(): boolean {
        return !!(this._flags & GraphMetadataFlags.Sharable);
    }

    /**
     * Creates a copy of the metadata.
     */
    public copy(): GraphMetadata<V> {
        const copy = new GraphMetadata({
            label: this._label,
            description: this._description,
            group: this._group,
            flags: this._flags,
            defaultValue: this._defaultValue,
        });
        copy._mergeFrom(this);
        return copy;
    }
}

export interface GraphMetadataOptions<V = any> {
    /**
     * A descriptive label for the property.
     */
    label?: string;

    /**
     * A description for the property.
     */
    description?: string;

    /**
     * A group for the property.
     */
    group?: string;

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
    properties?: Iterable<readonly [GraphProperty, any]>;
}

export const enum GraphMetadataFlags {
    None = 0,
    Immutable = 1 << 0,
    Removable = 1 << 1,
    // Browsable = 1 << 2,
    Serializable = 1 << 3,
    // Substitutable = 1 << 4,
    Sharable = 1 << 5,
    // Undoable = 1 << 6,
    Default = Removable | Sharable /* | Browsable */ | Serializable
}

/* @internal */
export const isGraphMetadata = (value: any): value is GraphMetadata => value instanceof GraphMetadata;

/* @internal */
export const DATATYPE_GraphMetadata = DataType._create<GraphMetadata>(DataTypeKey.fromString("GraphMetadata", "graphmodel"), { validate: isGraphMetadata });

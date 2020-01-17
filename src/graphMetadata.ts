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
import { GraphProperty } from "./graphProperty";

/**
 * Graph metadata defines information about a GraphProperty or GraphCategory.
 */
export class GraphMetadata<V = any> extends GraphObject {
    private _label: string;
    private _description: string;
    private _defaultValue: V | undefined;
    private _validate?: (value: any) => value is V;
    private _flags: GraphMetadataFlags;

    constructor({ label = "", description = "", defaultValue, properties, flags = GraphMetadataFlags.Default, validate }: GraphMetadataOptions<V> = {}) {
        super();
        this._label = label;
        this._description = description;
        this._defaultValue = defaultValue;
        this._flags = flags;
        this._validate = validate;
        if (properties !== undefined) {
            for (const [property, value] of properties) {
                this.set(property, value);
            }
        }
    }

    /**
     * Gets a descriptive label for the property.
     */
    public get label(): string {
        return this._label;
    }

    /**
     * Gets a description for the property.
     */
    public get description(): string {
        return this._description;
    }

    /**
     * Gets the default value for a property. Only used for a GraphMetadata associated with a property.
     */
    public get defaultValue(): V | undefined {
        return this._defaultValue;
    }

    /**
     * Gets the flags that control the behavior of a property or category.
     */
    public get flags(): GraphMetadataFlags {
        return this._flags;
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

    /**
     * Gets a value indicating whether the property can be shared.
     */
    public get isSharable(): boolean {
        return !!(this._flags & GraphMetadataFlags.Sharable);
    }

    /**
     * Gets a value indicating whether the property can be validated.
     */
    public get canValidate(): boolean {
        return !!this._validate;
    }

    /**
     * Creates a copy of the metadata.
     */
    public copy(): GraphMetadata<V> {
        const copy = new GraphMetadata();
        copy._mergeFrom(this);
        copy._label = this.label;
        copy._description = this._description;
        copy._defaultValue = this._defaultValue;
        copy._flags = this._flags;
        copy._validate = this._validate;
        return copy;
    }

    /**
     * Validates a value for a property.
     */
    public validate(value: any): value is V {
        const validate = this._validate;
        return validate?.(value) ?? true;
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

    /**
     * A callback used to validate whether a property value is valid.
     */
    validate?: (value: any) => value is V;
}

export const enum GraphMetadataFlags {
    None = 0,
    Immutable = 1 << 0,
    Removable = 1 << 1,
    Sharable = 1 << 5,
    Default = Removable | Sharable
}
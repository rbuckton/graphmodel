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
import { isGraphCategoryIdLike } from "./utils";

/**
 * Represents a valid id for a category.
 */
export type GraphCategoryIdLike = string | symbol;

/**
 * Graph catagories are used to categorize graph objects such as nodes or links.
 */
export class GraphCategory extends GraphMetadataContainer {
    private _id: GraphCategoryIdLike;
    private _basedOn: GraphCategory | undefined;

    /*@internal*/
    public static _create(id: GraphCategoryIdLike, metadataFactory?: () => GraphMetadata) {
        return new GraphCategory(id, metadataFactory);
    }

    private constructor(id: GraphCategoryIdLike, metadataFactory?: () => GraphMetadata) {
        super(metadataFactory);
        this._id = id;
    }

    /**
     * Gets the unique id of the category.
     */
    public get id(): GraphCategoryIdLike {
        return this._id;
    }

    /**
     * Gets or sets the category this category is based on.
     */
    public get basedOn(): GraphCategory | undefined {
        return this._basedOn;
    }

    public set basedOn(value: GraphCategory | undefined) {
        if (value !== undefined && value !== this._basedOn) {
            if (value.isBasedOn(this)) {
                throw new Error("Invalid attempt to create a circular reference in category inheritance.");
            }
            this._basedOn = value;
        }
    }

    /**
     * Determines whether this category is based on the specified category.
     */
    public isBasedOn(category: GraphCategoryIdLike | GraphCategory): boolean {
        return isGraphCategoryIdLike(category) ?
            this._isBasedOnCategoryId(category) :
            this._isBasedOnCategory(category);
    }

    /* @internal */ _isBasedOnCategory(category: GraphCategory): boolean {
        for (let base: GraphCategory | undefined = this; base; base = base.basedOn) {
            if (base === category) {
                return true;
            }
        }
        return false;
    }

    /* @internal */ _isBasedOnCategoryId(categoryId: GraphCategoryIdLike): boolean {
        for (let base: GraphCategory | undefined = this; base; base = base.basedOn) {
            if (base.id === categoryId) {
                return true;
            }
        }
        return false;
    }
}
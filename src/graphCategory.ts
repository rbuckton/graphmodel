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

/**
 * Graph catagories are used to categorize graph objects such as nodes or links.
 */
export class GraphCategory {
    private _id: string;
    private _basedOn: GraphCategory | undefined;

    /*@internal*/
    public static _create(id: string) {
        return new GraphCategory(id);
    }

    private constructor(id: string) {
        this._id = id;
    }

    /**
     * Gets the unique id of the category.
     */
    public get id() { return this._id; }

    /**
     * Gets or sets the category this category is based on.
     */
    public get basedOn() { return this._basedOn; }
    public set basedOn(value: GraphCategory | undefined) {
        if (value && value !== this._basedOn) {
            if (value.isBasedOn(this)) throw new Error("Invalid attempt to create a circular reference in category inheritance.");
            this._basedOn = value;
        }
    }

    /**
     * Determines whether this category is based on the specified category.
     */
    public isBasedOn(category: string | GraphCategory) {
        if (typeof category === "string") {
            for (let base: GraphCategory | undefined = this; base; base = base.basedOn) {
                if (base.id === category) return true;
            }
        }
        else {
            for (let base: GraphCategory | undefined = this; base; base = base.basedOn) {
                if (base === category) return true;
            }
        }

        return false;
    }
}
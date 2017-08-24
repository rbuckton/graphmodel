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
 * Graph properties are used to annotate graph objects such as nodes or links.
 */
export class GraphProperty<P extends object = any, K extends keyof P = keyof P> {
    /**
     * The unique id of the property.
     */
    public readonly id: K;

    /**
     * The underlying data type of the property. This will never have a value and is only used for type checking and type inference purposes.
     */
    public readonly ["[[DataType]]"]: P[K];

    /*@internal*/
    public static _create<P extends object, K extends keyof P>(id: K) {
        return new GraphProperty<P, K>(id);
    }

    private constructor(id: K) {
        this.id = id;
    }
}
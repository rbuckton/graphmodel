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

import { GraphMetadata } from "./graphMetadata";
import { Graph } from "./graph";

/**
 * The base class for an object that can have associated graph metadata.
 */
export abstract class GraphMetadataContainer<V = any> {
    private _metadataFactory: (() => GraphMetadata<V>) | undefined;

    constructor(metadataFactory?: () => GraphMetadata<V>) {
        this._metadataFactory = metadataFactory;
    }

    /**
     * Creates a new metadata object for the container.
     */
    public createDefaultMetadata(): GraphMetadata<V> {
        const metadataFactory = this._metadataFactory;
        return metadataFactory?.() ?? new GraphMetadata<V>();
    }

    /**
     * Gets the metadata for this container within a graph.
     */
    public getMetadata(owner: Graph): GraphMetadata<V> {
        let metadata = owner._getMetadata(this);
        if (metadata === undefined) {
            owner._setMetadata(this, metadata = this.createDefaultMetadata());
        }
        return metadata;
    }
}
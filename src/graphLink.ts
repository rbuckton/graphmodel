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

import type { GraphCategory } from "./graphCategory";
import type { GraphNode } from "./graphNode";
import type { GraphSchema } from "./graphSchema";
import type { Graph } from "./graph";
import { DataType } from "./dataType";
import { DataTypeKey } from "./dataTypeKey";
import { GraphObject } from "./graphObject";
import { requireLazy } from "./requireLazy";

const lazyGraphCommonSchema = requireLazy("./graphCommonSchema");

/**
 * Represents a link between two nodes in the graph.
 */
export class GraphLink extends GraphObject {
    private _source: GraphNode;
    private _target: GraphNode;
    private _index: number;

    /* @internal */ static _create(owner: Graph, source: GraphNode, target: GraphNode, index: number, category?: GraphCategory) {
        return new GraphLink(owner, source, target, index, category);
    }

    private constructor(owner: Graph, source: GraphNode, target: GraphNode, index: number, category?: GraphCategory) {
        super(owner, category);
        this._source = this.owner.importNode(source);
        this._target = this.owner.importNode(target);
        this._index = index;

        this.set(lazyGraphCommonSchema().GraphCommonSchema.SourceNode, source);
        this.set(lazyGraphCommonSchema().GraphCommonSchema.TargetNode, target);

        source._addLink(this);
        target._addLink(this);
    }

    /**
     * Gets the graph that this object belongs to.
     */
    public get owner(): Graph {
        return super.owner!;
    }

    /**
     * Gets the document schema for this object.
     */
    public get schema(): GraphSchema {
        return this.owner.schema;
    }

    /**
     * The source of the link.
     */
    public get source(): GraphNode {
        return this._source;
    }

    /**
     * The target of the link.
     */
    public get target(): GraphNode {
        return this._target;
    }

    /**
     * An optional index for the link (default `0`).
     */
    public get index(): number {
        return this._index;
    }

    /**
     * Gets a value indicating whether this is a containment link.
     */
    public get isContainment(): boolean {
        return this.get(lazyGraphCommonSchema().GraphCommonSchema.IsContainment) ?? false;
    }

    /**
     * Gets or sets a descriptive label to associate with this link.
     */
    public get label() {
        return this.get(lazyGraphCommonSchema().GraphCommonSchema.Label);
    }

    public set label(label: string | undefined) {
        this.set(lazyGraphCommonSchema().GraphCommonSchema.Label, label);
    }

    /**
     * Creates an iterator for the links related to this link.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how links are traversed and which links are yielded during iteration.
     */
    public * related(searchDirection: "source" | "target", traversal?: GraphLinkTraversal): IterableIterator<GraphLink> {
        const accepted = new Set<GraphLink>();
        const traversed = new Set<GraphLink>([this]);
        const traversalQueue: GraphLink[] = [this];
        let link: GraphLink | undefined;
        while ((link = traversalQueue.shift()) !== undefined) {
            const links = searchDirection === "source" ? link.source.incomingLinks() : link.target.outgoingLinks();
            for (const link of links) {
                if (!accepted.has(link) && (traversal?.acceptLink?.(link) ?? true)) {
                    accepted.add(link);
                    yield link;
                }
                if (!traversed.has(link) && (traversal?.traverseLink?.(link) ?? true)) {
                    traversed.add(link);
                    traversalQueue.push(link);
                }
            }
        }
    }

    /**
     * Removes this link from the graph.
     */
    public deleteSelf(): boolean {
        return this.owner.links.delete(this);
    }
}

export interface GraphLinkTraversal {
    /**
     * A callback used to determine whether a link should be traversed. If not specified, all links are traversed.
     */
    traverseLink?: (this: void, link: GraphLink) => boolean;

    /**
     * A callback used to determine whether a link should be yielded. If not specified, all links are yielded.
     */
    acceptLink?: (this: void, link: GraphLink) => boolean;
}

/* @internal */
export const isGraphLink = (value: any): value is GraphLink => value instanceof GraphLink;

/* @internal */
export const DATATYPE_GraphLink = DataType._create<GraphLink>(DataTypeKey.fromString("GraphLink", "graphmodel"), { validate: isGraphLink });


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

import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";
import { GraphObject } from "./graphObject";
import { GraphNode } from "./graphNode";
import { Graph } from "./graph";

/**
 * Represents a link between two nodes in the graph.
 */
export class GraphLink extends GraphObject {
    /**
     * The source of the link.
     */
    public readonly source: GraphNode;

    /**
     * The target of the link.
     */
    public readonly target: GraphNode;

    /**
     * An optional index for the link (default `0`).
     */
    public readonly index: number;

    /*@internal*/
    public static _create(owner: Graph, source: GraphNode, target: GraphNode, index: number, category?: GraphCategory) {
        return new GraphLink(owner, source, target, index, category);
    }

    private constructor(owner: Graph, source: GraphNode, target: GraphNode, index: number, category?: GraphCategory) {
        super(owner, category);
        this.source = this.owner.importNode(source);
        this.target = this.owner.importNode(target);
        this.index = index;

        source._addLink(this);
        target._addLink(this);
    }

    /**
     * Gets the graph that this object belongs to.
     */
    public get owner() { return super.owner!; }

    /**
     * Gets the document schema for this object.
     */
    public get schema() { return this.owner.schema; }

    /**
     * Creates an iterator for the links related to this link.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how links are traversed and which links are yielded during iteration.
     */
    public * related(searchDirection: "source" | "target", traversal: GraphLinkTraversal = { }) {
        const { traverseLink, acceptLink } = traversal;
        const accepted = new Set<GraphLink>();
        const traversed = new Set<GraphLink>([this]);
        const traversalQueue: GraphLink[] = [this];
        let link: GraphLink | undefined;
        while (link = traversalQueue.shift()) {
            const links = searchDirection === "source" ? link.source.incomingLinks() : link.target.outgoingLinks();
            for (const link of links) {
                if (!accepted.has(link) && (!acceptLink || acceptLink(link))) {
                    accepted.add(link);
                    yield link;
                }
                if (!traversed.has(link) && (!traverseLink || traverseLink(link))) {
                    traversed.add(link);
                    traversalQueue.push(link);
                }
            }
        }
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
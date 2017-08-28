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
import { GraphCommonSchema } from "./graphCommonSchema";
import { GraphCategory } from "./graphCategory";
import { GraphObject } from "./graphObject";
import { GraphLink } from "./graphLink";
import { Graph } from "./graph";

/**
 * Represents a node in the directed graph.
 */
export class GraphNode extends GraphObject {
    private _id: string;
    private _incomingLinks: Set<GraphLink> | undefined;
    private _outgoingLinks: Set<GraphLink> | undefined;

    /*@internal*/
    public static _create(owner: Graph, id: string, category?: GraphCategory) {
        return new GraphNode(owner, id, category);
    }

    private constructor(owner: Graph, id: string, category?: GraphCategory) {
        super(owner, category);
        this._id = id;
        this.set(GraphCommonSchema.UniqueId, id);
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
     * The unique identifier for the node.
     */
    public get id() { return this._id; }

    /**
     * Gets the number of incoming links.
     */
    public get incomingLinkCount() { return this._incomingLinks ? this._incomingLinks.size : 0; }

    /**
     * Gets the number of outgoing links.
     */
    public get outgoingLinkCount() { return this._outgoingLinks ? this._outgoingLinks.size : 0; }

    /**
     * Gets the number of both incoming and outgoing links.
     */
    public get linkCount() { return this.incomingLinkCount + this.outgoingLinkCount; }

    /**
     * Creates an iterator for links that have this node as their target.
     */
    public * incomingLinks(...linkCategories: GraphCategory[]) {
        if (this._incomingLinks) {
            if (linkCategories.length) {
                const set = new Set(linkCategories);
                for (const link of this._incomingLinks) {
                    if (link.hasCategoryInSet(set, "exact")) {
                        yield link;
                    }
                }
            }
            else {
                yield* this._incomingLinks;
            }
        }
    }

    /**
     * Creates an iterator for links that have this node as their source.
     */
    public * outgoingLinks(...linkCategories: GraphCategory[]) {
        if (this._outgoingLinks) {
            if (linkCategories.length) {
                const set = new Set(linkCategories);
                for (const link of this._outgoingLinks) {
                    if (link.hasCategoryInSet(set, "exact")) {
                        yield link;
                    }
                }
            }
            else {
                yield* this._outgoingLinks;
            }
        }
    }

    /**
     * Creates an iterator for links that have this node as either their source or their target.
     */
    public * links(...linkCategories: GraphCategory[]) {
        if (this._incomingLinks || this._outgoingLinks) {
            if (linkCategories.length) {
                const set = new Set(linkCategories);
                if (this._incomingLinks) {
                    for (const link of this._incomingLinks) {
                        if (link.hasCategoryInSet(set, "exact")) {
                            yield link;
                        }
                    }
                }

                if (this._outgoingLinks) {
                    for (const link of this._outgoingLinks) {
                        if (link.hasCategoryInSet(set, "exact")) {
                            yield link;
                        }
                    }
                }
            }
            else {
                if (this._incomingLinks) {
                    yield* this._incomingLinks;
                }

                if (this._outgoingLinks) {
                    yield* this._outgoingLinks;
                }
            }
        }
    }

    /**
     * Finds the first node related to this node.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how nodes and links are traversed and which node should be returned.
     */
    public firstRelated(searchDirection: "source" | "target", traversal?: GraphNodeTraversal) {
        for (const node of this.related(searchDirection, traversal)) {
            return node;
        }
    }

    /**
     * Creates an iterator for the nodes related to this node.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how nodes and links are traversed and which nodes are yielded during iteration.
     */
    public * related(searchDirection: "source" | "target", { traverseLink, traverseNode, acceptNode }: GraphNodeTraversal = {}) {
        const accepted = new Set<GraphNode>();
        const traversed = new Set<GraphNode>([this]);
        const traversalQueue: GraphNode[] = [this];
        let node: GraphNode | undefined;
        while (node = traversalQueue.shift()) {
            const links = searchDirection === "source" ? node._incomingLinks : node._outgoingLinks;
            if (links) {
                for (const link of links) {
                    if (traverseLink && !traverseLink(link)) continue;
                    const node = searchDirection === "source" ? link.source : link.target;
                    if (!accepted.has(node) && (!acceptNode || acceptNode(node))) {
                        accepted.add(node);
                        yield node;
                    }
                    if (!traversed.has(node) && (!traverseNode || traverseNode(node))) {
                        traversed.add(node);
                        traversalQueue.push(node);
                    }
                }
            }
        }
    }

    /**
     * Creates an iterator for the sources linked to this node.
     * @param linkCategories When specified, links must have at least one of the provided categories.
     */
    public * sources(...linkCategories: GraphCategory[]) {
        if (this._incomingLinks) {
            const set = linkCategories.length && new Set(linkCategories);
            for (const link of this._incomingLinks) {
                if (!set || link.hasCategoryInSet(set, "exact")) {
                    yield link.source;
                }
            }
        }
    }

    /**
     * Creates an iterator for the targets linked to this node.
     * @param linkCategories When specified, links must have at least one of the provided categories.
     */
    public * targets(...linkCategories: GraphCategory[]) {
        if (this._outgoingLinks) {
            const set = linkCategories.length && new Set(linkCategories);
            for (const link of this._outgoingLinks) {
                if (!set || link.hasCategoryInSet(set, "exact")) {
                    yield link.target;
                }
            }
        }
    }

    /**
     * Creates a copy of the node (including its links) with a new id.
     */
    public copy(newId: string) {
        const node = new GraphNode(this.owner, newId);
        node._mergeFrom(this);
        if (this._outgoingLinks) {
            for (const link of this._outgoingLinks) {
                GraphLink._create(this.owner, node, link.target, link.index)._mergeFrom(link);
            }
        }

        if (this._incomingLinks) {
            for (const link of this._incomingLinks) {
                GraphLink._create(this.owner, link.source, node, link.index)._mergeFrom(link);
            }
        }

        return node;
    }

    /*@internal*/
    public _addLink(link: GraphLink) {
        if (link.target === this) {
            if (!this._incomingLinks) this._incomingLinks = new Set<GraphLink>()
            this._incomingLinks.add(link);
        }

        if (link.source === this) {
            if (!this._outgoingLinks) this._outgoingLinks = new Set<GraphLink>();
            this._outgoingLinks.add(link);
        }
    }

    /*@internal*/
    public _removeLink(link: GraphLink) {
        if (this._incomingLinks && link.target === this) this._incomingLinks.delete(link);
        if (this._outgoingLinks && link.source === this) this._outgoingLinks.delete(link);
    }
}

export interface GraphNodeTraversal {
    /**
     * A callback used to determine whether a link should be traversed. If not specified, all links are traversed.
     */
    traverseLink?: (link: GraphLink) => boolean;

    /**
     * A callback used to determine whether a node should be traversed. If not specified, all nodes are traversed.
     */
    traverseNode?: (node: GraphNode) => boolean;

    /**
     * A callback used to determine whether a node should be yielded. If not specified, all nodes are yielded.
     */
    acceptNode?: (node: GraphNode) => boolean;
}
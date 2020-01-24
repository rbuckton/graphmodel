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

import type { GraphSchema } from "./graphSchema";
import type { GraphCategory } from "./graphCategory";
import type { Graph } from "./graph";
import type { GraphCategoryIdLike } from "./graphCategoryIdLike";
import { GraphCommonSchema } from "./graphCommonSchema";
import { GraphObject } from "./graphObject";
import { GraphLink } from "./graphLink";
import { ChangeTrackedSet } from "./changeTrackedSet";
import { GraphNodeIdLike, isGraphNodeIdLike } from "./graphNodeIdLike";
import { DataType } from "./dataType";
import { DataTypeKey } from "./dataTypeKey";
import { hasCategoryInSetExact, getCategorySet } from "./utils";

/**
 * Represents a node in the directed graph.
 */
export class GraphNode extends GraphObject {
    private _id: GraphNodeIdLike;
    private _incomingLinks: ChangeTrackedSet<GraphLink> | undefined;
    private _outgoingLinks: ChangeTrackedSet<GraphLink> | undefined;

    /* @internal */ static _create(owner: Graph, id: GraphNodeIdLike, category?: GraphCategory) {
        return new GraphNode(owner, id, category);
    }

    private constructor(owner: Graph, id: GraphNodeIdLike, category?: GraphCategory) {
        super(owner, category);
        this._id = id;
        this.set(GraphCommonSchema.UniqueId, id);
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
     * The unique identifier for the node.
     */
    public get id(): GraphNodeIdLike {
        return this._id;
    }

    /**
     * Gets a value indicating whether this node is a container (i.e., has any outgoing containment links).
     */
    public get isContainer(): boolean {
        if (this._outgoingLinks !== undefined) {
            for (const link of this._outgoingLinks) {
                if (link.isContainment) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Gets a value indicating whether this node is contained by another node (i.e., has any incoming containment links).
     */
    public get isContained(): boolean {
        if (this._incomingLinks !== undefined) {
            for (const link of this._incomingLinks) {
                if (link.isContainment) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Gets or sets a descriptive label to associate with this node.
     */
    public get label() {
        return this.get(GraphCommonSchema.Label);
    }

    public set label(label: string | undefined) {
        this.set(GraphCommonSchema.Label, label);
    }

    /**
     * Gets the number of incoming links.
     */
    public get incomingLinkCount(): number {
        return this._incomingLinks?.size ?? 0;
    }

    /**
     * Gets the number of outgoing links.
     */
    public get outgoingLinkCount(): number {
        return this._outgoingLinks?.size ?? 0;
    }

    /**
     * Gets the number of both incoming and outgoing links.
     */
    public get linkCount(): number {
        return this.incomingLinkCount + this.outgoingLinkCount;
    }

    /**
     * Creates an iterator for links that have this node as their target.
     */
    public incomingLinks(...linkCategories: GraphCategory[]): IterableIterator<GraphLink> {
        return this._incomingLinksWorker(getCategorySet(linkCategories));
    }

    private * _incomingLinksWorker(set: ReadonlySet<GraphCategory | GraphCategoryIdLike> | undefined) {
        if (this._incomingLinks?.size) {
            if (set) {
                for (const link of this._incomingLinks) {
                    if (hasCategoryInSetExact(link, set)) {
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
     * Returns `true` if the node has at least one incoming link with one of the provided categories; otherwise, `false`.
     */
    public hasIncomingLinks(...linkCategories: GraphCategory[]): boolean {
        if (!this._incomingLinks?.size) {
            return false;
        }
        const set = getCategorySet(linkCategories);
        for (const link of this._incomingLinks) {
            if (hasCategoryInSetExact(link, set)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets an incoming link from a source node to this node, if one exists.
     */
    public getIncomingLink(source: GraphNodeIdLike | GraphNodeIdLike, index: number = 0) {
        if (this._incomingLinks === undefined) {
            return undefined;
        }

        const sourceObj = isGraphNodeIdLike(source) ? this.owner.nodes.get(source) : source;
        if (sourceObj === undefined || sourceObj.owner !== this.owner) {
            return undefined;
        }

        for (const link of this._incomingLinks) {
            if (link.source === sourceObj && link.index === index) {
                return link;
            }
        }

        return undefined;
    }

    /**
     * Deletes any incoming links to this node that have any of the provided categories.
     * If no categories are provided, all incoming links are deleted.
     * @returns The number of links that were deleted.
     */
    public deleteIncomingLinks(...linkCategories: GraphCategory[]): number {
        let linksDeleted = 0;
        if (this._incomingLinks !== undefined) {
            const set = getCategorySet(linkCategories);
            for (const link of [...this._incomingLinks]) {
                if (hasCategoryInSetExact(link, set)) {
                    if (this.owner.links.delete(link)) {
                        linksDeleted++;
                    }
                }
            }
        }
        return linksDeleted;
    }

    /**
     * Creates an iterator for links that have this node as their source.
     */
    public * outgoingLinks(...linkCategories: GraphCategory[]): IterableIterator<GraphLink> {
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
     * Returns `true` if the node has at least one outgoing link with one of the provided categories; otherwise, `false`.
     */
    public hasOutgoingLinks(...linkCategories: GraphCategory[]): boolean {
        if (!this._outgoingLinks?.size) return false;
        const set = getCategorySet(linkCategories);
        for (const link of this._outgoingLinks) {
            if (hasCategoryInSetExact(link, set)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets an outgoing link from this node to a target node, if one exists.
     */
    public getOutgoingLink(target: GraphNodeIdLike | GraphNodeIdLike, index: number = 0) {
        if (this._outgoingLinks === undefined) {
            return undefined;
        }

        const targetObj = isGraphNodeIdLike(target) ? this.owner.nodes.get(target) : target;
        if (targetObj === undefined || targetObj.owner !== this.owner) {
            return undefined;
        }

        for (const link of this._outgoingLinks) {
            if (link.target === targetObj && link.index === index) {
                return link;
            }
        }

        return undefined;
    }

    /**
     * Deletes any outgoing links from this node that have any of the provided categories.
     * If no categories are provided, all outgoing links are deleted.
     * @returns The number of links that were deleted.
     */
    public deleteOutgoingLinks(...linkCategories: GraphCategory[]): number {
        let linksDeleted = 0;
        if (this._outgoingLinks !== undefined) {
            const set = getCategorySet(linkCategories);
            for (const link of [...this._outgoingLinks]) {
                if (hasCategoryInSetExact(link, set)) {
                    if (this.owner.links.delete(link)) {
                        linksDeleted++;
                    }
                }
            }
        }
        return linksDeleted;
    }

    /**
     * Creates an iterator for links that have this node as either their source or their target.
     */
    public * links(...linkCategories: GraphCategory[]): IterableIterator<GraphLink> {
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
     * Deletes any links to or from this node that have any of the provided categories.
     * If no categories are provided, all links are deleted.
     * @returns The number of links that were deleted.
     */
    public deleteLinks(...linkCategories: GraphCategory[]): number {
        let linksDeleted = 0;
        linksDeleted += this.deleteIncomingLinks(...linkCategories);
        linksDeleted += this.deleteOutgoingLinks(...linkCategories);
        return linksDeleted;
    }

    /**
     * Removes this node from the graph.
     */
    public deleteSelf(): boolean {
        return this.owner.nodes.delete(this);
    }

    /**
     * Finds the first node related to this node.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how nodes and links are traversed and which node should be returned.
     */
    public firstRelated(searchDirection: "source" | "target", traversal?: GraphNodeTraversal): GraphNode | undefined {
        for (const node of this.related(searchDirection, traversal)) {
            return node;
        }
    }

    /**
     * Creates an iterator for the nodes related to this node.
     * @param searchDirection Either `"source"` to find related links across the incoming links of sources, or `"target"` to find related links across the outgoing links of targets.
     * @param traversal An object that specifies callbacks used to control how nodes and links are traversed and which nodes are yielded during iteration.
     */
    public * related(searchDirection: "source" | "target", traversal?: GraphNodeTraversal): IterableIterator<GraphNode> {
        const accepted = new Set<GraphNode>();
        const traversedNodes = new Set<GraphNode>([this]);
        const traversalQueue: GraphNode[] = [this];
        let node: GraphNode | undefined;
        while ((node = traversalQueue.shift()) !== undefined) {
            const links = searchDirection === "source" ?
                node._incomingLinks :
                node._outgoingLinks;
            if (links !== undefined) {
                for (const link of links) {
                    if (!(traversal?.traverseLink?.(link) ?? true)) {
                        continue;
                    }
                    const node = searchDirection === "source" ? link.source : link.target;
                    if (!accepted.has(node) && (traversal?.acceptNode?.(node) ?? true)) {
                        accepted.add(node);
                        yield node;
                    }
                    if (!traversedNodes.has(node) && (traversal?.traverseNode?.(node, link) ?? true)) {
                        traversedNodes.add(node);
                        traversalQueue.push(node);
                    }
                }
            }
        }
    }

    /**
     * Yields each node that either contains this node (if `searchDirection` is `"source"`), or is
     * contained by this node (if `searchDirection` is `"target"`).
     */
    public * relatedContainmentNodes(searchDirection: "source" | "target"): IterableIterator<GraphNode> {
        const links = searchDirection === "source" ?
            this._incomingLinks :
            this._outgoingLinks;
        if (links !== undefined) {
            for (const link of links) {
                if (link.isContainment) {
                    yield searchDirection === "source" ? link.source : link.target;
                }
            }
        }
    }

    /**
     * Creates an iterator for the sources linked to this node.
     * @param linkCategories When specified, links must have at least one of the provided categories.
     */
    public * sources(...linkCategories: GraphCategory[]): IterableIterator<GraphNode> {
        if (this._incomingLinks !== undefined) {
            const set = getCategorySet(linkCategories);
            for (const link of this._incomingLinks) {
                if (hasCategoryInSetExact(link, set)) {
                    yield link.source;
                }
            }
        }
    }

    /**
     * Creates an iterator for the targets linked to this node.
     * @param linkCategories When specified, links must have at least one of the provided categories.
     */
    public * targets(...linkCategories: GraphCategory[]): IterableIterator<GraphNode> {
        if (this._outgoingLinks !== undefined) {
            const set = getCategorySet(linkCategories);
            for (const link of this._outgoingLinks) {
                if (hasCategoryInSetExact(link, set)) {
                    yield link.target;
                }
            }
        }
    }

    /**
     * Yields each node that contains this node
     */
    public * ancestors(): IterableIterator<GraphNode> {
        const set = new Set<GraphNode>();
        for (const node of this.relatedContainmentNodes("source")) {
            if (!set.has(node)) {
                set.add(node);
                yield node;
                yield* node.ancestors();
            }
        }
    }

    /**
     * Yields each node this node contains
     */
    public * descendants(): IterableIterator<GraphNode> {
        const set = new Set<GraphNode>();
        for (const node of this.relatedContainmentNodes("target")) {
            if (!set.has(node)) {
                set.add(node);
                yield node;
                yield* node.descendants();
            }
        }
    }

    /**
     * Walks all incoming links to this node to determine if there are any circularities.
     * @param linkCategory The category of links to traverse.
     */
    public hasCircularity(...linkCategories: GraphCategory[]): boolean {
        const set = getCategorySet(linkCategories);
        const visited = new Set<GraphNode>();
        const recStack = new Set<GraphNode>();
        const nodeStack: GraphNode[] = [this];
        const doneStack: boolean[] = [false];
        while (nodeStack.length) {
            const frame = nodeStack.length - 1;
            const node = nodeStack[frame];
            if (!doneStack[frame]) {
                if (recStack.has(node)) {
                    return true;
                }
                if (!visited.has(node)) {
                    visited.add(node);
                    recStack.add(node);
                    for (const link of node._incomingLinksWorker(set)) {
                        nodeStack.push(link.source);
                        doneStack.push(false);
                    }
                }
                doneStack[frame] = true;
            }
            else {
                nodeStack.length = frame;
                doneStack.length = frame;
                recStack.delete(node);
            }
        }
        return false;
    }

    /**
     * Creates a copy of the node (including its links) with a new id.
     */
    public copy(newId: GraphNodeIdLike): GraphNode {
        const node = new GraphNode(this.owner, newId);
        node._mergeFrom(this);
        if (this._outgoingLinks !== undefined) {
            for (const link of this._outgoingLinks) {
                GraphLink._create(this.owner, node, link.target, link.index)._mergeFrom(link);
            }
        }

        if (this._incomingLinks !== undefined) {
            for (const link of this._incomingLinks) {
                GraphLink._create(this.owner, link.source, node, link.index)._mergeFrom(link);
            }
        }

        return node;
    }

    /* @internal */ _addLink(link: GraphLink) {
        if (link.target === this) {
            if (this._incomingLinks === undefined) {
                this._incomingLinks = new ChangeTrackedSet<GraphLink>(this);
            }
            this._incomingLinks.add(link);
        }

        if (link.source === this) {
            if (this._outgoingLinks === undefined) {
                this._outgoingLinks = new ChangeTrackedSet<GraphLink>(this);
            }
            this._outgoingLinks.add(link);
        }
    }

    /* @internal */ _removeLink(link: GraphLink) {
        if (link.target === this) {
            this._incomingLinks?.delete(link);
        }
        if (link.source === this) {
            this._outgoingLinks?.delete(link);
        }
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
    traverseNode?: (node: GraphNode, link: GraphLink) => boolean;

    /**
     * A callback used to determine whether a node should be yielded. If not specified, all nodes are yielded.
     */
    acceptNode?: (node: GraphNode) => boolean;
}

/* @internal */
export const isGraphNode = (value: any): value is GraphNode => value instanceof GraphNode;

/* @internal */
export const DATATYPE_GraphNode = DataType._create<GraphNode>(DataTypeKey.fromString("GraphNode", "graphmodel"), { validate: isGraphNode });

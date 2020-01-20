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

import { GraphCategory, GraphCategoryIdLike } from "./graphCategory";
import { GraphProperty, GraphPropertyIdLike } from "./graphProperty";
import { GraphNode, GraphNodeIdLike } from "./graphNode";
import { Graph } from "./graph";
import { hasCategoryInSetExact, getCategorySet, emptyIterable } from "./utils";
import { isGraphNodeIdLike } from "./validators";
import { BaseCollection } from "./baseCollection";
import { ChangeTrackedMap } from "./changeTrackedMap";
/* @internal */
import { ChangedTrackedParent, ChangeTracker } from "./graphTransactionScope";
import { EventEmitter, EventSubscription } from "./events";

/**
 * A collection of nodes within a Graph.
 */
export class GraphNodeCollection extends BaseCollection<GraphNode> {
    private _graph: Graph;
    private _nodes: ChangeTrackedMap<GraphNodeIdLike, GraphNode> | undefined;
    private _events?: EventEmitter<GraphNodeCollectionEvents>;

    /* @internal */ static _create(graph: Graph) {
        return new GraphNodeCollection(graph);
    }

    private constructor(graph: Graph) {
        super();
        this._graph = graph;
    }

    /**
     * Gets the graph to which this collection belongs.
     */
    public get graph(): Graph {
        return this._graph;
    }

    /**
     * Gets the number of nodes in the collection.
     */
    public get size(): number {
        return this._nodes?.size ?? 0;
    }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphNodeCollectionEvents): EventSubscription {
        const emitter = this._events ?? (this._events = new EventEmitter());
        return emitter.subscribe(events);
    }

    /**
     * Determines whether the collection contains the specified npde.
     */
    public has(node: GraphNode | GraphNodeIdLike): boolean {
        return isGraphNodeIdLike(node) ?
            this._nodes?.has(node) ?? false :
            this._nodes?.get(node.id) === node;
    }

    /**
     * Gets the node with the provided id.
     */
    public get(id: GraphNodeIdLike): GraphNode | undefined {
        return this._nodes?.get(id);
    }

    /**
     * Gets the node with the provided id. If it does not exist, a new node is created.
     */
    public getOrCreate(id: GraphNodeIdLike, category?: GraphCategory): GraphNode {
        let node = this.get(id);
        if (node === undefined) {
            node = GraphNode._create(this.graph, id, category);
            this.add(node);
        }
        else if (category !== undefined) {
            node.addCategory(category);
        }

        return node;
    }

    /**
     * Adds a node to the collection.
     */
    public add(node: GraphNode): this {
        const ownNode = this.get(node.id);
        if (ownNode !== undefined) {
            if (ownNode !== node) {
                throw new Error(`A node with the id '${node.id.toString()}' already exists.`);
            }
        }
        else if (this.graph.importNode(node) === node) {
            if (this._nodes === undefined) {
                this._nodes = new ChangeTrackedMap<string, GraphNode>(this);
            }
            this._nodes.set(node.id, node);
            if (node.linkCount) {
                for (const link of node.links()) {
                    this.graph.links.add(link);
                }
            }

            this._raiseOnAdded(node);
        }

        return this;
    }

    /**
     * Removes a node from the collection.
     */
    public delete(node: GraphNode): boolean;
    /**
     * Removes the node with the specified id from the collection.
     */
    public delete(node: GraphNodeIdLike): GraphNode | false;
    public delete(node: GraphNode | GraphNodeIdLike): GraphNode | boolean;
    public delete(node: GraphNode | GraphNodeIdLike): GraphNode | boolean {
        if (this._nodes !== undefined) {
            const nodeId = isGraphNodeIdLike(node) ? node : node.id;
            const ownNode = this._nodes.get(nodeId);
            if (ownNode !== undefined) {
                this._nodes.delete(nodeId, ownNode);
                if (ownNode.linkCount) {
                    for (const link of ownNode.links()) {
                        this.graph.links.delete(link);
                    }
                }

                this._raiseOnDeleted(ownNode);
                return isGraphNodeIdLike(node) ? ownNode : true;
            }
        }

        return false;
    }

    /**
     * Removes all nodes from the collection.
     */
    public clear(): void {
        if (this._nodes !== undefined) {
            for (const ownNode of this.values()) {
                if (ownNode.linkCount) {
                    for (const link of ownNode.links()) {
                        this.graph.links.delete(link);
                    }
                }
            }

            this._nodes.clear();
        }
    }

    /**
     * Yields each node in the graph that has no incoming links.
     */
    public * rootNodes(): IterableIterator<GraphNode> {
        for (const node of this.values()) {
            if (!node.hasIncomingLinks()) {
                yield node;
            }
        }
    }

    /**
     * Yields each node in the graph that has no outgoing links.
     */
    public * leafNodes(): IterableIterator<GraphNode> {
        for (const node of this.values()) {
            if (!node.hasOutgoingLinks()) {
                yield node;
            }
        }
    }

    /**
     * Creates an iterator for the node ids in the collection.
     */
    public keys(): IterableIterator<GraphNodeIdLike> {
        return this._nodes?.keys() ?? emptyIterable;
    }

    /**
     * Creates an iterator for the values in the collection.
     */
    public values(): IterableIterator<GraphNode> {
        return this._nodes?.values() ?? emptyIterable;
    }

    /**
     * Creates an iterator for the values in the collection.
     */
    public entries(): IterableIterator<[GraphNodeIdLike, GraphNode]> {
        return this._nodes?.entries() ?? emptyIterable;
    }

    /**
     * Creates an iterator for the values in the collection.
     */
    public [Symbol.iterator]() {
        return this.values();
    }

    /**
     * Creates an iterator for each node with the specified property key and value.
     */
    public byProperty<V>(key: GraphProperty<V>, value: V | undefined): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for each node with the specified property key and value.
     */
    public byProperty(key: GraphPropertyIdLike | GraphProperty, value: any): IterableIterator<GraphNode>;
    public * byProperty(key: GraphPropertyIdLike | GraphProperty, value: any) {
        for (const node of this.values()) {
            if (node.get(key) === value) {
                yield node;
            }
        }
    }

    /**
     * Creates an iterator for each node with any of the specified categories.
     */
    public * byCategory(...categories: (GraphCategoryIdLike | GraphCategory)[]): IterableIterator<GraphNode> {
        const set = getCategorySet(categories);
        for (const node of this.values()) {
            if (hasCategoryInSetExact(node, set)) {
                yield node;
            }
        }
    }

    /* @internal */
    [ChangedTrackedParent.committed](changeTracker: ChangeTracker): void {
    }

    /* @internal */
    [ChangedTrackedParent.rolledBack](changeTracker: ChangeTracker): void {
        for (const [, value] of changeTracker.addedItems()) {
            const node = value as GraphNode;
            node.deleteLinks();
            this._raiseOnDeleted(value);
        }
        for (const [, value] of changeTracker.deletedItems()) {
            const node = value as GraphNode;
            for (const link of node.incomingLinks()) {
                this._graph.links.add(link);
            }
            for (const link of node.outgoingLinks()) {
                this._graph.links.delete(link);
            }
            this._raiseOnAdded(node);
        }
    }

    private _raiseOnAdded(node: GraphNode) {
        this._events?.emit("onAdded", node);
    }

    private _raiseOnDeleted(node: GraphNode) {
        this._events?.emit("onDeleted", node);
    }
}

/* @internal */
export interface GraphNodeCollection extends ChangedTrackedParent {}

export interface GraphNodeCollectionEvents {
    /**
     * An event raised when a node is added to the collection.
     */
    onAdded?: (node: GraphNode) => void;

    /**
     * An event raised when a node is removed from the collection.
     */
    onDeleted?: (node: GraphNode) => void;
}

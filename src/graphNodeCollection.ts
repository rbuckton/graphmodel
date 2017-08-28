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
import { GraphProperty } from "./graphProperty";
import { GraphNode } from "./graphNode";
import { Graph } from "./graph";

/**
 * A collection of nodes within a Graph.
 */
export class GraphNodeCollection {
    private _graph: Graph;
    private _nodes: Map<string, GraphNode> | undefined;
    private _observers: Map<GraphNodeCollectionSubscription, GraphNodeCollectionEvents> | undefined;

    /*@internal*/
    public static _create(graph: Graph) {
        return new GraphNodeCollection(graph);
    }

    private constructor(graph: Graph) {
        this._graph = graph;
    }

    /**
     * Gets the graph to which this collection belongs.
     */
    public get graph() { return this._graph; }

    /**
     * Gets the number of nodes in the collection.
     */
    public get size() { return this._nodes ? this._nodes.size : 0; }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphNodeCollectionEvents) {
        const observers = this._observers || (this._observers = new Map<GraphNodeCollectionSubscription, GraphNodeCollectionEvents>());
        const subscription: GraphNodeCollectionSubscription = { unsubscribe: () => { observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    /**
     * Determines whether the collection contains the specified npde.
     */
    public has(node: GraphNode) {
        return this._nodes !== undefined
            && this._nodes.get(node.id) === node;
    }

    /**
     * Gets the node with the provided id.
     */
    public get(id: string) {
        return this._nodes
            && this._nodes.get(id);
    }

    /**
     * Gets the node with the provided id. If it does not exist, a new node is created.
     */
    public getOrCreate(id: string, category?: GraphCategory) {
        let node = this.get(id);
        if (!node) {
            node = GraphNode._create(this.graph, id, category);
            this.add(node);
        }
        else if (category) {
            node.addCategory(category);
        }

        return node;
    }

    /**
     * Adds a node to the collection.
     */
    public add(node: GraphNode) {
        const ownNode = this.get(node.id);
        if (ownNode) {
            if (ownNode !== node) throw new Error(`A node with the id '${node.id}' already exists.`);
        }
        else if (this.graph.importNode(node) === node) {
            if (!this._nodes) this._nodes = new Map<string, GraphNode>();
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
    public delete(nodeId: string): GraphNode;
    public delete(node: string | GraphNode) {
        if (this._nodes) {
            const nodeId = typeof node === "string" ? node : node.id;
            const ownNode = this._nodes.get(nodeId);
            if (ownNode) {
                this._nodes.delete(nodeId);
                if (ownNode.linkCount) {
                    for (const link of ownNode.links()) {
                        this.graph.links.delete(link);
                    }
                }

                this._raiseOnDeleted(ownNode);
                return typeof node === "string" ? ownNode : true;
            }
        }

        return typeof node === "string" ? undefined : false;
    }

    /**
     * Removes all nodes from the collection.
     */
    public clear() {
        if (this._nodes) {
            for (const ownNode of this) {
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
     * Creates an iterator for the values in the collection.
     */
    public * values() {
        if (this._nodes) {
            yield* this._nodes.values();
        }
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
    public byProperty<V>(key: GraphProperty<V>, value: V): IterableIterator<GraphNode>;
    /**
     * Creates an iterator for each node with the specified property key and value.
     */
    public byProperty(key: string | GraphProperty, value: any): IterableIterator<GraphNode>;
    public * byProperty(key: string | GraphProperty, value: any) {
        for (const node of this) if (node.get(key) === value) yield node;
    }

    /**
     * Creates an iterator for each node with any of the specified categories.
     */
    public * byCategory(...categories: GraphCategory[]) {
        const set = categories.length && new Set(categories);
        for (const node of this) if (!set || node.hasCategory(set)) yield node;
    }

    /**
     * Creates an iterator for each node matching the provided callback.
     */
    public * filter(cb: (node: GraphNode) => boolean) {
        for (const node of this) if (cb(node)) yield node;
    }

    private _raiseOnAdded(node: GraphNode) {
        if (this._observers) {
            for (const { onAdded } of this._observers.values()) {
                if (onAdded) {
                    onAdded(node);
                }
            }
        }
    }

    private _raiseOnDeleted(node: GraphNode) {
        if (this._observers) {
            for (const { onDeleted } of this._observers.values()) {
                if (onDeleted) {
                    onDeleted(node);
                }
            }
        }
    }
}

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

export interface GraphNodeCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}
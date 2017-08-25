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
import { GraphLink } from "./graphLink";
import { GraphNode } from "./graphNode";
import { Graph } from "./graph";

/**
 * A collection of links within a Graph.
 */
export class GraphLinkCollection {
    /**
     * Gets the graph to which this collection belongs.
     */
    public readonly graph: Graph;

    private _links: Map<string, GraphLink> | undefined;
    private _observers: Map<GraphLinkCollectionSubscription, GraphLinkCollectionEvents> | undefined;

    /*@internal*/
    public static _create(graph: Graph) {
        return new GraphLinkCollection(graph);
    }

    private constructor(graph: Graph) {
        this.graph = graph;
    }

    /**
     * Gets the number of links in the collection.
     */
    public get size() { return this._links ? this._links.size : 0; }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphLinkCollectionEvents) {
        const observers = this._observers || (this._observers = new Map<GraphLinkCollectionSubscription, GraphLinkCollectionEvents>());
        const subscription: GraphLinkCollectionSubscription = { unsubscribe: () => { observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    /**
     * Determines whether the collection contains the specified link.
     */
    public has(link: GraphLink) {
        const key = linkId(link.source.id, link.target.id, link.index);
        return this._links !== undefined
            && this._links.get(key) === link;
    }

    /**
     * Gets the link for the provided source and target.
     */
    public get(sourceId: string, targetId: string, index = 0) {
        const key = linkId(sourceId, targetId, index);
        return this._links
            && this._links.get(key);
    }

    /**
     * Gets the link for the provided source and target. If one is not found, a new link is created.
     */
    public getOrCreate(source: string | GraphNode, target: string | GraphNode, index?: number): GraphLink;

    /**
     * Gets the link for the provided source and target. If one is not found, a new link is created.
     */
    public getOrCreate(source: string | GraphNode, target: string | GraphNode, category: GraphCategory): GraphLink;
    public getOrCreate(source: string | GraphNode, target: string | GraphNode, indexOrCategory?: number | GraphCategory) {
        const sourceId = typeof source === "string" ? source : source.id;
        const targetId = typeof target === "string" ? target : target.id;
        const index = typeof indexOrCategory === "number" ? indexOrCategory : 0;
        const category = typeof indexOrCategory === "number" ? undefined : indexOrCategory;
        let link = this.get(sourceId, targetId, index);
        if (!link) {
            const source = this.graph.nodes.getOrCreate(sourceId);
            const target = this.graph.nodes.getOrCreate(targetId);
            link = GraphLink._create(this.graph, source, target, index, category);
            this.add(link);
        }
        else if (category) {
            link.addCategory(category);
        }

        return link;
    }

    /**
     * Adds a link to the collection.
     */
    public add(link: GraphLink) {
        const key = linkId(link.source.id, link.target.id, link.index);
        if (!this._links) this._links = new Map<string, GraphLink>();
        const ownLink = this._links.get(key);
        if (ownLink) {
            if (ownLink !== link) {
                ownLink._merge(link);
            }
        }
        else if (this.graph.importLink(link) === link) {
            this._links.set(key, link);
            link.source._addLink(link);
            link.target._addLink(link);
            this.graph.nodes.add(link.source);
            this.graph.nodes.add(link.target);
            this._raiseOnAdded(link);
        }

        return this;
    }

    /**
     * Removes a link from the collection.
     */
    public delete(link: GraphLink): boolean;
    /**
     * Removes the link with the specified source, target, and category from the collection.
     */
    public delete(sourceId: string, targetId: string, category: GraphCategory): GraphLink;
    public delete(linkOrSourceId: GraphLink | string, targetId?: string, category?: GraphCategory) {
        if (this._links) {
            let sourceId: string;
            let index: number;
            if (typeof linkOrSourceId === "string") {
                sourceId = linkOrSourceId;
                index = 0;
            }
            else {
                sourceId = linkOrSourceId.source.id;
                targetId = linkOrSourceId.target.id;
                index = linkOrSourceId.index;
            }

            const key = linkId(sourceId, targetId!, index);
            const ownLink = this._links.get(key);
            if (ownLink) {
                let remove: boolean;
                if (category !== undefined) {
                    ownLink.deleteCategory(category);
                    remove = ownLink.categoryCount === 0;
                }
                else {
                    remove = true;
                }
                if (remove) {
                    this._links.delete(key);
                    ownLink.source._removeLink(ownLink);
                    ownLink.target._removeLink(ownLink);
                    this._raiseOnDeleted(ownLink);
                    return typeof linkOrSourceId === "string" ? ownLink : true;
                }
            }
        }
        return typeof linkOrSourceId === "string" ? undefined : false;
    }

    /**
     * Removes all links from the collection.
     */
    public clear() {
        if (this._links) {
            for (const ownLink of this) {
                ownLink.source._removeLink(ownLink);
                ownLink.target._removeLink(ownLink);
            }

            this._links.clear();
        }
    }

    /**
     * Creates an iterator for the values in the collection.
     */
    public * values() {
        if (this._links) yield* this._links.values();
    }

    /**
     * Creates an iterator for the values in the collection.
     */
    public [Symbol.iterator]() {
        return this.values();
    }

    /**
     * Creates an iterator for each link between a source and a target node.
     */
    public * between(source: GraphNode, target: GraphNode) {
        if (source.outgoingLinkCount && target.incomingLinkCount) {
            if (source.outgoingLinkCount < target.incomingLinkCount) {
                for (const outgoing of source.outgoingLinks()) {
                    if (outgoing.target === target) yield outgoing;
                }
            }
            else {
                for (const incoming of target.incomingLinks()) {
                    if (incoming.source === source) yield incoming;
                }
            }
        }
    }

    /**
     * Creates an iterator for each incoming link to a node.
     */
    public * to(node: string | GraphNode, ...categories: GraphCategory[]) {
        const set = categories.length && new Set(categories);
        const target = typeof node === "string" ? this.graph.nodes.get(node) : node;
        if (target) for (const incoming of target.incomingLinks()) if (!set || incoming.hasCategoryInSet(set, "exact")) yield incoming;
    }

    /**
     * Creates an iterator for each outgoing link from a node.
     */
    public * from(node: string | GraphNode, ...categories: GraphCategory[]) {
        const set = categories.length && new Set(categories);
        const source = typeof node === "string" ? this.graph.nodes.get(node) : node;
        if (source) for (const outgoing of source.outgoingLinks()) if (!set || outgoing.hasCategoryInSet(set, "exact")) yield outgoing;
    }

    /**
     * Creates an iterator for each link with the specified property key and value.
     */
    public byProperty<V>(key: GraphProperty<V>, value: V): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each link with the specified property key and value.
     */
    public byProperty(key: string | GraphProperty, value: any): IterableIterator<GraphLink>;
    public * byProperty(key: string | GraphProperty, value: any) {
        for (const link of this) if (link.get(key) === value) yield link;
    }

    /**
     * Creates an iterator for each link with any of the specified categories.
     */
    public * byCategory(...categories: GraphCategory[]) {
        const set = categories.length && new Set(categories);
        for (const link of this) if (!set || link.hasCategoryInSet(set, "exact")) yield link;
    }

    /**
     * Creates an iterator for each link matching the provided callback.
     */
    public * filter(cb: (link: GraphLink) => boolean) {
        for (const link of this) if (cb(link)) yield link;
    }

    private _raiseOnAdded(link: GraphLink) {
        if (this._observers) {
            for (const { onAdded } of this._observers.values()) {
                if (onAdded) {
                    onAdded(link);
                }
            }
        }
    }

    private _raiseOnDeleted(link: GraphLink) {
        if (this._observers) {
            for (const { onDeleted } of this._observers.values()) {
                if (onDeleted) {
                    onDeleted(link);
                }
            }
        }
    }
}

export interface GraphLinkCollectionEvents {
    /**
     * An event raised when a link is added to the collection.
     */
    onAdded?: (this: void, link: GraphLink) => void;

    /**
     * An event raised when a link is removed from the collection.
     */
    onDeleted?: (this: void, link: GraphLink) => void;
}

export interface GraphLinkCollectionSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}

function linkId(sourceId: string, targetId: string, index: number) {
    return `#(sourceId=${sourceId}) (targetId=${targetId}) (index=${index})`;
}
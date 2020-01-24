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
import type { GraphCategoryIdLike } from "./graphCategoryIdLike";
import type { GraphProperty } from "./graphProperty";
import type { GraphPropertyIdLike } from "./graphPropertyIdLike";
import type { GraphNode } from "./graphNode";
import type { GraphNodeIdLike } from "./graphNodeIdLike";
import type { Graph } from "./graph";
import { BaseCollection } from "./baseCollection";
import { ChangeTrackedMap } from "./changeTrackedMap";
import { EventEmitter, EventSubscription } from "./events";
import { GraphLink } from "./graphLink";
import { hasCategoryInSetExact, getCategorySet, getTaggedId, emptyIterable } from "./utils";
import { isGraphNodeIdLike } from "./graphNodeIdLike";

/**
 * A collection of links within a Graph.
 */
export class GraphLinkCollection extends BaseCollection<GraphLink> {
    private _size = 0;
    private _graph: Graph;
    private _links: ChangeTrackedMap<string, GraphLink> | undefined;
    private _events?: EventEmitter<GraphLinkCollectionEvents>;

    /*@internal*/
    public static _create(graph: Graph) {
        return new GraphLinkCollection(graph);
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
     * Gets the number of links in the collection.
     */
    public get size(): number {
        return this._size;
    }

    /**
     * Creates a subscription for a set of named events.
     */
    public subscribe(events: GraphLinkCollectionEvents): EventSubscription {
        const emitter = this._events ?? (this._events = new EventEmitter());
        return emitter.subscribe(events);
    }

    /**
     * Determines whether the collection contains the specified link.
     */
    public has(link: GraphLink): boolean {
        return this.get(link.source, link.target, link.index) === link;
    }

    /**
     * Gets the link for the provided source and target.
     */
    public get(source: GraphNode | GraphNodeIdLike, target: GraphNode | GraphNodeIdLike, index: number = 0): GraphLink | undefined {
        const sourceId = isGraphNodeIdLike(source) ? source : source.id;
        const targetId = isGraphNodeIdLike(target) ? target : target.id;
        return this._links?.get(linkId(sourceId, targetId, index));
    }

    /**
     * Gets the link for the provided source and target. If one is not found, a new link is created.
     */
    public getOrCreate(source: GraphNodeIdLike | GraphNode, target: GraphNodeIdLike | GraphNode, index?: number): GraphLink;
    /**
     * Gets the link for the provided source and target. If one is not found, a new link is created.
     */
    public getOrCreate(source: GraphNodeIdLike | GraphNode, target: GraphNodeIdLike | GraphNode, category: GraphCategory): GraphLink;
    public getOrCreate(source: GraphNodeIdLike | GraphNode, target: GraphNodeIdLike | GraphNode, indexOrCategory?: number | GraphCategory) {
        const sourceId = isGraphNodeIdLike(source) ? source : source.id;
        const targetId = isGraphNodeIdLike(target) ? target : target.id;
        const index = typeof indexOrCategory === "number" ? indexOrCategory : 0;
        const category = typeof indexOrCategory === "number" ? undefined : indexOrCategory;
        let link = this.get(sourceId, targetId, index);
        if (link === undefined) {
            const source = this.graph.nodes.getOrCreate(sourceId);
            const target = this.graph.nodes.getOrCreate(targetId);
            link = GraphLink._create(this.graph, source, target, index, category);
            this.add(link);
        }
        else if (category !== undefined) {
            link.addCategory(category);
        }
        return link;
    }

    /**
     * Adds a link to the collection.
     */
    public add(link: GraphLink): this {
        const sourceId = link.source.id;
        const targetId = link.target.id;
        const index = link.index;
        if (this._links === undefined) {
            this._links = new ChangeTrackedMap(this);
        }

        const ownLink = this._links.get(linkId(sourceId, targetId, index));
        if (ownLink !== undefined) {
            if (ownLink !== link) {
                ownLink._mergeFrom(link);
            }
        }
        else if (this.graph.importLink(link) === link) {
            this._size++;
            this._links.set(linkId(sourceId, targetId, index), link);
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
    public delete(sourceId: GraphNodeIdLike, targetId: GraphNodeIdLike, category: GraphCategory): GraphLink | false;
    public delete(linkOrSourceId: GraphLink | GraphNodeIdLike, targetId?: GraphNodeIdLike, category?: GraphCategory) {
        if (this._links !== undefined) {
            let sourceId: GraphNodeIdLike;
            let index: number;
            if (isGraphNodeIdLike(linkOrSourceId)) {
                if (targetId === undefined) throw new TypeError("Argument expected: targetId");
                sourceId = linkOrSourceId;
                index = 0;
            }
            else {
                sourceId = linkOrSourceId.source.id;
                targetId = linkOrSourceId.target.id;
                index = linkOrSourceId.index;
            }

            const ownLink = this._links.get(linkId(sourceId, targetId, index));
            if (ownLink !== undefined) {
                let remove: boolean;
                if (category !== undefined) {
                    ownLink.deleteCategory(category);
                    remove = ownLink.categoryCount === 0;
                }
                else {
                    remove = true;
                }
                if (remove) {
                    this._links.delete(linkId(sourceId, targetId, index), ownLink);
                    this._size--;
                    ownLink.source._removeLink(ownLink);
                    ownLink.target._removeLink(ownLink);
                    this._raiseOnDeleted(ownLink);
                    return isGraphNodeIdLike(linkOrSourceId) ? ownLink : true;
                }
            }
        }
        return false;
    }

    /**
     * Removes all links from the collection.
     */
    public clear(): void {
        if (this._links !== undefined) {
            for (const ownLink of this.values()) {
                ownLink.source._removeLink(ownLink);
                ownLink.target._removeLink(ownLink);
            }

            this._size = 0;
            this._links.clear();
        }
    }

    /**
     * Creates an iterator for the values in the collection.
     */
    public values(): IterableIterator<GraphLink> {
        return this._links?.values() ?? emptyIterable;
    }

    /**
     * Creates an iterator for the values in the collection.
     */
    public [Symbol.iterator](): IterableIterator<GraphLink> {
        return this.values();
    }

    /**
     * Creates an iterator for each link between a source and a target node.
     */
    public * between(source: GraphNode, target: GraphNode): IterableIterator<GraphLink> {
        if (source.outgoingLinkCount > 0 && target.incomingLinkCount > 0) {
            if (source.outgoingLinkCount < target.incomingLinkCount) {
                for (const outgoing of source.outgoingLinks()) {
                    if (outgoing.target === target) {
                        yield outgoing;
                    }
                }
            }
            else {
                for (const incoming of target.incomingLinks()) {
                    if (incoming.source === source) {
                        yield incoming;
                    }
                }
            }
        }
    }

    /**
     * Creates an iterator for each incoming link to a node.
     */
    public * to(node: GraphNodeIdLike | GraphNode, ...linkCategories: (GraphCategory | GraphCategoryIdLike)[]): IterableIterator<GraphLink> {
        const set = getCategorySet(linkCategories);
        const target = isGraphNodeIdLike(node) ? this.graph.nodes.get(node) : node;
        if (target !== undefined) {
            for (const incoming of target.incomingLinks()) {
                if (hasCategoryInSetExact(incoming, set)) {
                    yield incoming;
                }
            }
        }
    }

    /**
     * Creates an iterator for each outgoing link from a node.
     */
    public * from(node: GraphNodeIdLike | GraphNode, ...linkCategories: (GraphCategory | GraphCategoryIdLike)[]): IterableIterator<GraphLink> {
        const set = getCategorySet(linkCategories);
        const source = isGraphNodeIdLike(node) ? this.graph.nodes.get(node) : node;
        if (source !== undefined) {
            for (const outgoing of source.outgoingLinks()) {
                if (hasCategoryInSetExact(outgoing, set)) {
                    yield outgoing;
                }
            }
        }
    }

    /**
     * Creates an iterator for each link with the specified property key and value.
     */
    public byProperty<V>(key: GraphProperty<V>, value: V): IterableIterator<GraphLink>;
    /**
     * Creates an iterator for each link with the specified property key and value.
     */
    public byProperty(key: GraphPropertyIdLike | GraphProperty, value: any): IterableIterator<GraphLink>;
    public * byProperty(key: GraphPropertyIdLike | GraphProperty, value: any) {
        for (const link of this.values()) {
            if (link.get(key) === value) {
                yield link;
            }
        }
    }

    /**
     * Creates an iterator for each link with any of the specified categories.
     */
    public * byCategory(...linkCategories: (GraphCategory | GraphCategoryIdLike)[]): IterableIterator<GraphLink> {
        const set = getCategorySet(linkCategories);
        for (const link of this.values()) {
            if (hasCategoryInSetExact(link, set)) {
                yield link;
            }
        }
    }

    private _raiseOnAdded(link: GraphLink) {
        this._events?.emit("onAdded", link);
    }

    private _raiseOnDeleted(link: GraphLink) {
        this._events?.emit("onDeleted", link);
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

function linkId(sourceId: GraphNodeIdLike, targetId: GraphNodeIdLike, index: number) {
    return `#(sourceId=${getTaggedId(sourceId)}) (targetId=${getTaggedId(targetId)}) (index=${index})`;
}
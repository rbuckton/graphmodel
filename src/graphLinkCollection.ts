import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";
import { GraphProperty } from "./graphProperty";
import { GraphLink } from "./graphLink";
import { GraphNode } from "./graphNode";
import { Graph } from "./graph";

export class GraphLinkCollection<P extends object = any> {
    public readonly graph: Graph<P>;

    private readonly _links = new Map<string, GraphLink<P>>();
    private readonly _observers = new Map<GraphLinkCollectionSubscription, GraphLinkCollectionEvents<P>>();

    /*@internal*/ static _create<P extends object>(graph: Graph<P>) {
        return new GraphLinkCollection(graph);
    }

    private constructor(graph: Graph<P>) {
        this.graph = graph;
    }

    public get size() { return this._links.size; }

    public subscribe(events: GraphLinkCollectionEvents<P>) {
        const subscription: GraphLinkCollectionSubscription = { unsubscribe: () => { this._observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    public has(link: GraphLink<P>) {
        const key = linkId(link.source.id, link.target.id, link.index);
        return this._links.get(key) === link;
    }

    public get(sourceId: string, targetId: string, index = 0) {
        const key = linkId(sourceId, targetId, index);
        return this._links.get(key);
    }

    public getOrCreate(source: string | GraphNode<P>, target: string | GraphNode<P>, index?: number): GraphLink<P>;
    public getOrCreate(source: string | GraphNode<P>, target: string | GraphNode<P>, category: GraphCategory): GraphLink<P>;
    public getOrCreate(source: string | GraphNode<P>, target: string | GraphNode<P>, indexOrCategory?: number | GraphCategory) {
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

    public add(link: GraphLink<P>) {
        const key = linkId(link.source.id, link.target.id, link.index);
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

    public delete(link: GraphLink<P>): boolean;
    public delete(sourceId: string, targetId: string, category: GraphCategory): GraphLink<P>;
    public delete(linkOrSourceId: GraphLink<P> | string, targetId?: string, category?: GraphCategory) {
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

        return typeof linkOrSourceId === "string" ? undefined : false;
    }

    public clear() {
        for (const ownLink of this) {
            ownLink.source._removeLink(ownLink);
            ownLink.target._removeLink(ownLink);
        }

        this._links.clear();
    }

    public values() {
        return this._links.values();
    }

    public [Symbol.iterator]() {
        return this._links.values();
    }

    public * between(source: GraphNode<P>, target: GraphNode<P>) {
        if (source.outgoingLinks.size && target.incomingLinks.size) {
            if (source.outgoingLinks.size < target.incomingLinks.size) {
                for (const outgoing of source.outgoingLinks) {
                    if (outgoing.target === target) yield outgoing;
                }
            }
            else {
                for (const incoming of target.incomingLinks) {
                    if (incoming.source === source) yield incoming;
                }
            }
        }
    }

    public * to(node: string | GraphNode<P>, ...categories: GraphCategory[]) {
        const set = categories.length && new Set(categories);
        const target = typeof node === "string" ? this.graph.nodes.get(node) : node;
        if (target) for (const incoming of target.incomingLinks) if (!set || incoming.hasCategoryInSet(set, "exact")) yield incoming;
    }

    public * from(node: string | GraphNode<P>, ...categories: GraphCategory[]) {
        const set = categories.length && new Set(categories);
        const source = typeof node === "string" ? this.graph.nodes.get(node) : node;
        if (source) for (const outgoing of source.outgoingLinks) if (!set || outgoing.hasCategoryInSet(set, "exact")) yield outgoing;
    }

    public * byProperty<K extends keyof P>(key: K | GraphProperty<K, P[K]>, value: P[K]) {
        for (const link of this) if (link.get(key) === value) yield link;
    }

    public * byCategory(...categories: GraphCategory[]) {
        const set = categories.length && new Set(categories);
        for (const link of this) if (!set || link.hasCategoryInSet(set, "exact")) yield link;
    }

    public * filter(cb: (link: GraphLink<P>) => boolean) {
        for (const link of this) if (cb(link)) yield link;
    }

    private _raiseOnAdded(link: GraphLink<P>) {
        for (const { onAdded } of this._observers.values()) if (onAdded) onAdded(link);
    }

    private _raiseOnDeleted(link: GraphLink<P>) {
        for (const { onDeleted } of this._observers.values()) if (onDeleted) onDeleted(link);
    }
}

export interface GraphLinkCollectionEvents<P extends object = any> {
    onAdded?: (this: void, link: GraphLink<P>) => void;
    onDeleted?: (this: void, link: GraphLink<P>) => void;
}

export interface GraphLinkCollectionSubscription {
    unsubscribe(): void;
}

function linkId(sourceId: string, targetId: string, index: number) {
    return `#(sourceId=${sourceId}) (targetId=${targetId}) (index=${index})`;
}
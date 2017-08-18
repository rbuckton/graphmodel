import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";
import { GraphProperty } from "./graphProperty";
import { GraphNode } from "./graphNode";
import { Graph } from "./graph";

export class GraphNodeCollection<P extends object = any> {
    public readonly graph: Graph<P>;

    private readonly _nodes = new Map<string, GraphNode<P>>();
    private readonly _observers = new Map<GraphNodeCollectionSubscription, GraphNodeCollectionEvents<P>>();

    /*@internal*/ static _create<P extends object>(graph: Graph<P>) {
        return new GraphNodeCollection(graph);
    }

    private constructor(graph: Graph<P>) {
        this.graph = graph;
    }

    public get size() { return this._nodes.size; }

    public subscribe(events: GraphNodeCollectionEvents<P>) {
        const subscription: GraphNodeCollectionSubscription = { unsubscribe: () => { this._observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    public has(node: GraphNode<P>) {
        return this._nodes.get(node.id) === node;
    }

    public get(id: string) {
        return this._nodes.get(id);
    }

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

    public add(node: GraphNode<P>) {
        const ownNode = this.get(node.id);
        if (ownNode) {
            if (ownNode !== node) throw new Error(`A node with the id '${node.id}' already exists.`);
        }
        else if (this.graph.importNode(node) === node) {
            this._nodes.set(node.id, node);
            for (const link of node.outgoingLinks) this.graph.links.add(link);
            for (const link of node.incomingLinks) this.graph.links.add(link);
            this._raiseOnAdded(node);
        }
        return this;
    }

    public delete(nodeId: string): GraphNode<P>;
    public delete(node: GraphNode<P>): boolean;
    public delete(node: string | GraphNode<P>) {
        const nodeId = typeof node === "string" ? node : node.id;
        const ownNode = this._nodes.get(nodeId);
        if (ownNode) {
            this._nodes.delete(nodeId);
            for (const link of ownNode.outgoingLinks) this.graph.links.delete(link);
            for (const link of ownNode.incomingLinks) this.graph.links.delete(link);
            this._raiseOnDeleted(ownNode);
            return typeof node === "string" ? ownNode : true;
        }

        return typeof node === "string" ? undefined : false;
    }

    public clear() {
        for (const ownNode of this) {
            for (const link of ownNode.outgoingLinks) this.graph.links.delete(link);
            for (const link of ownNode.incomingLinks) this.graph.links.delete(link);
        }

        this._nodes.clear();
    }

    public values() {
        return this._nodes.values();
    }

    public [Symbol.iterator]() {
        return this._nodes.values();
    }

    public * byProperty<K extends keyof P>(key: K | GraphProperty<K, P[K]>, value: P[K]) {
        for (const node of this) if (node.get(key) === value) yield node;
    }

    public * byCategory(...categories: GraphCategory[]) {
        const set = categories.length && new Set(categories);
        for (const node of this) if (!set || node.hasCategory(set)) yield node;
    }

    public * filter(cb: (node: GraphNode<P>) => boolean) {
        for (const node of this) if (cb(node)) yield node;
    }

    private _raiseOnAdded(node: GraphNode<P>) {
        for (const { onAdded } of this._observers.values()) if (onAdded) onAdded(node);
    }

    private _raiseOnDeleted(node: GraphNode<P>) {
        for (const { onDeleted } of this._observers.values()) if (onDeleted) onDeleted(node);
    }
}

export interface GraphNodeCollectionEvents<P extends object = any> {
    onAdded?: (node: GraphNode<P>) => void;
    onDeleted?: (node: GraphNode<P>) => void;
}

export interface GraphNodeCollectionSubscription {
    unsubscribe(): void;
}
import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";
import { GraphNode } from "./graphNode";
import { Graph } from "./graph";

export class GraphNodeCollection<P extends object = any> {
    public readonly graph: Graph<P>;

    private readonly nodes = new Map<string, GraphNode<P>>();
    private readonly observers = new Map<GraphNodeCollectionSubscription, GraphNodeCollectionEvents<P>>();

    /*@internal*/ static create<P extends object>(graph: Graph<P>) {
        return new GraphNodeCollection(graph);
    }

    private constructor(graph: Graph<P>) {
        this.graph = graph;
    }

    public get size() { return this.nodes.size; }

    public subscribe(events: GraphNodeCollectionEvents<P>) {
        const subscription: GraphNodeCollectionSubscription = { unsubscribe: () => { this.observers.delete(subscription); } };
        this.observers.set(subscription, events);
        return subscription;
    }

    public has(node: GraphNode<P>) {
        return this.nodes.has(node.id);
    }

    public get(id: string) {
        return this.nodes.get(id);
    }

    public getOrCreate(id: string, category?: GraphCategory) {
        let node = this.get(id);
        if (!node) {
            node = GraphNode.create(this.graph, id, category);
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
            this.nodes.set(node.id, node);
            for (const link of node.outgoingLinks) this.graph.links.add(link);
            for (const link of node.incomingLinks) this.graph.links.add(link);
            this.raiseOnAdded(node);
        }
        return this;
    }

    public delete(nodeId: string): GraphNode<P>;
    public delete(node: GraphNode<P>): boolean;
    public delete(node: string | GraphNode<P>) {
        const nodeId = typeof node === "string" ? node : node.id;
        const ownNode = this.nodes.get(nodeId);
        if (ownNode) {
            this.nodes.delete(nodeId);
            for (const link of ownNode.outgoingLinks) this.graph.links.delete(link);
            for (const link of ownNode.incomingLinks) this.graph.links.delete(link);
            this.raiseOnDeleted(ownNode);
            return typeof node === "string" ? ownNode : true;
        }

        return typeof node === "string" ? undefined : false;
    }

    public clear() {
        for (const ownNode of this) {
            for (const link of ownNode.outgoingLinks) this.graph.links.delete(link);
            for (const link of ownNode.incomingLinks) this.graph.links.delete(link);
        }

        this.nodes.clear();
    }

    public values() {
        return this.nodes.values();
    }

    public [Symbol.iterator]() {
        return this.nodes.values();
    }

    public * byProperty<K extends keyof P>(key: K, value: P[K]) {
        for (const node of this) if (node.get(key) === value) yield node;
    }

    public * byCategory(...categories: GraphCategory[]) {
        const set = categories.length && new Set(categories);
        for (const node of this) if (!set || node.hasCategory(set)) yield node;
    }

    public * filter(cb: (node: GraphNode<P>) => boolean) {
        for (const node of this) if (cb(node)) yield node;
    }

    private raiseOnAdded(node: GraphNode<P>) {
        for (const events of this.observers.values()) {
            if (events.onAdded) events.onAdded(node);
        }
    }

    private raiseOnDeleted(node: GraphNode<P>) {
        for (const events of this.observers.values()) {
            if (events.onDeleted) events.onDeleted(node);
        }
    }
}

export interface GraphNodeCollectionEvents<P extends object = any> {
    onAdded?: (node: GraphNode<P>) => void;
    onDeleted?: (node: GraphNode<P>) => void;
}

export interface GraphNodeCollectionSubscription {
    unsubscribe(): void;
}
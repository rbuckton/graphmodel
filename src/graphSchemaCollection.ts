import { GraphSchema } from "./graphSchema";

export class GraphSchemaCollection<P extends object = any> {
    public readonly schema: GraphSchema<P>;

    private schemas = new Map<string, GraphSchema>();
    private readonly observers = new Map<GraphSchemaCollectionSubscription, GraphSchemaCollectionEvents>();

    /*@internal*/ static create<P extends object>(schema: GraphSchema<P>) {
        return new GraphSchemaCollection<P>(schema);
    }

    private constructor(schema: GraphSchema<P>) {
        this.schema = schema;
    }

    public get size() { return this.schemas.size; }

    public subscribe(events: GraphSchemaCollectionEvents) {
        const subscription: GraphSchemaCollectionSubscription = { unsubscribe: () => { this.observers.delete(subscription); } };
        this.observers.set(subscription, { ...events });
        return subscription;
    }

    public has(schema: GraphSchema<P>) {
        return this.schemas.has(schema.name);
    }

    public get(name: string) {
        return this.schemas.get(name);
    }

    public add(schema: GraphSchema<P>) {
        if (this.schema.hasSchema(schema)) throw new Error("Schemas cannot be circular.");
        if (!schema.graph) {
            this.schemas.set(schema.name, schema);
            this.raiseOnAdded(schema);
        }
        return this;
    }

    public values() {
        return this.schemas.values();
    }

    public [Symbol.iterator]() {
        return this.schemas.values();
    }

    private raiseOnAdded(schema: GraphSchema) {
        for (const { onAdded } of this.observers.values()) {
            if (onAdded) onAdded(schema);
        }
    }
}

export interface GraphSchemaCollectionEvents<P extends object = any> {
    onAdded?: (schema: GraphSchema<P>) => void;
}

export interface GraphSchemaCollectionSubscription {
    unsubscribe(): void;
}
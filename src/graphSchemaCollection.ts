import { GraphSchema } from "./graphSchema";

export class GraphSchemaCollection<P extends object = any> {
    public readonly schema: GraphSchema<P>;

    private _schemas = new Map<string, GraphSchema>();
    private _observers = new Map<GraphSchemaCollectionSubscription, GraphSchemaCollectionEvents>();

    /*@internal*/ static _create<P extends object>(schema: GraphSchema<P>) {
        return new GraphSchemaCollection<P>(schema);
    }

    private constructor(schema: GraphSchema<P>) {
        this.schema = schema;
    }

    public get size() { return this._schemas.size; }

    public subscribe(events: GraphSchemaCollectionEvents) {
        const subscription: GraphSchemaCollectionSubscription = { unsubscribe: () => { this._observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    public has(schema: GraphSchema<P>) {
        return this._schemas.get(schema.name) === schema;
    }

    public get(name: string) {
        return this._schemas.get(name);
    }

    public add(schema: GraphSchema<P>) {
        if (schema.hasSchema(this.schema)) throw new Error("Schemas cannot be circular.");
        if (!schema.graph) {
            this._schemas.set(schema.name, schema);
            this._raiseOnAdded(schema);
        }
        return this;
    }

    public values() {
        return this._schemas.values();
    }

    public [Symbol.iterator]() {
        return this._schemas.values();
    }

    private _raiseOnAdded(schema: GraphSchema) {
        for (const { onAdded } of this._observers.values()) if (onAdded) onAdded(schema);
    }
}

export interface GraphSchemaCollectionEvents<P extends object = any> {
    onAdded?: (schema: GraphSchema<P>) => void;
}

export interface GraphSchemaCollectionSubscription {
    unsubscribe(): void;
}
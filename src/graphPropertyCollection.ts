import { GraphSchema } from "./graphSchema";
import { GraphProperty } from "./graphProperty";

export class GraphPropertyCollection<P extends object = any> {
    public readonly schema: GraphSchema<P>;

    private _properties = new Map<string, GraphProperty<P, keyof P>>();
    private _observers = new Map<GraphPropertyCollectionSubscription, GraphPropertyCollectionEvents>();

    /*@internal*/ static _create<P extends object>(schema: GraphSchema<P>) {
        return new GraphPropertyCollection<P>(schema);
    }

    private constructor(schema: GraphSchema<P>) {
        this.schema = schema;
    }

    public get size() { return this._properties.size; }

    public subscribe(events: GraphPropertyCollectionEvents<P>) {
        const subscription: GraphPropertyCollectionSubscription = { unsubscribe: () => { this._observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    public has(property: GraphProperty) {
        return this._properties.get(property.id) === property;
    }

    public get<K extends keyof P>(id: K) {
        return this._properties.get(id) as GraphProperty<P, K> | undefined;
    }

    public getOrCreate<K extends keyof P>(id: K) {
        let property = this._properties.get(id);
        if (!property) this.add(property = GraphProperty._create(id));
        return property as GraphProperty<P, K>;
    }

    public add<K extends keyof P>(property: GraphProperty<P, K>) {
        this._properties.set(property.id, property);
        this._raiseOnAdded(property);
        return this;
    }

    public delete(property: GraphProperty) {
        const ownProperty = this._properties.get(property.id);
        if (ownProperty) {
            this._properties.delete(property.id);
            this._raiseOnDeleted(ownProperty);
            return true;
        }
        return false;
    }

    public clear() {
        for (const property of [...this._properties.values()]) {
            this.delete(property);
        }
    }

    /*@internal*/ values<K extends keyof P>(propertyIds: Iterable<K>): IterableIterator<GraphProperty<P, K>>;
    public values(): IterableIterator<GraphProperty<P, keyof P>>;
    public * values(propertyIds?: Iterable<keyof P>) {
        if (propertyIds) {
            for (const id of propertyIds) {
                const property = this.get(id);
                if (property) yield property;
            }
        }
        else {
            yield* this._properties.values();
        }
    }

    public [Symbol.iterator]() {
        return this._properties.values();
    }

    private _raiseOnAdded(property: GraphProperty<P, keyof P>) {
        for (const { onAdded } of this._observers.values()) if (onAdded) onAdded(property);
    }

    private _raiseOnDeleted(property: GraphProperty<P, keyof P>) {
        for (const { onDeleted } of this._observers.values()) if (onDeleted) onDeleted(property);
    }
}

export interface GraphPropertyCollectionEvents<P extends object = any> {
    onAdded?: (category: GraphProperty<P, keyof P>) => void;
    onDeleted?: (category: GraphProperty<P, keyof P>) => void;
}

export interface GraphPropertyCollectionSubscription {
    unsubscribe(): void;
}
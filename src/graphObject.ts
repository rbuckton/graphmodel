import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";
import { GraphProperty } from "./graphProperty";
import { Graph } from "./graph";

export abstract class GraphObject<P extends object = any> {
    private _owner: Graph<P> | undefined;
    private _categories = new Set<GraphCategory<P>>();
    private _properties = new Map<GraphProperty<P, keyof P>, P[keyof P]>();
    private _observers = new Map<GraphObjectSubscription, GraphObjectEvents>();

    constructor(owner?: Graph<P>, category?: GraphCategory<P>) {
        this._owner = owner;
        if (category) this.addCategory(category);
    }

    public get owner() { return this._owner; }

    public get categoryCount() { return this._categories.size; }

    public get propertyCount() { return this._properties.size; }

    public subscribe(events: GraphObjectEvents<P>) {
        const subscription: GraphObjectSubscription = { unsubscribe: () => { this._observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    public hasCategory(category: string | GraphCategory<P> | Iterable<GraphCategory<P>>) {
        if (isIterableObject(category)) {
            return this.hasCategoryInSet(new Set(category), "exact");
        }

        const id = typeof category === "string" ? category : category.id;
        for (const category of this._categories) {
            if (category.isBasedOn(id)) return true;
        }

        return false;
    }

    public hasCategoryInSet(categorySet: ReadonlySet<GraphCategory<P>>, match: "exact" | "inherited") {
        if (match === "inherited") {
            const inherited = new Set<GraphCategory<P>>();
            for (let category of categorySet) {
                while (category) {
                    inherited.add(category);
                    category = category.basedOn;
                }
            }
            categorySet = inherited;
        }

        for (let category of this._categories) {
            while (category) {
                if (categorySet.has(category)) return true;
                category = category.basedOn;
            }
        }

        return false;
    }

    public addCategory(category: GraphCategory<P>) {
        if (!this._categories.has(category)) {
            this._categories.add(category);
            this._raiseOnCategoryChanged("add", category);
        }
        return this;
    }

    public deleteCategory(category: GraphCategory<P>) {
        if (this._categories.delete(category)) {
            this._raiseOnCategoryChanged("delete", category);
            return true;
        }
        return false;
    }

    public has<K extends keyof P>(key: K | GraphProperty<P, K>) {
        const property = typeof key === "string" ? this.owner!.schema.findProperty(key) : key;
        return property !== undefined && this._properties.has(property);
    }

    public get<K extends keyof P>(key: K | GraphProperty<P, K>): P[K] | undefined {
        const property = typeof key === "string" ? this.owner!.schema.findProperty(key) : key;
        return property && this._properties.get(property);
    }

    public set<K extends keyof P>(key: K | GraphProperty<P, K>, value: P[K]) {
        if (value === undefined || value === null) {
            this.delete(key);
            return this;
        }

        const property = typeof key === "string" ? this.owner!.schema.findProperty(key) : key;
        if (property) {
            this._properties.set(property, value);
            this._raiseOnPropertyChanged(property);
        }
        return this;
    }

    public delete<K extends keyof P>(key: K | GraphProperty<P, K>) {
        const property = typeof key === "string" ? this.owner!.schema.findProperty(key) : key;
        if (property && this._properties.delete(property)) {
            this._raiseOnPropertyChanged(property);
            return false;
        }
        return true;
    }

    public keys() {
        return this._properties.keys();
    }

    public values() {
        return this._properties.values();
    }

    public entries() {
        return this._properties.entries();
    }

    public categories() {
        return this._categories.values();
    }

    public [Symbol.iterator]() {
        return this._properties[Symbol.iterator]();
    }

    /*@internal*/ _setOwner(owner: Graph<P>) {
        if (!this._owner) {
            this._owner = owner;
        }
    }

    /*@internal*/ _merge(other: this) {
        for (const category of other.categories()) this.addCategory(category);
        for (const [key, value] of other) this.set(key, value);
    }

    /*@internal*/ _raiseOnCategoryChanged(change: "add" | "delete", category: GraphCategory<P>) {
        for (const { onCategoryChanged } of this._observers.values()) if (onCategoryChanged) onCategoryChanged(change, category);
    }

    /*@internal*/ _raiseOnPropertyChanged(property: GraphProperty<P, keyof P>) {
        for (const { onPropertyChanged } of this._observers.values()) if (onPropertyChanged) onPropertyChanged(property.id);
    }
}

export interface GraphObjectEvents<P extends object = any> {
    onCategoryChanged?: (change: "add" | "delete", category: GraphCategory<P>) => void;
    onPropertyChanged?: (name: keyof P) => void;
}

export interface GraphObjectSubscription {
    unsubscribe(): void;
}

function isIterableObject(obj: any): obj is object & Iterable<any> {
    return obj
        && typeof obj === "object"
        && Symbol.iterator in obj;
}
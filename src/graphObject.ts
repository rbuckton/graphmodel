import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";
import { Graph } from "./graph";

export abstract class GraphObject<P extends object = any> {
    public readonly owner: Graph<P>;

    private _categories = new Set<GraphCategory>();
    private _properties = new Map<keyof P, P[keyof P]>();
    private observers = new Map<GraphObjectSubscription, GraphObjectEvents>();

    constructor(owner: Graph<P>, category?: GraphCategory) {
        this.owner = owner;
        if (category) this.addCategory(category);
    }

    public get categoryCount() { return this._categories.size; }

    public get propertyCount() { return this._properties.size; }

    public subscribe(events: GraphObjectEvents<P>) {
        const subscription: GraphObjectSubscription = { unsubscribe: () => { this.observers.delete(subscription); } };
        this.observers.set(subscription, events);
        return subscription;
    }

    public hasCategory(category: string | GraphCategory | Iterable<GraphCategory>) {
        if (isIterableObject(category)) {
            return this.hasCategoryInSet(new Set(category), "exact");
        }

        const id = typeof category === "string" ? category : category.id;
        for (const category of this._categories) {
            if (category.isBasedOn(id)) return true;
        }

        return false;
    }

    public hasCategoryInSet(categorySet: Set<GraphCategory>, match: "exact" | "inherited") {
        if (match === "inherited") {
            const inherited = new Set<GraphCategory>();
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

    public addCategory(category: GraphCategory) {
        if (!this._categories.has(category)) {
            this._categories.add(category);
            this.raiseOnCategoryChanged("add", category);
        }
        return this;
    }

    public deleteCategory(category: GraphCategory) {
        if (this._categories.delete(category)) {
            this.raiseOnCategoryChanged("delete", category);
            return true;
        }
        return false;
    }

    public has(key: keyof P) {
        return this._properties.has(key);
    }

    public get<K extends keyof P>(key: K): P[K] | undefined {
        return this._properties.get(key);
    }

    public set<K extends keyof P>(key: K, value: P[K]) {
        this._properties.set(key, value);
        this.raiseOnPropertyChanged(key);
        return this;
    }

    public delete(key: keyof P) {
        if (this._properties.delete(key)) {
            this.raiseOnPropertyChanged(key);
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

    /*@internal*/ merge(other: this) {
        for (const category of other.categories()) this.addCategory(category);
        for (const [key, value] of other) this.set(key, value);
    }

    protected raiseOnCategoryChanged(change: "add" | "delete", category: GraphCategory) {
        for (const { onCategoryChanged } of this.observers.values()) if (onCategoryChanged) onCategoryChanged(change, category);
    }

    protected raiseOnPropertyChanged(name: keyof P) {
        for (const { onPropertyChanged } of this.observers.values()) if (onPropertyChanged) onPropertyChanged(name);
    }
}

export interface GraphObjectEvents<P extends object = any> {
    onCategoryChanged?: (change: "add" | "delete", category: GraphCategory) => void;
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
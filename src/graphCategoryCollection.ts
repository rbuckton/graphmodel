import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";

export class GraphCategoryCollection<P extends object = any> {
    public readonly schema: GraphSchema<P>;

    private _categories = new Map<string, GraphCategory<P>>();
    private _observers = new Map<GraphCategoryCollectionSubscription, GraphCategoryCollectionEvents<P>>();

    /*@internal*/ static _create<P extends object>(schema: GraphSchema<P>) {
        return new GraphCategoryCollection<P>(schema);
    }

    private constructor(schema: GraphSchema<P>) {
        this.schema = schema;
    }

    public get size() { return this._categories.size; }

    public subscribe(events: GraphCategoryCollectionEvents<P>) {
        const subscription: GraphCategoryCollectionSubscription = { unsubscribe: () => { this._observers.delete(subscription); } };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    public has(category: GraphCategory<P>) {
        return this._categories.get(category.id) === category;
    }

    /*@internal*/ _get(id: string) {
        return this._categories.get(id);
    }

    public getOrCreate(id: string) {
        let category = this._categories.get(id);
        if (!category) this.add(category = GraphCategory._create(id));
        return category;
    }

    public add(category: GraphCategory<P>) {
        this._categories.set(category.id, category);
        this._raiseOnAdded(category);
        return this;
    }

    public delete(category: GraphCategory<P>) {
        const ownCategory = this._categories.get(category.id);
        if (ownCategory) {
            this._categories.delete(category.id);
            this._raiseOnDeleted(ownCategory);
            return true;
        }
        return false;
    }

    public clear() {
        for (const category of [...this._categories.values()]) {
            this.delete(category);
        }
    }

    /*@internal*/ values(categoryIds: Iterable<string>): IterableIterator<GraphCategory<P>>;
    public values(): IterableIterator<GraphCategory<P>>;
    public * values(categoryIds?: Iterable<string>) {
        if (categoryIds) {
            for (const id of categoryIds) {
                const category = this._get(id);
                if (category) yield category;
            }
        }
        else {
            yield* this._categories.values();
        }
    }

    public [Symbol.iterator]() {
        return this._categories.values();
    }

    public * basedOn(base: GraphCategory<P>) {
        for (const category of this) if (category.isBasedOn(base)) yield category;
    }

    private _raiseOnAdded(category: GraphCategory<P>) {
        for (const { onAdded } of this._observers.values()) {
            if (onAdded) onAdded(category);
        }
    }

    private _raiseOnDeleted(category: GraphCategory<P>) {
        for (const { onDeleted } of this._observers.values()) {
            if (onDeleted) onDeleted(category);
        }
    }
}

export interface GraphCategoryCollectionEvents<P extends object = any> {
    onAdded?: (category: GraphCategory<P>) => void;
    onDeleted?: (category: GraphCategory<P>) => void;
}

export interface GraphCategoryCollectionSubscription {
    unsubscribe(): void;
}
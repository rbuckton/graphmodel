import { GraphSchema } from "./graphSchema";
import { GraphCategory } from "./graphCategory";

export class GraphCategoryCollection<P extends object = any> {
    public readonly schema: GraphSchema<P>;

    private categories = new Map<string, GraphCategory>();
    private readonly observers = new Map<GraphCategoryCollectionSubscription, GraphCategoryCollectionEvents>();

    /*@internal*/ static create<P extends object>(schema: GraphSchema<P>) {
        return new GraphCategoryCollection<P>(schema);
    }

    private constructor(schema: GraphSchema<P>) {
        this.schema = schema;
    }

    public get size() { return this.categories.size; }

    public subscribe(events: GraphCategoryCollectionEvents) {
        const subscription: GraphCategoryCollectionSubscription = { unsubscribe: () => { this.observers.delete(subscription); } };
        this.observers.set(subscription, { ...events });
        return subscription;
    }

    public has(category: GraphCategory) {
        return this.categories.get(category.id) === category;
    }

    /*@internal*/ get(id: string) {
        return this.categories.get(id);
    }

    public getOrCreate(id: string) {
        let category = this.categories.get(id);
        if (!category) this.categories.set(id, category = GraphCategory.create(id));
        return category;
    }

    public add(category: GraphCategory) {
        this.categories.set(category.id, category);
        this.raiseOnAdded(category);
        return this;
    }

    public delete(category: GraphCategory) {
        const ownCategory = this.categories.get(category.id);
        if (ownCategory) {
            this.categories.delete(category.id);
            this.raiseOnDeleted(ownCategory);
            return true;
        }
        return false;
    }

    public clear() {
        for (const category of [...this.categories.values()]) {
            this.delete(category);
        }
    }

    /*@internal*/ values(categoryIds: Iterable<string>): IterableIterator<GraphCategory>;
    public values(): IterableIterator<GraphCategory>;
    public * values(categoryIds?: Iterable<string>) {
        if (categoryIds) {
            for (const id of categoryIds) {
                const category = this.get(id);
                if (category) yield category;
            }
        }
        else {
            yield* this.categories.values();
        }
    }

    public [Symbol.iterator]() {
        return this.categories.values();
    }

    public * basedOn(base: GraphCategory) {
        for (const category of this) if (category.isBasedOn(base)) yield category;
    }

    private raiseOnAdded(category: GraphCategory) {
        for (const { onAdded } of this.observers.values()) {
            if (onAdded) onAdded(category);
        }
    }

    private raiseOnDeleted(category: GraphCategory) {
        for (const { onDeleted } of this.observers.values()) {
            if (onDeleted) onDeleted(category);
        }
    }
}

export interface GraphCategoryCollectionEvents {
    onAdded?: (category: GraphCategory) => void;
    onDeleted?: (category: GraphCategory) => void;
}

export interface GraphCategoryCollectionSubscription {
    unsubscribe(): void;
}
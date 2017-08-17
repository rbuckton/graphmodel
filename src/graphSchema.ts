import { GraphSchemaCollection } from "./graphSchemaCollection";
import { GraphCategory } from "./graphCategory";
import { GraphCategoryCollection } from "./graphCategoryCollection";
import { Graph } from "./graph";

export class GraphSchema<P extends object = any> {
    public readonly ["[[Properties]]"]: P;
    public readonly graph: Graph<P> | undefined;
    public readonly categories: GraphCategoryCollection<P> = GraphCategoryCollection.create(this);
    public readonly schemas: GraphSchemaCollection<P> = GraphSchemaCollection.create(this);
    public readonly name: string;

    constructor(name: string, ...schemas: GraphSchema<P>[]) {
        this.name = name;
        for (const schema of schemas) this.addSchema(schema);
    }

    public hasSchema(schema: GraphSchema<P>) {
        if (schema === this) return true;
        for (const value of this.schemas.values()) if (value.hasSchema(schema)) return true;
        return false;
    }

    public addSchema(schema: GraphSchema<P>) {
        this.schemas.add(schema);
        return this;
    }

    public * allSchemas(): IterableIterator<GraphSchema<P>> {
        yield this;
        for (const schema of this.schemas) {
            yield* schema.allSchemas();
        }
    }

    public getCategory(id: string) {
        for (const schema of this.allSchemas()) {
            const category = schema.categories.get(id);
            return category;
        }
        return undefined;
    }

    public * allCategories(...categoryIds: string[]) {
        for (const schema of this.allSchemas()) {
            yield* schema.categories.values(categoryIds);
        }
    }
}
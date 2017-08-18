export class GraphProperty<K extends string = string, T = any> {
    public readonly ["[[DataType]]"]: T;
    public readonly id: K;

    /*@internal*/ static create<K extends string, T>(id: K) {
        return new GraphProperty<K, T>(id);
    }

    private constructor(id: K) {
        this.id = id;
    }
}
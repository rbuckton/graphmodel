export class GraphProperty<P extends object = any, K extends keyof P = keyof P> {
    public readonly ["[[DataType]]"]: P[K];
    public readonly id: K;

    /*@internal*/ static _create<P extends object, K extends keyof P>(id: K) {
        return new GraphProperty<P, K>(id);
    }

    private constructor(id: K) {
        this.id = id;
    }
}
export class GraphCategory {
    public readonly id: string;

    private _basedOn: GraphCategory;

    /*@internal*/ static _create(id: string) {
        return new GraphCategory(id);
    }

    private constructor(id: string) {
        this.id = id;
    }

    public get basedOn() { return this._basedOn; }

    public set basedOn(value: GraphCategory) {
        if (value !== this._basedOn) {
            if (value.isBasedOn(this)) throw new Error("Invalid attempt to create a circular reference in category inheritance.");
            this._basedOn = value;
        }
    }

    public isBasedOn(category: string | GraphCategory) {
        if (typeof category === "string") {
            for (let base: GraphCategory = this; base; base = base.basedOn) {
                if (base.id === category) return true;
            }
        }
        else {
            for (let base: GraphCategory = this; base; base = base.basedOn) {
                if (base === category) return true;
            }
        }

        return false;
    }
}
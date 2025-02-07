import { ctx, drawHexagon, resource } from "./script.js";

export class Hex {
    constructor(q, r, type = "empty", resource = "") {
        this.q = q
        this.r = r
        this.type = type
        this.resource = resource
        this.power = 1 //how many resources generated per time
    }
    getNeighbors() {
        let col = this.q
        let row = this.r
        let directions = (col % 2 === 0) ? EVEN_Q_DIRECTIONS : ODD_Q_DIRECTIONS;
        return directions.map(([dc, dr]) => ({ col: col + dc, row: row + dr }));

    }

    draw(){
        ctx.fillstyle = "black"
        drawHexagon(this.q, this.r, this.type)
    }
}

export class mineHex extends Hex {
    constructor(q, r) {
        super(q, r)
        this.type = "mine"
        this.resource = "material"
        this.materialCost = 10
        this.energyCost = 0
    }
    generateResource() {
        if(resource["energy"] > 0)
        resource[this.resource] += 2
        resource["energy"]--    
    }
}

export class coalPlantHex extends Hex {
    constructor(q, r) {
        super(q, r)
        this.type = "coalPlant"
        this.resource = "energy"
        this.materialCost = 15
        this.energyCost = 5
    }

    generateResource() {
        resource[this.resource] +=2
    }
    
}

export class steelMillHex extends Hex {
    constructor(q, r){
        super(q, r)
    }
}

export class warehouseHex extends Hex {
    constructor(q, r){
        super(q, r)
    }
}
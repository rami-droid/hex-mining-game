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

    generateResource() {
        resource[this.resource]++
        console.log(`type: ${this.type} resource counter: ${resource[this.resource]}`)
        //generates this.resource according to some algorithm, using getneighbors to get stat boosts.
    }
}

export class mineHex extends Hex {
    constructor(q, r) {
        super(q, r)
        this.type = "mine"
        this.resource = "material"
    }
}

export class coalPlantHex extends Hex {
    constructor(q, r) {
        super(q, r)
        this.type = "coalPlant"
        this.resource = "energy"
    }
    
}
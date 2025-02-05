const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const angle = 2 * Math.PI / 6;
let radius = 50;

let Btn = document.querySelector("button")
let inputX = document.querySelector("#X")
let inputY = document.querySelector("#Y")

let zoomInBtn = document.querySelector("#zoomIn")
let zoomOutBtn = document.querySelector("#zoomOut")

//game variables
let materials = 0
let buildings = 5

zoomOutBtn.addEventListener("click", ()=>{
    zoomMap(5, -1)
})
zoomInBtn.addEventListener("click", ()=> {
    zoomMap(5, 1)
})

Btn.addEventListener("click", ()=> {
    if (map[inputX.value][inputY.value] === null) {
        map[inputX.value][inputY.value] = new Hex(inputX.value, inputY.value); 
        map[inputX.value][inputY.value].draw()
    }
    else {
        console.log("hex already exists")
    }

})

canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    const { col, row } = pixelToOffset(mouseX, mouseY, radius);
    console.log(`Clicked on hex: Column ${col}, Row ${row}`);
    let hex = map[col][row]
    if(hex.type == "empty") {
        fillHexagon(col, row)
        createBuilding(col, row, "mine", "material")
    } else {
        console.error("building already exists")
    }
});


const buildingTypes = [{type:"mine", resource:"material"}]

const ODD_Q_DIRECTIONS = [
    [+1, +1], [+1,  0], [ 0, -1], 
    [-1,  0], [-1, +1], [ 0, +1]
]

const EVEN_Q_DIRECTIONS = [
    [+1,  0], [+1, -1], [ 0, -1], 
    [-1, -1], [-1,  0], [ 0, +1]
];



class Hex {
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
        //generates this.resource according to some algorithm, using getneighbors to get stat boosts.
    }
}

const mapSize = 10;
const map = [];

// Nested loops to create the 2D array
for (let y = 0; y < mapSize; y++) {
    let row = [];
    for (let x = 0; x < mapSize; x++) {
        row.push(new Hex(x, y)); // Add Hex object at each grid position
    }
    map.push(row); // Push the row into the map
}


function offsetToPixel(col, row, size) {
    let x = 3/2 * size * col;
    let y = Math.sqrt(3) * size * row + (col % 2) * (size * Math.sqrt(3) / 2);

    return { x, y };
}
function pixelToOffset(x, y, size) {
    let col = Math.round((2 / 3) * (x / size));
    let row;

    if (col % 2 === 0) {
        row = y / (Math.sqrt(3) * size);
    } else {
        row = (y - (size * Math.sqrt(3)) / 2) / (Math.sqrt(3) * size);
    }
    row = Math.round(row)
    col = Math.round(col)

    return { col, row };
}

function drawHexagon(col, row, text = "") {
    const { x, y } = offsetToPixel(col, row, radius);
    
    ctx.beginPath();
    ctx.fillstyle = "black"
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    
    ctx.font = `${20 * (radius/50)}px Arial`;
    ctx.fillText(`${col}, ${row}: ${text}`, x, y);
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + radius * Math.cos(angle * i), y + radius * Math.sin(angle * i));
    }
    ctx.closePath();
    ctx.stroke();
    if (map[col][row] == null){
        map[col][row] = new Hex(col, row)
    }
}


function createBuilding(col, row, type = "test", resource = "") {
    buildings--
    let hex = map[col][row]
    hex.resource = resource
    hex.type = type
    console.log(hex)
    drawHexagon(col, row, type)
    hex.draw()
}
function fillHexagon(col, row){
    const { x, y } = offsetToPixel(col, row, radius);
    
    ctx.beginPath();
    ctx.fillstyle = "white"
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "20px Arial";
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + radius * Math.cos(angle * i), y + radius * Math.sin(angle * i));
    }
    ctx.closePath();
    
    ctx.fillStyle = "white"; // Set fill color (can change this)
    ctx.fill();
    ctx.fillStyle = "black";  // Set the text color back to black

}
function zoomMap(zoomMult, inOut){
    zoomMult *= inOut
    console.log(zoomMult)
    radius += zoomMult
    ctx.clearRect(0, 0, 800, 500)
    init()
}

function init() {
    console.log(map)
    map.forEach(col => {
        col.forEach(hex => {
            hex.draw()
        })
    })
    
}
init()

function gameTick() {
    console.log('Game tick executed');
}

setInterval(gameTick, 2000);
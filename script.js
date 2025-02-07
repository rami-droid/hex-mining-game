import { Hex, mineHex, coalPlantHex, steelMillHex, warehouseHex } from "./classes.js";


const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

const angle = 2 * Math.PI / 6;
let radius = 50;

let zoomInBtn = document.querySelector("#zoomIn")
let zoomOutBtn = document.querySelector("#zoomOut")

//game variables
let buildingCount = 5

let currBuilding = 0

let carouselPlusBtn = document.querySelector("#carouselPlus")
let carouselMinusBtn = document.querySelector("#carouselMinus")
let carouselTxt = document.querySelector("#currentBuilding")

let materialUI = document.querySelector("#material")
let energyUI = document.querySelector("#energy")

carouselMinusBtn.addEventListener("click", (e)=> {updateCarousel("prev")})

carouselPlusBtn.addEventListener("click", (e)=> {updateCarousel("next")})

zoomOutBtn.addEventListener("click", ()=>{
    zoomMap(5, -1)
})
zoomInBtn.addEventListener("click", ()=> {
    zoomMap(5, 1)
})

canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    const { col, row } = pixelToOffset(mouseX, mouseY, radius);
    //console.log(`Clicked on hex: Column ${col}, Row ${row}`);

    let hex = map[col][row]
    if(hex.type == "empty") {
        console.log(hex)
        createBuilding(col, row)
    } else {
        console.log(hex)
        console.error("building already exists")
    }
});

export const resource = new Object()
resource["material"] = 25;
resource["energy"] = 5;
resource["steel"] = 0;
console.log(resource)

const buildingTypes = [mineHex, coalPlantHex];

console.log(buildingTypes)


const ODD_Q_DIRECTIONS = [
    [+1, +1], [+1,  0], [ 0, -1], 
    [-1,  0], [-1, +1], [ 0, +1]
]

const EVEN_Q_DIRECTIONS = [
    [+1,  0], [+1, -1], [ 0, -1], 
    [-1, -1], [-1,  0], [ 0, +1]
];


const mapSize = 10;
const map = [];
const buildings = [];

// Nested loops to create the 2D array
for (let y = 0; y < mapSize; y++) {
    let row = [];
    for (let x = 0; x < mapSize; x++) {
        row.push(new Hex(x, y)); // Add Hex object at each grid position
    }
    map.push(row); // Push the row into the map
}


function updateCarousel(direction) {
    
    if (direction === "next") {
        currBuilding = (currBuilding + 1) % buildingTypes.length; // Move forward and loop back to 0
    } else if (direction === "prev") {
        currBuilding = (currBuilding - 1 + buildingTypes.length) % buildingTypes.length; // Move backward and loop to the end
    }
    let displayObj = new buildingTypes[currBuilding]
    carouselTxt.innerHTML = `<p>current building: ${displayObj.type} <br>cost: ${displayObj.materialCost} material, ${displayObj.energyCost} energy</p>`
}
function updateResources() {
    materialUI.innerText = `material: ${resource["material"]}`
    energyUI.innerText = `energy: ${resource["energy"]}`
    
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

export function drawHexagon(col, row, text = "") {
    const { x, y } = offsetToPixel(col, row, radius);
    
    ctx.beginPath();
    ctx.fillstyle = "black"
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    
    ctx.font = `${20 * (radius/50)}px Arial`;
    ctx.fillText(`${text}`, x, y);
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + radius * Math.cos(angle * i), y + radius * Math.sin(angle * i));
    }
    ctx.closePath();
    ctx.stroke();
    if (map[col][row] == null){
        map[col][row] = new Hex(col, row)
    }
}


function createBuilding(col, row) {
    let hex = map[col][row]
    hex = new buildingTypes[currBuilding](col, row)
    console.log(`${hex.materialCost}, ${hex.energyCost}`)
    if(resource["material"] >= hex.materialCost && resource["energy"] >= hex.energyCost){
        map[col][row] = hex
        buildings.push(hex)
        resource["energy"] -= hex.energyCost 
        resource["material"] -= hex.materialCost 
        fillHexagon(col, row)
        hex.draw()
        console.log(buildings)
        updateResources()
    } else {
        console.error("not enough resources")
    }
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
    buildings.forEach(building => {
        building.generateResource()
    });
    updateResources()
}

setInterval(gameTick, 2000);
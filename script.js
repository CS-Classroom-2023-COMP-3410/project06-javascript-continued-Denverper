const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 280;
canvas.height = window.innerHeight;

let zoomFactor = 50; // Initial zoom level (pixels per unit)
let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;
let isDragging = false;
let dragStartX, dragStartY;
let functions = JSON.parse(localStorage.getItem("functions")) || [];

const zoomInButton = document.getElementById("zoom-in");
const zoomOutButton = document.getElementById("zoom-out");
const resetButton = document.getElementById("reset");

// Button event listeners
zoomInButton.addEventListener("click", () => {
    zoomFactor *= 1.1; // Zoom in by 10%
    drawGraph();
});

zoomOutButton.addEventListener("click", () => {
    zoomFactor *= 0.9; // Zoom out by 10%
    zoomFactor = Math.max(0.1, zoomFactor); // Prevent too much zooming out
    drawGraph();
});

resetButton.addEventListener("click", () => {
    zoomFactor = 50; // Reset zoom
    offsetX = canvas.width / 2; // Recenter X
    offsetY = canvas.height / 2; // Recenter Y
    drawGraph();
});

// Resize canvas dynamically
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth - 280;
    canvas.height = window.innerHeight;
    drawGraph();
});

// Enable dragging (panning)
canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
});

canvas.addEventListener("mousemove", (event) => {
    if (isDragging) {
        offsetX += event.clientX - dragStartX;
        offsetY += event.clientY - dragStartY;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        drawGraph();
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
    isDragging = false;
});

// Enable proper infinite zooming with grid adjustments
canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const zoomAmount = event.deltaY > 0 ? 0.9 : 1.1; // Zoom in/out
    zoomFactor *= zoomAmount;

    // Prevent zoomFactor from going too small (avoiding floating point issues)
    zoomFactor = Math.max(0.1, zoomFactor); 

    drawGraph();
});

// Initial graph draw
drawGraph();
updateFunctionList();

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawAxes();
    drawNumbers();
    functions.forEach((func) => plotFunction(func));
}

// Dynamically adjust grid spacing based on zoom level
function getDynamicGridSize() {
    let step = Math.pow(10, Math.floor(Math.log10(zoomFactor))); 
    let normalized = zoomFactor / step;

    if (normalized < 2) step *= 2;
    else if (normalized < 5) step *= 5;
    else step *= 10;

    return step * Math.max(1, Math.floor(zoomFactor / 100));
}

// Draw grid lines aligned with the origin
function drawGrid() {
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;

    let gridSize = getDynamicGridSize();
    let minSpacing = Math.max(gridSize, 50); // Ensure grid doesn't disappear

    let startX = Math.floor(-offsetX / minSpacing) * minSpacing + offsetX;
    let startY = Math.floor(-offsetY / minSpacing) * minSpacing + offsetY;

    for (let x = startX; x < canvas.width; x += minSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = startY; y < canvas.height; y += minSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Draw X and Y axes centered at the origin
function drawAxes() {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, offsetY);
    ctx.lineTo(canvas.width, offsetY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, canvas.height);
    ctx.stroke();
}

// Dynamically draw numbers at appropriate scale, preventing clutter
function drawNumbers() {
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";

    let gridSize = getDynamicGridSize();
    let labelSpacing = Math.max(1, Math.floor(gridSize / zoomFactor) * 5); // Space labels properly

    for (let x = offsetX % gridSize; x < canvas.width; x += gridSize) {
        let value = Math.round((x - offsetX) / zoomFactor);
        if (value % labelSpacing === 0) ctx.fillText(value, x, offsetY + 15);
    }

    ctx.textAlign = "right";
    for (let y = offsetY % gridSize; y < canvas.height; y += gridSize) {
        let value = Math.round((offsetY - y) / zoomFactor);
        if (value % labelSpacing === 0) ctx.fillText(value, offsetX - 5, y + 5);
    }
}

function parseFunction(input) {
    let formatted = input.trim();

    // Fix implicit multiplication (e.g., 8x -> 8*x)
    formatted = formatted.replace(/(\d)([a-zA-Z])/g, "$1*$2");

    // Fix exponentiation using `{}` notation (e.g., x^{12} -> x**12)
    formatted = formatted.replace(/([a-zA-Z0-9]+)\^{([^}]+)}/g, "($1**$2)");

    // Convert common functions (e.g., log(x) -> Math.log(x))
    formatted = formatted.replace(/\b(sin|cos|tan|log|sqrt|abs|exp)\(/g, "Math.$1(");

    return formatted;
}


function plotFunction(input) {
    try {
        const parsedInput = parseFunction(input);
        const expr = new Function("x", `with(Math) { return ${parsedInput}; }`);

        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.beginPath();
        let firstPoint = true;

        for (let px = 0; px < canvas.width; px += 2) {
            let x = (px - offsetX) / zoomFactor;
            let y = expr(x);

            // Skip invalid values (preventing entire graph from breaking)
            if (!isFinite(y) || isNaN(y)) continue;

            let py = offsetY - y * zoomFactor;

            if (firstPoint) {
                ctx.moveTo(px, py);
                firstPoint = false;
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
    } catch (error) {
        console.error(`Invalid function: ${input}`); // Log instead of alert
        displayWarning(`⚠️ Function '${input}' is invalid and was skipped.`);
    }
}

// Function to show warnings instead of alerts
function displayWarning(message) {
    const warningDiv = document.getElementById("warning");
    warningDiv.textContent = message;
    warningDiv.style.display = "block";

    // Hide the warning after 3 seconds
    setTimeout(() => {
        warningDiv.style.display = "none";
    }, 3000);
}


// Add a function
function addFunction() {
    const inputField = document.getElementById("function-input");
    const input = inputField.value.trim();
    if (!input) return;

    functions.push(input);
    localStorage.setItem("functions", JSON.stringify(functions));

    updateFunctionList();
    drawGraph();
    inputField.value = ""; // Clear input box
}

// Remove a function
function removeFunction(index) {
    functions.splice(index, 1);
    localStorage.setItem("functions", JSON.stringify(functions));

    updateFunctionList();
    drawGraph();
}

// Update function list
function updateFunctionList() {
    const list = document.getElementById("function-list");
    list.innerHTML = "";

    functions.forEach((func, index) => {
        const div = document.createElement("div");
        div.classList.add("function-item");

        const span = document.createElement("span");
        katex.render(`y = ${func}`, span);

        const button = document.createElement("button");
        button.classList.add("delete-btn");
        button.innerText = "X";
        button.onclick = () => removeFunction(index);

        div.appendChild(span);
        div.appendChild(button);
        list.appendChild(div);
    });
}

// Clear all functions
function clearGraph() {
    functions = [];
    localStorage.removeItem("functions");
    updateFunctionList();
    drawGraph();
}

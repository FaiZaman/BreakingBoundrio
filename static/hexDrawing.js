var windowWidth = $(window).width() - 20,
    windowHeight = $(window).height() - 20,
    radius = 80;

var svg = d3.select("body").append("svg")
    .attr("width", windowWidth)
    .attr("height", windowHeight);

var playerPos = 4206;
var centerHex = playerPos;

console.log("Playerpos", playerPos, "centerHex", centerHex);

function draw() {
    svg.append("g")
        .attr("class", "hexagon")
        .selectAll("path")
        .data(neighborhood(centerHex))
        .enter().append("path")
        .attr("d", function (d) {
            var center = posFromNo(d, centerHex);
            var cX = center.cX;
            var cY = center.cY;
            var h = Math.sqrt(3) / 2 * radius;
            var w = Math.sqrt(3) / 2 * radius;
            var r = radius;
            // below: draw a hexagon centered on cX, cY, with side length = radius
            var p = "M" + (cX + r) + " " + (cY) + " "; // start at (r,0)
            p += "L" + (cX + r * 0.5) + " " + (cY + h) + " "; // go to (.5r, h)
            p += "L" + (cX + r * -0.5) + " " + (cY + h) + " "; // go to (-.5r, h)
            p += "L" + (cX - r) + " " + (cY) + " "; // go to (-r, 0)
            p += "L" + (cX + r * -0.5) + " " + (cY - h) + " "; // go to (-.5r, -h)
            p += "L" + (cX + r * 0.5) + " " + (cY - h) + " "; // go to (.5r, -h)
            p += "Z";
            var p2 = "M" + (cX) + " " + (cY + r) + " ";
            p2 += "L" + (cX + w) + " " + (cY + r / 2) + " ";
            p2 += "L" + (cX + w) + " " + (cY - r / 2) + " ";
            p2 += "L" + (cX) + " " + (cY - r) + " ";
            p2 += "L" + (cX - w) + " " + (cY - r / 2) + " ";
            p2 += "L" + (cX - w) + " " + (cY + r / 2) + " ";
            p2 += "Z";
            return p2;
        })
        .attr("class", function (d) {
            var cls = d === playerPos ? "player " : "";
            cls += Math.random() > 0.5 ? "fill" : "obstacle";
            // console.log(d, cls);
            return cls;
        })
        .attr("id", function (d) {
            return d;
        })
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .on("click", onclick);
}

draw();

function onclick(d) {
    var tile = $("#" + d);
    if (d === playerPos) console.log("Player clicked!");
    else if (tile.hasClass("obstacle")) console.log("Obstacle clicked!");
    else if (tile.hasClass("fill")) console.log("Grass clicked!");
    movePlayer(d);
}

window.addEventListener("keydown", onKeyDown, false);

function onKeyDown(event) {
    console.log("Key pressed! ", event.key);
    var pY = playerPos % 100;
    var pX = Math.floor(playerPos / 100);
    console.log("from pX, pY", pX, pY);
    switch (event.key) {
        case "w" : // up left
            if (pX % 2) {
                pX -= 1;
            }
            else {
                pY -= 1;
                pX -= 1;
            }
            break;
        case "e" : // up right
            if (pX % 2) {
                pX += 1;
            }
            else {
                pY -= 1;
                pX += 1;
            }
            break;
        case "d" : // right
            pX += 2;
            break;
        case "x" : // down right
            if (pX % 2) {
                pX += 1;
                pY += 1;
            }
            else {
                pX += 1;
            }
            break;
        case "y" : // down left (swiss)
        case "z" : // down left
            if (pX % 2) {
                pX -= 1;
                pY += 1;
            }
            else {
                pX -= 1;
            }
            break;
        case "a" : // left
            pX -= 2;
            break;
    }
    console.log("to pX, pY", pX, pY);
    pX += 100;
    pX %= 100;
    pY += 100;
    pY %= 100;
    var newPos = pY + 100 * pX;
    movePlayer(newPos);
}

function movePlayer(newPos) {
    console.log("Moving player from", playerPos, "to", newPos);
    var oldTile = $("#" + playerPos);
    var newTile = $("#" + newPos);
    oldTile.removeClass("player");
    newTile.addClass("player ");
    playerPos = newPos;

}

function posFromNo(n, centerHex) {
    // there are 100 rows of 100 hexes each
    var centerX = windowWidth / 2;
    var centerY = windowHeight / 2;
    var h = Math.sqrt(3) / 2 * radius;
    var y_diff = (n % 100) - (centerHex % 100)
    + 0.5; // vertical offset, in hexes (equ. radii)
    var x_diff = Math.floor(n / 100) - Math.floor(centerHex / 100); // horizontal offset, (number of rows)
    if (Math.abs(x_diff) > 50) x_diff = x_diff > 0 ? x_diff - 100 : x_diff + 100;     //torus - loop y
    if (Math.abs(y_diff) > 50) y_diff = y_diff > 0 ? y_diff - 100 : y_diff + 100;     //torus - loop x
    var cX = centerX + x_diff * h;
    var cY = centerY + y_diff * radius * 3;
    cY += (n % 200 >= 100) ? 1.5 * radius : 0;
    // if the target is on the same row as, or a row an even number away from, the center, no adjustment is needed
    // console.log("Coordinates determined for hex number: " + n + " with center hex " + centerHex + ": " + cX + ", " + cY);
    return {cX: cX, cY: cY};
}

function neighborhood(centerHex) {
    var neighbors = [];
    // number of hexes which will be on the screen to the left of the center hex
    var hexesAbove = Math.ceil(windowHeight / (3 * radius));
    // number of hexes appearing above the center hex (=number of hexes below) on the screen
    var  hexesAside = Math.ceil(windowWidth / (Math.sqrt(3) * radius) + 1);
    // hexesAside = Math.ceil(hexesAside / 2); // todo: remove - here for debugging view
    // hexesAbove = Math.ceil(hexesAbove / 2); // todo: remove - here for debugging view

    var centerRow = Math.floor(centerHex / 100);
    var centerCol = centerHex % 100;
    for (var i = -1 * hexesAside; i < hexesAside; i++) {
        for (var j = -1 * hexesAbove; j < hexesAbove; j++) {
            var newCol = (centerCol + j + 200) % 100;
            var newRow = (centerRow + i + 200) % 100;
            neighbors.push(newCol + 100 * newRow);
        }
    }
    return neighbors;
}

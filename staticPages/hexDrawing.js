var windowWidth = $(window).width() - 20,
    windowHeight = $(window).height() - 20,
    radius = 80;

var svg = d3.select("body").append("svg")
    .attr("width", windowWidth)
    .attr("height", windowHeight);


svg.append("g")
    .attr("class", "hexagon")
    .selectAll("path")
    .data(neighborhood(101))
    // .data([0, 9901, 1, 101, 9900, 200, 100, 300, 9999, 199])
    .enter().append("path")
    .attr("d", function (d) {
        var center = posFromNo(d, 101);
        var cX = center.cX;
        var cY = center.cY;
        var h = Math.sqrt(3) / 2 * radius;
        var w = Math.sqrt(3) / 2 * radius;
        var r = radius;
        // below: draw a hexagon centered on cX, cY, with side length = radius
        var p = "M" + (cX + r) + " " + (cY) + " "; // start at (r,0)
        p += "L" + (cX + r * 0.5) + " " + (cY +  h) + " "; // go to (.5r, h)
        p += "L" + (cX + r * -0.5) + " " + (cY +  h) + " "; // go to (-.5r, h)
        p += "L" + (cX - r) + " " + (cY) + " "; // go to (-r, 0)
        p += "L" + (cX + r * -0.5) + " " + (cY -  h) + " "; // go to (-.5r, -h)
        p += "L" + (cX + r * 0.5) + " " + (cY -  h) + " "; // go to (.5r, -h)
        p += "Z";
        var p2 = "M" + (cX) + " " + (cY + r) + " ";
        p2 += "L" + (cX + w) + " " + (cY + r/2) + " ";
        p2 += "L" + (cX + w) + " " + (cY - r/2) + " ";
        p2 += "L" + (cX) + " " + (cY - r) + " ";
        p2 += "L" + (cX - w) + " " + (cY - r/2) + " ";
        p2 += "L" + (cX - w) + " " + (cY + r/2) + " ";
        p2 += "Z";
        return p2;
    })
    .attr("class", function (d) {
        return d === 101 ? "fill" : "player";
    })
    .attr("id", function (d) {
        return d;
    })
    .attr("stroke-width", 3)
    .attr("stroke", "black")
    .on("mousedown", mousedown)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);


var mousing = 0;

function mousedown(d) {
    mousing = d.fill ? -1 : +1;
    console.log("mouse down");
    mousemove.apply(this, arguments);
}

function mousemove(d) {
    if (mousing) {
        d3.select(this).classed("fill", d.fill = mousing > 0);
    }
    console.log("Mousing: " + mousing);
}

function mouseup() {
    mousemove.apply(this, arguments);
    mousing = 0;
}

function posFromNo(n, centerHex) {
    // there are 100 rows of 100 hexes each
    var centerX = windowWidth / 2;
    var centerY = windowHeight / 2;
    var h = Math.sqrt(3) / 2 * radius;
    var y_diff = (n % 100) - (centerHex % 100) - 0.5; // horizontal offset, in hexes (equ. radii)
    var x_diff = Math.floor(n / 100) - Math.floor(centerHex / 100); // vertical offset, (number of rows)
    if (Math.abs(x_diff) > 50) x_diff = x_diff > 0 ? x_diff - 100 : x_diff + 100;     //torus - loop y
    if (Math.abs(y_diff) > 50) y_diff = y_diff > 0 ? y_diff - 100 : y_diff + 100;     //torus - loop x
    var cX = centerX + x_diff* h;
    var cY = centerY + y_diff * radius * 3;
    cY += (n%200 >= 100) ? 1.5 * radius : 0;
    // if the target is on the same row as, or a row an even number away from, the center, no adjustment is needed
    // console.log("Coordinates determined for hex number: " + n + " with center hex " + centerHex + ": " + cX + ", " + cY);
    return {cX: cX, cY: cY};
}

function neighborhood(centerHex) {
    var neighbors = [];
    // number of hexes which will be on the screen to the left of the center hex
    var hexesToASide = Math.ceil(windowHeight / (2 * 1.5 * radius));
    // number of hexes appearing above the center hex (=number of hexes below) on the screen
    var hexesAbove = Math.ceil(windowWidth / (Math.sqrt(3) * radius) + 1);
    var centerRow = Math.floor(centerHex / 100);
    var centerCol = centerHex % 100;
    for (var i = -1 * hexesAbove; i < hexesAbove; i++) {
        for (var j = -1 * hexesToASide; j < hexesToASide; j++) {
            var newCol = (centerCol + j + 200) % 100;
            var newRow = (centerRow + i + 200) % 100;
            neighbors.push(newCol + 100 * newRow);
        }
    }
    return neighbors;
}
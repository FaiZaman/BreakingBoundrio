var windowWidth = $(window).width() - 20,
    windowHeight = $(window).height() - 20,
    radius = 200;

var svg = d3.select("body").append("svg")
    .attr("width", windowWidth)
    .attr("height", windowHeight);


svg.append("g")
    .attr("class", "hexagon")
    .selectAll("path")
    .data([1, 2, 3, 4, 5,101,102,103,104,105,202,203,303, 333])
    .enter().append("path")
    .attr("d", function (d) {
        var center = posFromNo(d, 102);
        console.log("Center: ", center);
        var cX = center.cX;
        var cY = center.cY;
        var h = Math.sqrt(3) / 2;
        var p = "M" + (cX + radius) + " " + (cY) + " "; // start at (r,0)
        p += "L" + (cX + radius * 0.5) + " " + (cY + radius * h) + " "; // go to (.5r, h)
        p += "L" + (cX + radius * -0.5) + " " + (cY + radius * h) + " "; // go to (-.5r, h)
        p += "L" + (cX - radius) + " " + (cY) + " "; // go to (-r, 0)
        p += "L" + (cX + radius * -0.5) + " " + (cY - radius * h) + " "; // go to (-.5r, -h)
        p += "L" + (cX + radius * 0.5) + " " + (cY - radius * h) + " "; // go to (.5r, -h)
        p += "Z";
        console.log("Path produced: " + p);
        return p;
    })
    .attr("class", function (d) {
        return Math.random()>0.5 ? "fill" : "player";
    })
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
    var x_diff = (n % 100) - (centerHex % 100) - 0.5; // horizontal offset, in hexes (equ. radii)
    var y_diff = Math.floor(n/100) - Math.floor(centerHex / 100); // vertical offset, (number of rows)
    var cX = centerX + x_diff * radius * 3;
    cX += (n%200>100) ? 1.5* radius : 0;
    var cY = centerY + y_diff * h ;
    // if the target is on the same row as, or a row an even number away from, the center, no adjustment is needed
    console.log("Coordinates determined for hex number: " + n + " with center hex " + centerHex + ": " + cX + ", " + cY);
    return {cX: cX, cY: cY};

}
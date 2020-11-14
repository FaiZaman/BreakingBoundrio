$(document).ready(function(){

    $(".question").hide();
    $(".error").hide();

    var width = $(window).width() - 20,
    height = $(window).height() - 20,
    radius = 20;

    var topology = hexTopology(radius, width, height);

    var projection = hexProjection(radius);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("class", "hexagon")
    .selectAll("path")
        .data(topology.objects.hexagons.geometries)
    .enter().append("path")
        .attr("d", function(d) { return path(topojson.feature(topology, d)); })
        .attr("class", function(d) { return d.fill ? "fill" : null; })
        .on("mousedown", mousedown)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);

    svg.append("path")
        .datum(topojson.mesh(topology, topology.objects.hexagons))
        .attr("class", "mesh")
        .attr("d", path);

    var border = svg.append("path")
        .attr("class", "border")
        .call(redraw);

    var mousing = 0;

    function mousedown(d) {
        mousing = d.fill ? -1 : +1;
        mousemove.apply(this, arguments);
    }

    function mousemove(d) {
        if (mousing) {
            d3.select(this).classed("fill", d.fill = mousing > 0);
            border.call(redraw);
        }
    }

    function mouseup() {
        mousemove.apply(this, arguments);
        mousing = 0;
    }

    function redraw(border) {
        border.attr("d", path(topojson.mesh(topology, topology.objects.hexagons, function(a, b) { return a.fill ^ b.fill; })));
    }

    function hexTopology(radius, width, height) {
        var dx = radius * 2 * Math.sin(Math.PI / 3),
            dy = radius * 1.5,
            m = Math.ceil((height + radius) / dy) + 1,
            n = Math.ceil(width / dx) + 1,
            geometries = [],
            arcs = [];

        for (var j = -1; j <= m; ++j) {
            for (var i = -1; i <= n; ++i) {
            var y = j * 2, x = (i + (j & 1) / 2) * 2;
            arcs.push([[x, y - 1], [1, 1]], [[x + 1, y], [0, 1]], [[x + 1, y + 1], [-1, 1]]);
            }
        }

        for (var j = 0, q = 3; j < m; ++j, q += 6) {
            for (var i = 0; i < n; ++i, q += 3) {
                geometries.push({
                    type: "Polygon",
                    arcs: [[q, q + 1, q + 2, ~(q + (n + 2 - (j & 1)) * 3), ~(q - 2), ~(q - (n + 2 + (j & 1)) * 3 + 2)]],
                    fill: Math.random() > i / n * 2
                });
            }
        }

        return {
            transform: {translate: [0, 0], scale: [1, 1]},
            objects: {hexagons: {type: "GeometryCollection", geometries: geometries}},
            arcs: arcs
        };
    }

    function hexProjection(radius) {
        var dx = radius * 2 * Math.sin(Math.PI / 3),
            dy = radius * 1.5;
        return {
            stream: function(stream) {
            return {
                point: function(x, y) { stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2); },
                lineStart: function() { stream.lineStart(); },
                lineEnd: function() { stream.lineEnd(); },
                polygonStart: function() { stream.polygonStart(); },
                polygonEnd: function() { stream.polygonEnd(); }
            };
            }
        };
    }


    // =====================================================================================

    var fillers = [
        "A troll wearing a historian's coat appears from behind a wall! He shouts at you:",
        "A mammoth with an equals sign on its forehead comes tumbling down a mountain! It roars, and\
        you translate from Mammothish quickly:",
        "Adolf Hitler himself rises from the ashes of his Führerbunker! Upon seeing you, he growls\
        and mutters:",
        "A tall Viking brandishing a protractor emerges from the valley below!\
        He bellows in his Nordic tongue:",
        "Shrek rises up from his musty swamp with a bloody ruler in his hand!\
        Upon spotting you, he yells:",
        "Pirates searching for their compass attack from behind a bush! They scream unintelligibly:",
        "The Loch Ness Monster, wearing Cleopatra's necklace, impossibly spashes up from a tiny puddle!\
        It wails loudly:",
        "Medusa slithers up to you carrying a large history book! You glance away from her face just\
        as she utters:",
        "Ted Bundy appears and attempts to charm you with his collection of antiquities! His smooth\
        voice sends chills down your spine:"
    ];

    $("path").on('click', function(){

        // if this is a red hexagon, bring up notification that asks a question
        // TODO: this only runs when the player walks into this wall
        const filled = $(this).attr("class");
        const random_filler = fillers[Math.floor(Math.random() * fillers.length)];

        if (filled){
            $(".question").show();
            $(".modal-title").text(random_filler);
        }
        else {
            alert("not filled");
        }
    });

    $("#submit-answer").on('click', function(){

        // TODO: verify answer is correct, either from database or clientside
        if ($("#answer").val() == ""){
            $(".error").show();
        }
        else{
            $(".question").hide();
            $(".error").hide();
        }

    });

    $("#run").on('click', function(){
        
        $(".question").hide();

        // what to do when running away?

    });

});

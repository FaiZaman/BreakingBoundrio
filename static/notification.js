$(document).ready(function(){

    $(".question").hide();
    $(".error").hide();

    let question_data = []; // array of questions

    $.ajax({
        type : 'GET',
        url : "/questions/test",
        contentType: 'application/json;',
        success: function(data){
            question_data = data;
            console.log(data);
        },
        failure: function(data){
            console.log("Something went wrong!");
        }
      });

    function getQuestionsList(id){
        $.ajax({
            type : 'GET',
            url : "/interface/questions/get_list/" + id,
            contentType: 'application/json;',
            success: function(data){
                question_data = data;
                console.log(data);
            },
            failure: function(data){
                console.log("Something went wrong!");
            }
          });
    }

    function getQuestionLists(){
        $.ajax({
            type : 'GET',
            url : "/interface/questions/get_lists",
            contentType: 'application/json;',
            success: function(data){
                question_data = data;
                console.log(data);
            },
            failure: function(data){
                console.log("Something went wrong!");
            }
          });
    }

    //getQuestionLists();

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

    var maths = [
        "A mammoth with an equals sign on its forehead comes tumbling down a mountain! It roars, and\
        you translate from Mammothish quickly:",
        "A tall Viking brandishing a protractor emerges from the valley below!\
        He bellows in his Nordic tongue:",
        "Pirates searching for their compass attack from behind a bush! They scream unintelligibly:",
        "A giantic man, holding an equally gigantic ruler, lumbers towards you! He groans deeply:",
        "A swarm of wasps buzzes angrily in the shape of a minus sign! They morph into the form:",
        "A trio of mathematical moles emerges from the ground below you! They pop up in the form of\
        Morse code and you attempt to understand their frustrations:"
    ];

    var history = [
        "A troll wearing a historian's coat appears from behind a wall! He shouts at you:",
        "The Loch Ness Monster, wearing Cleopatra's necklace, impossibly spashes up from a tiny puddle!\
        It wails loudly:",
        "Medusa slithers up to you carrying a large history book! You glance away from her face just\
        as she utters:",
        "Aristotle himself rises from his grave! Upon seeing you, he growls and mutters:",
        "Rats bearing the Black Death scurry towards you! They squeak highly:",
        "Poseidon swallows the beach you stand on with tremendous waves of the ocean! Deeply, he asks:"
    ];

    var physics = [
        "Einstein traipses over using the theory of relativity! He smiles knowingly and asks:",
        "Stephen Hawking rides up to you in his super fast wheelchair! His voice generator spits out:",
        "Marie Curie, befuddled with radiation poisoning, tramples over in a daze! She questions\
        you unhappily:",
        "Rosiland Franklin rolls down a hill and comes to a stop before you! She gets up and\
        begs of you:",
        "Isaac Newton comes barging around a tree throwing apples at you! He yelps simultaneously:",
        "Erwin Schrödinger strolls along, deep in thought! He utters one of his thoughts out loud:" 
    ];

    $("path").on('click', function(){

        // if this is a red hexagon, bring up notification that asks a question
        // TODO: this only runs when the player walks into this wall
        const filled = $(this).attr("class");
        const random_filler = fillers[Math.floor(Math.random() * fillers.length)];
        const random_question_data = question_data[Math.floor(Math.random() * question_data.length)];

        const question = random_question_data['question'];
        const answer = random_question_data['answer'];

        if (filled){
            $(".question").show();
            $(".modal-title").text(random_filler);
            $(".question-text").text(question);
        }
        else {
            alert("not filled");
        }
    });

    $("#submit-answer").on('click', function(){

        const question = $(".question-text").text();
        const userAnswer = $("#answer").val();

        let realAnswer = question_data.find(data_item => data_item.question == question);
        realAnswer = realAnswer['answer'];

        // TODO: verify answer is correct, either from database or clientside
        if (userAnswer == ""){
            $(".error").show();
        }
        else {
            if (userAnswer == realAnswer){
                alert("You were right!");
            }
            else{
                alert("You were wrong!");
            }
            $(".question").hide();
            $(".error").hide();
        }

    });

    $("#run").on('click', function(){
        
        $(".question").hide();

        // what to do when running away?

    });




});

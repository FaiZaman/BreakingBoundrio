
$(document).ready(function(){

    var windowWidth = $(window).width(),
        windowHeight = $(window).height() - $('#navbar').height() - parseInt($('#navbar').css('padding-top')) - parseInt($('#navbar').css('padding-bottom')),
        radius = 80;

    var svg = d3.select("body").append("svg")
        .attr("width", windowWidth)
        .attr("height", windowHeight);

    var playerPos = 4206;
    var centerHex = playerPos;

    console.log("Playerpos", playerPos, "centerHex", centerHex);
    var questionActive = false;
    var obstacles = [];
    var world = 0;
    var targetObstacle = 0;

    let question_data = []; // array of questions

    $.ajax({
        type: 'GET',
        url: "/questions/test",
        contentType: 'application/json;',
        success: function (data) {
            question_data = data;
            console.log(data);
        },
        failure: function () {
            console.log("Something went wrong!");
        }
    });

    $.ajax({
        type: 'GET',
        url: "/interface/initialise/" + world,
        contentType: 'application/json;',
        success: function (data) {
            obstacles = data;
            console.log(data);
            $("#loading").hide();
            draw();
        },
        failure: function () {
            console.log("Something went wrong!");
        }
    });

    $("#submit-answer").on('click', function () {
        correct = verifyAnswer();
        if (correct) {
            console.log("Correct answer - update & recenter...");
            centerHex = targetObstacle;
            playerPos = targetObstacle;
            $("g").remove();
            draw();
        }
    });


    function getQuestionsList(id) {
        $.ajax({
            type: 'GET',
            url: "/interface/questions/get_list/" + id,
            contentType: 'application/json;',
            success: function (data) {
                question_data = data;
                console.log(data);
            },
            failure: function () {
                console.log("Something went wrong!");
            }
        });
    }

    function getQuestionLists() {
        $.ajax({
            type: 'GET',
            url: "/interface/questions/get_lists",
            contentType: 'application/json;',
            success: function (data) {
                question_data = data;
                console.log(data);
            },
            failure: function () {
                console.log("Something went wrong!");
            }
        });
    }

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
                cls += obstacles.includes(d) ? "obstacle" : "fill";
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

    function onclick(d) {
        var tile = $("#" + d);
        if (d === playerPos) console.log("Player clicked!");
        else if (tile.hasClass("obstacle")) console.log("Obstacle clicked!");
        else if (tile.hasClass("fill")) console.log("Grass clicked!");
        movePlayer(d);
    }

    window.addEventListener("keydown", onKeyDown, false);

    function onKeyDown(event) {
        // console.log("Key pressed! ", event.key);
        if (!questionActive) {
            var pY = playerPos % 100;
            var pX = Math.floor(playerPos / 100);
            // console.log("from pX, pY", pX, pY);
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
    }

    function movePlayer(newPos) {
        console.log("Moving player from", playerPos, "to", newPos);
        var oldTile = $("#" + playerPos);
        var newTile = $("#" + newPos);
        questionActive = popupQuestion(newTile);
        var answer = null;
        var correct = null;
        if (questionActive) {
            targetObstacle = newPos;
        }
        else {
            oldTile.removeClass("player");
            newTile.addClass("player ");
            console.log("3rd case - moving from ", playerPos, " to ", newPos);
            playerPos = newPos;
        }
        var y_diff = (newPos % 100) - (centerHex % 100) + 0.5; // vertical offset, in hexes (equ. radii)
        var x_diff = Math.floor(newPos / 100) - Math.floor(centerHex / 100); // horizontal offset, (number of rows)
        if (Math.abs(y_diff) > windowHeight / radius / 4 || Math.abs(x_diff) > windowWidth / radius / 4) {
            console.log("Recenter...");
            centerHex = newPos;
            $("g").remove();
            draw();
        }
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
        var hexesAside = Math.ceil(windowWidth / (Math.sqrt(3) * radius) + 1);
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

    var flavourText = [
        "A mammoth with an equals sign on its forehead comes tumbling down a mountain! It roars, and\
        you translate from Mammothish quickly:",
        "A tall Viking brandishing a protractor emerges from the valley below!\
        He bellows in his Nordic tongue:",
        "Pirates searching for their compass attack from behind a bush! They scream unintelligibly:",
        "A giantic man, holding an equally gigantic ruler, lumbers towards you! He groans deeply:",
        "A swarm of wasps buzzes angrily in the shape of a minus sign! They morph into the form:",
        "A trio of mathematical moles emerges from the ground below you! They pop up in the form of\
        Morse code and you attempt to understand their frustrations:",
        "A troll wearing a historian's coat appears from behind a wall! He shouts at you:",
        "The Loch Ness Monster, wearing Cleopatra's necklace, impossibly spashes up from a tiny puddle!\
        It wails loudly:",
        "Medusa slithers up to you carrying a large history book! You glance away from her face just\
        as she utters:",
        "Aristotle himself rises from his grave! Upon seeing you, he growls and mutters:",
        "Rats bearing the Black Death scurry towards you! They squeak highly:",
        "Poseidon swallows the beach you stand on with tremendous waves of the ocean! Deeply, he asks:",
        "Einstein traipses over using the theory of relativity! He smiles knowingly and asks:",
        "Stephen Hawking rides up to you in his super fast wheelchair! His voice generator spits out:",
        "Marie Curie, befuddled with radiation poisoning, tramples over in a daze! She questions\
        you unhappily:",
        "Rosiland Franklin rolls down a hill and comes to a stop before you! She gets up and\
        begs of you:",
        "Isaac Newton comes barging around a tree throwing apples at you! He yelps simultaneously:",
        "Erwin Schrödinger strolls along, deep in thought! He utters one of his thoughts out loud:"
    ];

    function popupQuestion(tile) {
        // if this is a red hexagon, bring up notification that asks a question
        // TODO: this only runs when the player walks into this wall
        const tileType = tile.attr("class");
        const random_filler = flavourText[Math.floor(Math.random() * flavourText.length)];
        const random_question_data = question_data[Math.floor(Math.random() * question_data.length)];

        const question = random_question_data['question'];

        if (tileType === "obstacle") {
            $(".question").show();
            $(".modal-title").text(random_filler);
            $(".question-text").text(question);
            return true;
        }
        else if (tileType === "fill") {
            return false;
        }
        else {
            console.log("neither fill nor obstacle");
        }
    }

    function verifyAnswer() {
        const question = $(".question-text").text();
        const userAnswer = $("#answer").val();

        let realAnswer = question_data.find(data_item => data_item.question === question);
        realAnswer = realAnswer['answer'];

        // TODO: verify answer is correct, either from database or clientside
        if (userAnswer === "") {
            $(".error").show();
        }
        else {

            $(".question").hide();
            $(".error").hide();
            questionActive = false;

            if (userAnswer === realAnswer) {
                console.log("You were right!");
                return true;
            }
            else {
                console.log("You were wrong!");
                return false;
            }

        }
    }

    $("#run").on('click', function () {

        $(".question").hide();
        questionActive = false;

        // what to do when running away?

    });
});

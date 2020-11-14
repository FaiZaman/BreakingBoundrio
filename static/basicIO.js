$.post('/interface/new_cheese', {"newCheese": "Mozzarella"}, function (ret) {
            console.log("POST returned message: " + ret);
        });


$.get('/interface/cheese', function (ret) {
            console.log("GET returned message: " + ret);
        });


console.log("Cheese was tested!");

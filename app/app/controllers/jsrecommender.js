var jsrecommender = require("js-recommender");

// var recommender = new jsrecommender.Recommender();
var recommender = new jsrecommender.Recommender({
    alpha: 0.01, // learning rate
    lambda: 0.0, // regularization parameter
    iterations: 5000, // maximum number of iterations in the gradient descent algorithm
    kDim: 2 // number of hidden features for each movie
});

var table = new jsrecommender.Table();


// table.setCell('[movie-name]', '[user]', [score]);
table.setCell('Love at last', 'Alice', 5);
table.setCell('Remance forever', 'Alice', 5);
table.setCell('Nonstop car chases', 'Alice', 0);
table.setCell('Sword vs. karate', 'Alice', 0);
table.setCell('Love at last', 'Bob', 5);
table.setCell('Cute puppies of love', 'Bob', 4);
table.setCell('Nonstop car chases', 'Bob', 0);
table.setCell('Sword vs. karate', 'Bob', 0);
table.setCell('Love at last', 'Carol', 0);
table.setCell('Cute puppies of love', 'Carol', 0);
table.setCell('Nonstop car chases', 'Carol', 5);
table.setCell('Sword vs. karate', 'Carol', 5);
table.setCell('Love at last', 'Dave', 0);
table.setCell('Remance forever', 'Dave', 0);
table.setCell('Nonstop car chases', 'Dave', 4);

var model = recommender.fit(table);
// console.log(model);

predicted_table = recommender.transform(table);
// console.log(predicted_table);

for (var i = 0; i < predicted_table.columnNames.length; ++i) {
    var user = predicted_table.columnNames[i];
    console.log('\nFor user: ' + user);
    for (var j = 0; j < predicted_table.rowNames.length; ++j) {
        var movie = predicted_table.rowNames[j];
        if(Math.round(table.getCell(movie, user)) > 0){
            console.log('ACTUAL Movie [' + movie + '] rating ' + Math.round(table.getCell(movie, user)));
        }

        if(Math.round(predicted_table.getCell(movie, user)) > 0){
            console.log('PREDICTED Movie [' + movie + '] rating ' + Math.round(predicted_table.getCell(movie, user)));
        }
    }
}

//https://github.com/chen0040/js-recommender
//https://hackernoon.com/how-to-make-a-machine-learning-recommendation-system-from-scratch-d747be801ce9
//https://hackernoon.com/machine-learning-with-javascript-part-1-9b97f3ed4fe5
//https://github.com/abhisheksoni27/machine-learning-with-js

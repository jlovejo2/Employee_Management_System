const mysql = require("mysql");
const connection = require("./SQL_login");
const asTable = require('as-table').configure({ delimiter: ' | ', dash: '-' });


class SQLqueries {

    constructor(query, values) {

        this.query = query;
        this.values = values;
    }

    //This method runs a query based on delivered query and values in instance and the console.logs the results as a table.
    generalTableQuery(nextStep) {

        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err
            // console.table(res);
            // res.end()
            console.log("\n");
            console.log(asTable(res));
            console.log("\n");
            nextStep();
        })
    }

    //This runs a query based on the query and values delivered.
    //It the runs a for loop on the response of the query and returns an array where there are no repeated titles.
    //It was created to return an array of the roles of the company
    getQueryNoRepeats(nextStep, parameterToPassToNextStep) {

        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err
            let titleArr = []
            for (let i = 0; i < res.length; i++) {
                if (!titleArr.includes(res[i].title)) {
                    titleArr.push(res[i].title)
                }
            }
            nextStep(titleArr, parameterToPassToNextStep);
        })
    }

    //This method exists just so I could console.log a different message.  It is a bit redundant
    //Then it will navigate to a nextStep function that is delivered as a parameter.
    delete(nextStep) {

        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err
            
            console.log("Delete Successful!");

            nextStep();
        })
    }

    //This function will run an update based on the delivered query and values
    //Then it will navigate to a nextStep and console.log a message that are delivered as parameters.
    update(nextStep, message) {

        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err
            console.log(message);

            nextStep();
        })

    };

    //queryReturnResult() is a method in my SQLqueries class that will run a query and return the result
    // to the function delivered as the parameter
    queryReturnResult(nextStep) {
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err
            
            nextStep(res);
        })
    }
}


module.exports = SQLqueries;


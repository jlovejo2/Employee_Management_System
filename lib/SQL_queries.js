const mysql = require("mysql");
const connection = require("./SQL_login");
const asTable = require('as-table').configure ({ delimiter: ' | ', dash: '-' });


class SQLqueries {

    constructor(query, values) {

        this.query = query;
        this.values = values;
    }

    generalTableQuery(nextStep) {
        
       connection.query(this.query, this.values, function (err, res) {
            if (err) {
                throw err
            }
            // console.table(res);
            // res.end()
            console.log("\n");
            console.log(asTable(res)); 
            console.log("\n");
               nextStep();
        })
    }

    getQueryNoRepeats(nextStep) {

        connection.query(this.query, this.values, function (err, res){
            if (err) {
                throw err
            }
            let titleArr = []
                for (let i=0; i < res.length; i++) {
                    if (!titleArr.includes(res[i].title)) {
                        titleArr.push(res[i].title)
                    }
                }
                nextStep(titleArr);
        })
    }

};


module.exports = SQLqueries;


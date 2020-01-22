const mysql = require("mysql");
const connection = require("./SQL_login");


class SQLqueries {

    constructor(query, values ) {
        
        this.query = query;
        this.values = values;

    }

    generalQuery() {
    
        connection.query(this.query, this.values, function (err, res) {
            if (err) {
                throw err
            }
        })
    }

};


module.exports = SQLqueries;


const inquirer = require("inquirer");

class InquirerFunctions {
    constructor(type, name, message, choices) {
        this.type = type;
        this.name = name;
        this.message = message;
        this.choices = choices;
    }

    ask() {
        const askObJ = {
            type: this.type,
            name: this.name,
            message: this.message
        }
        if (this.choices === "undefined") {
            return askObJ
        } else {
            askObJ.choices = this.choices;
            return askObJ;
        }
    }

    confirm(ifYes, ifNo) {
        inquirer
            .prompt([{
                type: this.type,
                name: this.name,
                message: this.message
            }]).then(responseObj => {

                //Was having trouble doing responseObj.this.name (syntax doesn't match).  So I had to cheat and just use .values() since it is an 
                //inquirer confirm and I know there will only be one key value pair in responseObj.
                const confirmChoice = Object.values(responseObj);
                console.log(confirmChoice[0]);
                
                // if (confirmChoice[0]) {
                //     ifYes();
                // } else {
                //     ifNo();
                // }
            })
            
    }

}



// prompt(...args) {
//     return inquirer
//         .prompt(...args)
// }

// input() {
//     return {
//         type: this.type,
//         name: this.name,
//         message: this.message
//     }
// }

// confirm() {
//     return {
//         type: this.type,
//         name: this.name,
//         message: this.message
//     }
// }

// list() {
//     return {
//         type: this.type,
//         name: this.name,
//         message: this.message,
//         choices: this.choices
//     }
// }


module.exports = InquirerFunctions;
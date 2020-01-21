const inquirer = require("inquirer");

class InquirerFunctions {
    constructor(type, name, message, choices) {
        this.type = type;
        this.name = name;
        this.message = message;
        this.choices = choices;
    }

    input() {
        const a = {
            type: this.type,
            name: this.name,
            message: this.message
        }

        return a;
    }

    confirm() {
        return {
            type: this.type,
            name: this.name,
            message: this.message
        }

    }

    list() {
        return {
            type: this.type,
            name: this.name,
            message: this.message,
            choices: this.choices
        }

    }
}

module.exports = InquirerFunctions;
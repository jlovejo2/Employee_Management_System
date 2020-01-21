
const inquirer = require('inquirer');
const InquirerFunctions = require('./lib/inquirer');
const commandMenuChoices = require('./lib/commandMenu');
const questions = require('./lib/questions');
const compRoles = require('./lib/companyRoles');

const inquirerTypes = [
    'input', 'confirm', 'list'
]

//This is calling the class Inquirer functions which was done to simplify 
const menuPrompt = new InquirerFunctions(inquirerTypes[2], 'menuChoice', questions.mainMenuPrompt, commandMenuChoices);

// const employeeRole = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles)

inquirer
.prompt([menuPrompt.list()]).then(operation => {
    console.log(operation);

})

// Promise.all([a,b,c]).then(prompts => {
//     inquirer
//         .prompt(prompts).then(resp => {
//             console.log(resp);
//         })
// })








//================
//Saved code
//====================

//    function multiple() {
//         let promptArr = [];
//         for (let prompt = 0; prompt < arguments.length; prompt++) {
//             promptArr.push(prompt);
//         } 

//         return inquirer
//             .prompt(
//                 promptArr
//             )
//     }
const mysql = require("mysql");
const inquirer = require('inquirer');
const InquirerFunctions = require('./lib/inquirer');
const commandMenuChoices = require('./lib/commandMenu');
const questions = require('./lib/questions');
const compRoles = require('./lib/companyRoles');
const compManagers = [1,2,3,4];
const connection = require('./lib/SQL_login')

const inquirerTypes = [
    'input', 'confirm', 'list'
]

//This is calling the class Inquirer functions which was done to simplify 
const menuPrompt = new InquirerFunctions(inquirerTypes[2], 'menuChoice', questions.mainMenuPrompt, commandMenuChoices);

// const employeeRole = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles)



    inquirer
        .prompt([menuPrompt.list()]).then(operation => {
            if(operation.menuChoice === "Add employee"){
                addEmployee()
            }
        })


function addEmployee() {
    const first_name = new InquirerFunctions(inquirerTypes[0], 'first_name', questions.addEmployee1);
    const last_name = new InquirerFunctions(inquirerTypes[0], 'last_name', questions.addEmployee2 );
    const emp_role = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles);
    const emp_manager = new InquirerFunctions(inquirerTypes[2], 'employee_manager', questions.addEmployee4, compManagers);

    Promise.all([first_name, last_name, emp_role, emp_manager]).then(prompts => {
        inquirer.prompt(prompts).then(emp_info => {
            console.log(emp_info);
        })
    })
} 
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
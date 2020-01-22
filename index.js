const mysql = require("mysql");
const inquirer = require('inquirer');
const InquirerFunctions = require('./lib/inquirer');
const commandMenuChoices = require('./lib/commandMenu');
const questions = require('./lib/questions');
const compRoles = require('./lib/companyRoles');
const compManagers = [1,2,3,4];
const SQLquery = require('./lib/SQL_queries')

const inquirerTypes = [
    'input', 'confirm', 'list'
]

//This is calling the class Inquirer functions which was done to simplify 
const menuPrompt = new InquirerFunctions(inquirerTypes[2], 'menuChoice', questions.mainMenuPrompt, commandMenuChoices);

// const employeeRole = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles)


//This code runs a list type inquirer for the choice of what option to choose at the main menu.
    inquirer
        .prompt([menuPrompt.list()]).then(operation => {

            switch (operation.menuChoice){
                case commandMenuChoices[0]:
                return viewAllEmp();
                
                case commandMenuChoices[1]:
                return viewAllEmpDep();
                
                case commandMenuChoices[2]:
                return viewAllEmpManager();
                
                case commandMenuChoices[3]:
                return viewAllEmpRole();
                
                case commandMenuChoices[4]:
                return viewAllManager();
                
                case commandMenuChoices[5]:
                return addEmp();
                
                case commandMenuChoices[6]:
                return removeEmp();
                
                case commandMenuChoices[7]:
                return updateEmpRole()
                
                case commandMenuChoices[8]:
                return updateEmpManager();
                
                case commandMenuChoices[9]:
                return updateEmpDep();
                
                case commandMenuChoices[10]:
                return viewAllRoles();
                
                case commandMenuChoices[11]:
                return addRole();
                
                case commandMenuChoices[12]:
                return removeRole();
                
                case commandMenuChoices[13]:
                return viewAllDep();
                
                case commandMenuChoices[14]:
                return addDep();
                
                case commandMenuChoices[15]:
                return removeDep();
            }
        })


function addEmp() {
    const first_name = new InquirerFunctions(inquirerTypes[0], 'first_name', questions.addEmployee1);
    const last_name = new InquirerFunctions(inquirerTypes[0], 'last_name', questions.addEmployee2 );
    const emp_role = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles);
    const emp_manager = new InquirerFunctions(inquirerTypes[2], 'employee_manager', questions.addEmployee4, compManagers);

    Promise.all([first_name.ask(), last_name.ask(), emp_role.ask(), emp_manager.ask()]).then(prompts => {
        inquirer.prompt(prompts).then(emp_info => {
            console.log(emp_info);

            const query = "INSERT INTO employees (first_name, last_name,  ) VALUES ?"
            // const value = 
            // const insertQuery = new SQLquery(query, )
        
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
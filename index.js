const mysql = require("mysql");
const inquirer = require('inquirer');
const figlet = require('figlet');
const asTable = require('as-table');

const connection = require("./lib/SQL_login");
const InquirerFunctions = require('./lib/inquirer');
const commandMenuChoices = require('./lib/commandMenu');
const questions = require('./lib/questions');
const compRoles = require('./lib/companyRoles');
const SQLquery = require('./lib/SQL_queries');
const query_code = require('./lib/query_code');

const compManagers = [1, 2, 3, 4];
const inquirerTypes = [
    'input', 'confirm', 'list'
]

//This line of code runs a synchronous function through the figlet npm that displays the designated text string in the console
console.log(figlet.textSync('Employee Management', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

mainMenu();

function mainMenu() {
    //This is calling the class Inquirer functions which was done to simplify 
    const menuPrompt = new InquirerFunctions(inquirerTypes[2], 'menuChoice', questions.mainMenuPrompt, commandMenuChoices);
    const a = menuPrompt.ask()

    //This code runs a list type inquirer for the choice of what option to choose at the main menu.
    inquirer
        .prompt([a]).then(operation => {
            console.log(operation);
            switch (operation.menuChoice) {
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

                    const query1 = "SELECT role.title FROM role"
                    const compRolesArrayQuery = new SQLquery(query1);
                    
                    compRolesArrayQuery.getQueryNoRepeats(addEmp);
                    // return compRoles1.getQueryNoRepeats(addEmp);
                    // return addEmp();
                    break;

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
}

function viewAllEmp() {
    const query = query_code.view_All_Query
    const empTable = new SQLquery(query);

    empTable.generalTableQuery(mainMenu);
}

function viewAllEmpDep() {

    const departmentNamePrompt = new InquirerFunctions(inquirerTypes[0], 'department_Name', questions.viewAllEmpByDep);
    inquirer.prompt(departmentNamePrompt.ask()).then(userResp => {
        const query = query_code.view_All_Query + " AND department.name = ? "
        console.log(query);
        console.log(userResp.department_Name);
        const empByDepTable = new SQLquery(query, userResp.department_Name);

        empByDepTable.generalTableQuery(mainMenu);
    })
}

function viewAllEmpManager() {

}

function viewAllEmpRole() {
    const rolePrompt = new InquirerFunctions(inquirerTypes[0], 'role_Title', questions.viewAllEmpByRole);
    inquirer.prompt(rolePrompt.ask()).then(userResp => {
        const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee INNER JOIN role on role.id = employee.role_id AND role.title = ? INNER JOIN department on department.id = role.department_id";

        const empByRoleTable = new SQLquery(query, userResp.role_Title);

        empByRoleTable.generalTableQuery(mainMenu);
    })
}

function viewAllManager() {

}

function addEmp(compRoles) {

    const query = "SELECT id, first_name, last_name FROM employee WHERE employee.id IN ( SELECT employee.manager_id FROM employee )";
       
    connection.query(query, function (err, res) {
        if (err) {
            throw err
        }

        console.log(res);

        let managerNamesArr = [];
        let managerObjArr = [];
                for (let i=0; i < res.length; i++) {

                    let name = res[i].first_name + " " + res[i].last_name;
                        let managersobj = { ID: res[i].id,
                            firstName: res[i].first_name,
                            lastName: res[i].last_name}
                        
                        managerObjArr.push(managersobj);
                        managerNamesArr.push(name);
                }

        const first_name = new InquirerFunctions(inquirerTypes[0], 'first_name', questions.addEmployee1);
        const last_name = new InquirerFunctions(inquirerTypes[0], 'last_name', questions.addEmployee2);
        const emp_role = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles);
        const emp_manager = new InquirerFunctions(inquirerTypes[2], 'employee_manager', questions.addEmployee4, managerNamesArr);

        Promise.all([first_name.ask(), last_name.ask(), emp_role.ask(), emp_manager.ask()]).then(prompts => {
            inquirer.prompt(prompts).then(emp_info => {

                // "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                //  FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id"
                // console.log(emp_info);
                

                const queryRoleIdFromTitle = "SELECT role.id FROM role WHERE role.title = ? "
                
                connection.query(queryRoleIdFromTitle, emp_info.employee_role ,function(err, res){
                    if(err) {
                        throw err;
                    }
                    const empRoleId = res[0].id;
                    const empFirstName = emp_info.first_name;
                    const empLastName = emp_info.last_name;
                    const empManagerName = emp_info.employee_manager.split(" ");
                    const empManagerFirstName = empManagerName[0] ;
                    const empManagerLastName = empManagerName[1];
                    
                    let empManagerID = 0;
                   
                    for (let manager of managerObjArr) {
                        if (manager.firstName == empManagerFirstName && manager.lastName === empManagerLastName) {
                            console.log("Found Manager ID");
                            empManagerID = manager.ID;
                        }
                    }
            
                    const queryInsertEmpInfo = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)"
                    
                    connection.query(queryInsertEmpInfo, [empFirstName, empLastName, empRoleId, empManagerID], function(err,res){
                        if (err) {
                            throw err
                        }
                        console.log("Employee Added");
                        console.log(res);
                        mainMenu();
                    })
                })
                })

                
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
// const employeeRole = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles)
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
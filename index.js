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
            const query1 = "SELECT role.title FROM role"
            const compRolesArrayQuery = new SQLquery(query1);

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

                    //This is the case for adding an employee
                    const actionChoice1 = "ADD"
                    compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice1);

                    break;

                case commandMenuChoices[6]:
                    //This is the case for deleting an employee
                    const actionChoice2 = "DELETE"
                    compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice2);
                    break;

                case commandMenuChoices[7]:
                    //This is the case for the update an employees role funtion
                    const actionChoice3 = "UPDATE EMP ROLE"
                    compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice3);
                   
                    break;

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
        const query = query_code.view_All_Query + " AND department.name = ? ;"
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
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                        FROM employee 
                        INNER JOIN role on role.id = employee.role_id AND role.title = (?)
                        INNER JOIN department on department.id = role.department_id;`;

        const empByRoleTable = new SQLquery(query, userResp.role_Title);

        empByRoleTable.generalTableQuery(mainMenu);
    })
}

function viewAllManager() {

    //This query selects all the given columns from employee and join
    const query = `SELECT employee.id, employee.first_name, employee.last_name, department.name
                    FROM employee
                    INNER JOIN role on role.id = employee.role_id
                    INNER JOIN department on department.id = role.department_id
                    WHERE employee.id IN ( SELECT employee.manager_id FROM employee );`;

    const managerTable = new SQLquery(query);

    managerTable.generalTableQuery(mainMenu);
}

//Function that receives the input from the user and then either adds or deletes the selected employee based on the users choice in the main menu
//Multiple sql queries are run nested in one another to pass the information down the scope to final queries that either adds or deletes
function EmpInfoPrompts(compRoles, actionChoice) {

    //This query selects all the given columns from employee and where employee.id is present in the selected table of employee_ids present in employee_manager column.
    const query = "SELECT id, first_name, last_name FROM employee WHERE employee.id IN ( SELECT employee.manager_id FROM employee )";

    connection.query(query, function (err, res) {
        if (err) {
            throw err
        }

        console.log(res);

        let managerNamesArr = [];
        let managerObjArr = [];
        for (let i = 0; i < res.length; i++) {

            let name = res[i].first_name + " " + res[i].last_name;
            let managersobj = {
                ID: res[i].id,
                firstName: res[i].first_name,
                lastName: res[i].last_name
            }

            managerObjArr.push(managersobj);
            managerNamesArr.push(name);
        }

        const first_name = new InquirerFunctions(inquirerTypes[0], 'first_name', questions.addEmployee1);
        const last_name = new InquirerFunctions(inquirerTypes[0], 'last_name', questions.addEmployee2);
        const emp_role = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles);
        const emp_manager = new InquirerFunctions(inquirerTypes[2], 'employee_manager', questions.addEmployee4, managerNamesArr);

        if (actionChoice == "ADD") {
            Promise.all([first_name.ask(), last_name.ask(), emp_role.ask(), emp_manager.ask()]).then(prompts => {
                inquirer.prompt(prompts).then(emp_info => {

                    addEmp(emp_info, managerObjArr);

                })
            })
        } else {
            Promise.all([first_name.ask(), last_name.ask()]).then(prompts => {
                inquirer.prompt(prompts).then(emp_info => {
                    EmpMulitplesCheck(emp_info, actionChoice, compRoles);
                })
            })
        }
    })
}

function addEmp(emp_info, managerObjArr) {

    console.log("You've entered employee ADD");
    // console.log(emp_info);

    const queryRoleIdFromTitle = "SELECT role.id FROM role WHERE role.title = (?) ;"

    connection.query(queryRoleIdFromTitle, emp_info.employee_role, function (err, res) {
        if (err) {
            throw err;
        }
        const empRoleId = res[0].id;
        const empFirstName = emp_info.first_name;
        const empLastName = emp_info.last_name;
        const empManagerName = emp_info.employee_manager.split(" ");
        const empManagerFirstName = empManagerName[0];
        const empManagerLastName = empManagerName[1];

        let empManagerID = 0;

        for (let manager of managerObjArr) {
            if (manager.firstName == empManagerFirstName && manager.lastName === empManagerLastName) {

                empManagerID = manager.ID;
            }
        }

        const queryInsertEmpInfo = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)"

        connection.query(queryInsertEmpInfo, [empFirstName, empLastName, empRoleId, empManagerID], function (err, res) {
            if (err) {
                throw err
            }
            console.log("Employee Added");
            mainMenu();
        })
    })
}


function EmpMulitplesCheck(emp_info, actionChoice, companyRolesArray) {

    console.log("You've entered employee multiples check")

    const empFirstName = emp_info.first_name;
    const empLastName = emp_info.last_name;
    const queryMultipleEmpCheck = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, 
                                    employee.manager_id, department.name
                                    FROM employee 
                                    INNER JOIN role on role.id = employee.role_id
                                    INNER JOIN department on department.id = role.department_id
                                    WHERE employee.first_name = (?) AND employee.last_name = (?);`

    connection.query(queryMultipleEmpCheck, [empFirstName, empLastName], function (err, res) {

        if (res.length > 1) {
            console.log("Multiple Employees Found!")
            let multipleName = [];
            for (employee of res) {
                let empStr = `${employee.id} ${employee.first_name} ${employee.last_name} ${employee.title} ${employee.name}`
                multipleName.push(empStr);
            }
            const which_employee_to_Delete = new InquirerFunctions(inquirerTypes[2], 'employee_delete', questions.deleteEmployee1, multipleName);

            inquirer.prompt([which_employee_to_Delete.ask()]).then(userChoice => {
                const chosenEmpInfo = userChoice.employee_delete.split(" ");
                const chosenEmpFirstName = chosenEmpInfo[1];
                const chosenEmpLastName = chosenEmpInfo[2];
                const chosenEmpID = chosenEmpInfo[0];
                const chosenEmpRole = chosenEmpInfo[3];

                if (actionChoice === "DELETE") {
                    deleteEmp(chosenEmpFirstName, chosenEmpLastName, chosenEmpID);
                } else if (actionChoice === "UPDATE EMP ROLE") {
                    updateEmpRole(chosenEmpFirstName, chosenEmpLastName, chosenEmpID, chosenEmpRole, companyRolesArray);
                }
            })

        } else if (res[0].id == "undefined") {
            console.log("Could not find employee. Rerouted to Main Menu")
            mainMenu();

        } else {
            console.log("One Employee Found!")
            // console.log(res[0].id);
            if (actionChoice === "DELETE") {
                deleteEmp(empFirstName, empLastName, res[0].id)
            } else if (actionChoice === "UPDATE EMP ROLE") {
                
                updateEmpRole(empFirstName, empLastName, res[0].id, res[0].title, companyRolesArray);
            }
        }
    })
}

function deleteEmp(firstName, lastName, employeeID) {
    console.log("You've entered employee delete.")

    const queryDelete = "DELETE FROM employee WHERE employee.id = (?);"
    const confirmDelete = new InquirerFunctions(inquirerTypes[2], 'confirm_choice', questions.deleteEmployee2 + firstName + " " + lastName + "?", ["yes", "no"]);
    const deleteQuery = new SQLquery(queryDelete, employeeID);

    //I created a confirm method in inquirer.js but was having trouble keeping scope and keeping functions from waiting so I did a list inquirer instead.
    inquirer.prompt([confirmDelete.ask()]).then(respObj => {
        if (respObj.confirm_choice === "yes") {
            deleteQuery.delete(mainMenu);
        } else {
            mainMenu();
        }
    })
}

function updateEmpRole(firstName, lastName, employeeID, employeeRole, RolesArray) {
    console.log("Entered update employee role.")
    console.log(firstName);
    console.log(lastName);
    console.log(employeeID);
    console.log(employeeRole);
    console.log(RolesArray);

    const empNewRole = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.updateRole, RolesArray);
    
    const queryGetRoleId = `SELECT role.id
                    FROM role
                    Where role.title = (?);`
        inquirer.prompt([empNewRole.ask()]).then(chosenRole => {
            
            connection.query(queryGetRoleId, chosenRole.employee_role, function(err,res){
                if(err){
                    throw err
                }
                console.log(employeeID);
                console.log(res[0].id);

                const queryUpdateRoleId = `UPDATE employee
                                            SET employee.role_id = (?)
                                            WHERE employee.id = (?)`

                const updateEmpRoleId = new SQLquery(queryUpdateRoleId, [res[0].id, employeeID ])
                
                updateEmpRoleId.update(mainMenu);
                
            })

           

    })
    

}









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
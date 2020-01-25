## Employee Management System:
Create an app that allows the users to create and manage Employee Database.  The database consists of three tables employee, role, and department.  The user has the following options in the main menu.

the link to github is shown below:
https://github.com/jlovejo2/Employee-Management-System.git


## Table of Contents
* [User Story](#user-story)
* [Version 1.0](#version-1.0)
* [How To Use](#how-to-use)
* [Coding Languages Used](#coding-languages-used)
* [NPMs Used](#npms-used)
* [Structure of Code and Functions](#structure-of-code-and-functions)
* [Known Issues With Code](#known-issues-with-code)

## User Story
As a business owner I am in need of an app that allows me to create and edit a company database.  This database will keep track of my departments and the job roles in each department.  Then it will also keep track of my department managers and their employees.  The employees will all have basic information such as first and last name, salary, job title(role), department they work in and who their manager is.

## Version 1.0
* This employee management app runs by typing "node index.js" in the command line.
* Need to be in the main folder in terminal when running the command.

## How To Use
See the beginning prompt of app below.  
*![alt text](/public/Assets/images/main_menu.png "Starting Prompt of App") 

This main menu holds all the functionality of the app.  It is here that you will be returned when you complete each operation.  The options are listed below:
# 
    View all departments
    View all roles
    View all employees
    View all employees by department
    View all employees by manager
    view all employees by role
    view all managers
    Add a department
    Remove a department
    Add a role
    Remove a role
    Add employee
    Remove employee
    Update employee role
    Update employee manager

# Hints when using
    - app will prompt user which employee to delete with more information if there are two employees with same name
    - When an update and delete is performed on an employee or role the app checks for multiples instances in the database with the same name
        and trys to help by giving further options to decipher which instance you are trying to change.  This is because you could have a role by the same title in different departments or employees with the same name in your company.
    - When employee role is updated the department for that employee automatically updated

* **Note:**
    - When creating database from scratch it is important to start with departments.
    - Then add the roles for each department
    - Then add the employees.
    - **This is important becasue "add", "delete" and "view by" are prompted by lists generated from database**

## Coding Languages Used
* Javascript
* Node.js
* SQL

## NPMs Used:
* NPM mysql
* NPM inquirer
* NPM figlet
* NPM asTable


## Structure of Code and Functions
* db folder - contains the files used to initialize my database in SQL workbench
    - employee_management_setup.sql: is the file used to create the schema and tables
    - seed.sql:  is the file with values to fill table with that I used for testing
* lib folder - contains all my javascript files that are referenced by index.js
    - commandMenu.js - contains the JSON object will all my main menu command choices
    - inquirer.js - contains a class called InquirerFunctions.  This class is used to assist in the creation of the inquirer ask objects for each inquirer prompt.  It gets passed the parameters type, name, message, and choices. With the ultimate result of promise.all on multiple inquirer instances because some inquirer prompts rely on data being brought back from SQL queries
    - questions.js - contains all my questions that are used in the inquirer prompts
    - SQL_login.js - contains the createConnection for mySql
    - SQL_queries.js - contains a class called SQLqueries.  This class is used to assist and attempt to clean up index.js file by using it for alot of the more basic and repeatable SQL queries that were used.  The parameters it receives are query and values.
* Public Folder
    - Assets Folder
        - Images Folder
            - main_menu.png - image used in README.md
* Index.js - The file that contains the bulk of the code and functionality.


## Known Issues With Code
*  - The index.js file is incredibly cumbersome to look at and would be beneficial to clean up and utilize SQL_queries.js more
    - Must create new department before creating a new manager.  Logic takes you down a path where user will be prompted to add a manager for that manager which then determines their department.
    - Currently a manager can manage someone not in their department.  Not sure if its an issue but important to note.
    - One thing with code is that I have a SQLqueries file but still do queries in index.js  The reason I do this is because I was unable to figure out how to return the response object from the query when referencing the general method I created until the end of the week.
    - Currently when deleting a role or a department the user is not told if their are employees in existance with that role or in that department.  This is a problem because when they delete that role or department the employees are deleted too.
    - View employees by manager will not always display proper manager if there are two managers with same name.  I ran out of time to duplicate the update check functionality to this function.

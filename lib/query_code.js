const queries = {
    view_All_Query: "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id"
}

module.exports = queries;
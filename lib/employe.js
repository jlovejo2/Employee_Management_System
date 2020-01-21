
//user can create employee
//user specifies type of employee



class Employee {
    constructor (name, id, email) {

            this.name = name;
            this.id = id;
            this.email = email;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getEmail() {
        return this.email;
    }

    getRole() {
        return this.constructor.name;
    }

    printInfo() {
        console.log(`Role: ${this.constructor.name}`);
        console.log(`Name: ${this.name}`);
        console.log(`ID: ${this.id}`);
        console.log(`Email: ${this.email}`);
        
    }

}

// const a = new Employee("joey");

// console.log(a.name);

// employee = new Employee("ed", 23, "1234@yahoo.com");

// employee.printInfo();


module.exports = Employee;
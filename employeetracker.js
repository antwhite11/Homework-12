const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
require("console.table");
var connection = mysql.createConnection({
    host : "localhost",
    port: 3306,
    user: "root",
    password: "six4teen",
    database: "employees"
});


connection.connect(function(err){

    if (err) throw err;
    search();
});
connection.query = util.promisify(connection.query);



function search(){

    inquirer.prompt({
        
        name: "chooseaction",
        type: "list",
        message: "Choose an action!",
        choices: [

            "View all employees",
            "View departments",
            "View roles",
            "Add new employee",
            "Add new department",
            "Update employee role",
            "Add new role"

        ]




    }).then(function(answer) {
        switch(answer.chooseaction){
            case "View all employees":
                showAllEmployees();
                break;

            case "View departments":
                showAllDepts();
                break;

            case "View roles":
                showAllRoles();
                break;

            case "Add new employee":
                addNewEmployee();
                break;

            case "Update employee role":
                updateRole();
                break;

            case "Add new department":
                addDept();
                break;


            case "Add new role":
                newRole();
                break;
            
             };

                 
        });

    };




  
    
    
    
    
    
    async function showAllEmployees() {
        let query = allEmployees()
        let employees = await connection.query(query)
        console.table(employees)
        search()
     };



    async function showAllDepts() {
        let query = allDepartments()
        let department = await connection.query(query)
        console.table(department)
        search()

    };

    async function showAllRoles() {
        let query = allRoles()
        let role = await connection.query(query)
        console.table(role)
        search()
    }


function addDept(){
    
    //console.log("hello")
    
    
    inquirer.prompt({
        type: "input",
        name: "adddepartment",
        message: "What department are you adding?"

        })
        .then(function(answers){
            let query = "INSERT INTO department(name) VALUES(?);"
            connection.query(query,[answers.adddepartment], function(err,res){
                if(err) throw err;
                search()

        })

    })

}

async function updateRole() {
    let employeeQuery = allEmployees();
    let employee = await connection.query(employeeQuery);
    let roleQuery = allRoles();
    let roles = await connection.query(roleQuery)


    let employeeChoice = employee.map(({id,first_name,last_name})=> ({

        name: `${first_name} ${last_name}`,
        value: id
    
    }));

    let roleChoice = roles.map(({id,title})=>({
        name: title,
        value: id
    }));

    inquirer.prompt([
        
        
        {
        name: "employee",
        type: "list",
        message: "Which role would you like to change?",
        choices: employeeChoice

        },

        {

        name: "new_role",
        type: "list",
        message: "Which role do you want to assign?",
        choices: roleChoice
        }

    ])
        .then(function(answer){

            let query = "UPDATE employee SET role_id = ? WHERE id = ?;"
            connection.query(query,[answer.new_role,answer.employee],function(err,res){

                if(err) throw err;
                search();

        })
    })

}


async function newRole() {

    let deptsQuery = allDepartments();
    let dept = await connection.query(deptsQuery)


    let deptChoices = dept.map(({id,name})=>({
        name: name,
        value: id

    }));

    
    inquirer.prompt([
        
        {
        type: "input",
        name: "role",
        message: "What is the name of the new role?"


    },
    
    {
        type: "input",
        name: "salary",
        message: "Salary for this role?"

    },

    {   
        type: "list",
        name: "deptID",
        message: "Which department holds this role?",
        choices: deptChoices

    }


])
    .then(function(answers){
        let query = "INSERT INTO role(title, salary, department_id) values( ? , ?, ?);"
        connection.query(query,[answers.role, answers.salary, answers.deptID], function(err,res){

            if (err) throw (err);
            search()



        })



    })



}


async function addNewEmployee() {
    let employeesQuery = allEmployees()
    let employees = await connection.query(employeesQuery)
    let rolesQuery = allRoles()
    let roles = await connection.query(rolesQuery)
  
    
    
    
    let managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
    
    
    
    
    let roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id
    }));
    
    
    
  
    inquirer.prompt([{
      name: "firstname",
      type: "input",
      message: "First name?"
    },
    
    
    
    {
      name: "lastname",
      type: "input",
      message: "Last name?"
    },
    
    
    
    {
      name: "role",
      type: "list",
      message: "Role?",
      choices: roleChoices
  
    },
    
    
    
    
    {
      name: "manager",
      type: "list",
      message: "Manager?",
      choices: managerChoices
  
    }])
      
    
        .then(function(answer) {
        
            var query = "INSERT INTO employee(first_name, last_name,role_id, manager_id) values( ? , ?, ?, ?);"
        connection.query(query, [answer.firstname, answer.lastname, answer.role, answer.manager], function (err, res) {
          if (err) throw err;
          
          search();
        
        
        })
      })
  }



      
  function allEmployees (){
    const allEmployeesQuery = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;" 
      return allEmployeesQuery
  }

  function allRoles() {
      const allRolesQuery = "SELECT role.id, role.title, department.name, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
      return allRolesQuery
  }

  function allDepartments() {
      const allDepartments = "SELECT * FROM department;"
      return allDepartments
  }









var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
    res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
var port =process.env.PORT||2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let mysql=require("mysql");
let connData={
    host:"localhost",
    user:"root",
    password:"",
    database:"testdb",
}

app.get("/employees", function (req, res) {
    let department = req.query.department;
    let designation = req.query.designation;
    let gender = req.query.gender;
  
    let connection = mysql.createConnection(connData);
  
    let conditions = [];
    let values = [];
  
    if (department) {
      conditions.push("department = ?");
      values.push(department);
    }
    if (designation) {
        conditions.push("designation = ?");
        values.push(designation);
      }
      if (gender) {
        conditions.push("gender = ?");
        values.push(gender);
      }
    
      if (conditions.length > 0) {
        let sql = "SELECT * FROM employees WHERE " + conditions.join(" AND ");
        connection.query(sql, values, function (err, result) {
    
          if (err) {
            res.status(500).send("Internal Server Error");
        } else if (result.length === 0) {
            res.status(404).send("No Data Found");
          } else {
            res.send(result);
          }
        });
      } else {
        let sql = "SELECT * FROM employees";
        connection.query(sql, function (err, result) {
    
          if (err) {
            res.status(500).send("Internal Server Error");
          } else if (result.length === 0) {
            res.status(404).send("No Data Found");
          } else {
            res.send(result);
      }
    });
  }
});
app.get("/employees/dept/:dept",function(req,res){
    let dept=req.params.dept
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM employees WHERE department=?";
    connection.query(sql,dept,function(err,result){
        if(err) res.status(404).send(err);
        else res.send(result);
    })
})
app.get("/employees/designation/:desg",function(req,res){
    let desg=req.params.desg;
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM employees WHERE designation=?";
    connection.query(sql,desg,function(err,result){
        if(err) res.status(404).send(err);
        else res.send(result);
    })
});

app.post("/newEmp",function(req,res){
    let body=req.body;
    let connection=mysql.createConnection(connData);
    let sql="INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES (?,?,?,?,?,?)"
    connection.query(sql,[body.empCode,body.name,body.department,body.designation,body.salary,body.gender],function(err,result){
        if(err) res.status(404).send(err);
        else{
            let sql="SELECT * FROM employees";
            connection.query(sql,function(err,result){
                if(err) res.status(404).send(err);
                else res.send(result);
            })
        }
    })
});
app.get("/employee/:empCode",function(req,res){
    let empCode=req.params.empCode;
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM employees WHERE empCode=?";
    connection.query(sql,empCode,function(err,result){
        if(err) res.status.apply(404).send(err);
        else res.send(result);
    })
})
app.put("/employee/:empCode",function(req,res){
    let empCode=req.params.empCode;
    let body=req.body;
    let connection=mysql.createConnection(connData);
    let sql="UPDATE employees SET ? WHERE empCode=?";
    connection.query(sql,[body,empCode],function(err,result){
        if(err) res.status(404).send(err);
        else{
            let sql="SELECT * FROM employees";
            connection.query(sql,empCode,function(err,result){
                if(err) res.status(404).send(err);
                else res.send(result);
            })
        }
    })
})
app.delete("/employees/:empCode",function(req,res){
    let empCode=req.params.empCode;
    let connection=mysql.createConnection(connData);
    let sql="DELETE FROM employees WHERE empCode=?";
    connection.query(sql,empCode,function(err,result){
        if(err) res.status(404).send(err);
        else{
            let sql="SELECT * FROM employees";
            connection.query(sql,empCode,function(err,result){
                if(err) res.status(404).send(err);
                else res.send(result);
            })
        }
    })

})
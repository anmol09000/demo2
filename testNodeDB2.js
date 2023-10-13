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

const { Client } = require("pg");
const client = new Client({
  user:"postgres",
  password:62653903220906,
  database:"postgres",
  port:5432,
  host:"db.gjzcvxpbdbslbpezuedu.supabase.co",
  ssl: { rejectUnauthorized: false },
});
client.connect(function(res,error){
  console.log(`connected!!!`);
});

app.get("/employees", function (req, res) {
    let department = req.query.department;
    let designation = req.query.designation;
    let gender = req.query.gender;
  
  
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
        const sql = `SELECT * FROM employees WHERE ` + conditions.join(" AND ");
        client.query(sql, values, function (err, result) {
    
          if (err) res.status(400).send(err)
          else res.send(result.rows);
        client.end();
        });
      } else {
        const sql = `SELECT * FROM employees`;
        client.query(sql, function (err, result) {
    
          if (err) { res.status(400).send(err);}
          else res.send(result.rows);
          client.end();
    });
  }
});
app.get("/employees/dept/:dept",function(req,res){
    let dept=req.params.dept
    const sql=`SELECT * FROM employees WHERE department=?`;
    client.query(sql,dept,function(err,result){
        if(err) res.status(400).send(err);
        else res.send(result);
    })
})
app.get("/employees/designation/:desg",function(req,res){
    let desg=req.params.desg;
    const sql=`SELECT * FROM employees WHERE designation=?`;
    client.query(sql,desg,function(err,result){
        if(err) res.status(400).send(err);
        else res.send(result.rows);
    })
});

app.post("/newEmp",function(req,res){
    let body=Object.values(req.body);
    const sql=`INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES (?,?,?,?,?,?)`
    client.query(sql,body,function(err,result){
        if(err) res.status(400).send(err);
        else res.send( `${result.rowCount} insertion successful`)
    })
});
app.get("/employee/:empCode",function(req,res){
    let empCode=req.params.empCode;
    const sql=`SELECT * FROM employees WHERE empCode=?`;
    client.query(sql,empCode,function(err,result){
        if(err) res.status.apply(400).send(err);
        else res.send(result.rows);
    })
})
app.put("/employee/:empCode",function(req,res){
    let empCode=req.params.empCode;
    let body=req.body;
    const sql=`UPDATE employees SET ? WHERE empCode=?`;
    client.query(sql,[body,empCode],function(err,result){
        if(err) res.status(400).send(err);
        else res.send(`${result.rowCount} updation successful`);
    })
})
app.delete("/employees/:empCode",function(req,res){
    let empCode=req.params.empCode;
    const sql=`DELETE FROM employees WHERE empCode=?`;
    client.query(sql,empCode,function(err,result){
        if(err) res.status(400).send(err);
        else res.send(result.rowCount)
    })

})
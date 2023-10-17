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
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "62653903220906",
  database: "postgres",
  port: 5432,
  host: "db.xmrxwivrxbqrqwcznjat.supabase.co",
  ssl: { rejectUnauthorized: false },
});
client.connect(function (error) {
  if (error) {
    console.error("Error connecting to the database:", error);
  } else {
    console.log("Connected to the database!");
  }
});

app.get("/employees", function (req, res) {
  let department = req.query.department;
  let designation = req.query.designation;
  let gender = req.query.gender;

  let conditions = [];
  let values = [];

  if (department) {
    conditions.push("department = $1");
    values.push(department);
  }
  if (designation) {
    conditions.push("designation = $2");
    values.push(designation);
  }
  if (gender) {
    conditions.push("gender = $3");
    values.push(gender);
  }

  if (conditions.length > 0) {
    const sql = `SELECT * FROM employees WHERE ${conditions.join(" AND ")}`;
    client.query(sql, values, function (err, result) {
      if (err) {
        res.status(404).send("No Data Found");
      } else {
        res.send(result.rows);
      }
    });
  } else {
    const sql = `SELECT * FROM employees`;
    client.query(sql, function (err, result) {
      if (err) {
        res.status(404).send("No Data Found");
      } else {
        res.send(result.rows);
      }
    });
  }
});

app.get("/employees/dept/:dept", function (req, res) {
  let dept = req.params.dept;
  const sql = `SELECT * FROM employees WHERE department=$1`;
  client.query(sql, [dept], function (err, result) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(result.rows);
    }
  });
});

app.get("/employees/designation/:desg", function (req, res) {
  let desg = req.params.desg;
  const sql = `SELECT * FROM employees WHERE designation=$1`;
  client.query(sql, [desg], function (err, result) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(result.rows);
    }
  });
});

app.post("/newEmp", function (req, res) {
  let body = Object.values(req.body);
  const sql = `INSERT INTO employees(empcode, name, department, designation, salary, gender) VALUES ($1, $2, $3, $4, $5, $6)`;
  client.query(sql, body, function (err, result) {
    if (err) {
      res.status(404).send(err);
    } else {
      const sql = `SELECT * FROM employees`;
      client.query(sql, function (err, result) {
        if (err) {
          res.status(404).send(err);
        } else {
          res.send(result.rowCount.toString());
        }
      });
    }
  });
});

app.get("/employee/:empCode", function (req, res) {
  let empCode = req.params.empCode;
  const sql = `SELECT * FROM employees WHERE empCode=$1`;
  client.query(sql, [empCode], function (err, result) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(result.rows);
    }
  });
});

app.put("/employee/:empCode", function (req, res) {
  let empCode = req.params.empCode;
  let body = req.body;
  const sql = `UPDATE employees SET name=$1, department=$2, designation=$3, salary=$4, gender=$5 WHERE empCode=$6`;
  const values = [body.name, body.department, body.designation, body.salary, body.gender, empCode];
  client.query(sql, values, function (err, result) {
    if (err) {
      res.status(404).send(err);
    } else {
      const sql = `SELECT * FROM employees`;
      client.query(sql, function (err, result) {
        if (err) {
          res.status(404).send(err);
        } else {
          res.send(result.rowCount.toString());
        }
      });
    }
  });
});

app.delete("/employees/:empCode", function (req, res) {
  let empCode = req.params.empCode;
  const sql = `DELETE FROM employees WHERE empCode=$1`;
  client.query(sql, [empCode], function (err, result) {
    if (err) {
      res.status(404).send(err);
    } else {
      const sql = `SELECT * FROM employees`;
      client.query(sql, function (err, result) {
        if (err) {
          res.status(404).send(err);
        } else {
          res.send(result.rowCount.toString());
        }
      });
    }
  });
});

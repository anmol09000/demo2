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
const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { Client }=require("pg");
const client=new Client({
    user:"postgres",
    password:"62653903220906",
    database:"postgres",
    port:5432,
    host:"db.tyvjrnpejwxstnosawyy.supabase.co",
    ssl:{ rejectUnauthorized:false },
})
client.connect(function(err,result){
    console.log("connected!!!");
})

app.get("/mobiles",function(req,res){
    let brand=req.query.brand;
    let ram=req.query.ram;
    let rom=req.query.rom;

    let conditions=[];
    let values=[];
    if(brand){
        let brandArr=brand.split(",");
        conditions.push(`brand = ANY($1)`);
        values.push(brandArr);
    }
    if(ram){
        let RAMarr=ram.split(",");
        conditions.push(`ram = ANY($1)`);
        values.push(RAMarr);
    }
    if(rom){
        ROMarr=rom.split(",");
        conditions.push(`rom = ANY($1)`);
        values.push(ROMarr);
    }
    
    if(conditions.length > 0){
        let sql=`SELECT * FROM mobiles WHERE ` + conditions.join(" AND ");
        console.log(sql);
        client.query(sql,[values],function(err,result){
            if(err) res.status(404).send("No Data Found");
            else res.send(result.rows);
        })
    }else{
        let sql=`SELECT * FROM mobiles`;
        client.query(sql,function(err,result){
            if(err) res.status(404).send("No Data Found");
            else res.send(result.rows);
        })
    }
});
app.get("/mobiles/:name",function(req,res){
    let name=req.params.name;
    let sql=`SELECT * FROM mobiles WHERE name=$1`;
    client.query(sql,[name],function(err,result){
        if(err) res.status(404).send("No Data Found");
        else res.send(result.rows);
    })
})
app.get("/mobiles/brand/:brand",function(req,res){
    let brand=req.params.brand;
    let sql=`SELECT * FROM mobiles WHERE brand=$1`;
    client.query(sql,[brand],function(err,result){
        if(err) res.status(404).send("No Data Found");
        else res.send(result.rows);
    })
});
app.get("/mobiles/RAM/:RAM",function(req,res){
    let RAM=req.params.RAM;
    let sql=`SELECT * FROM mobiles WHERE RAM=$1`;
    client.query(sql,[RAM],function(err,result){
        if(err) res.status(404).send("No Data Found");
        else res.send(result.rows);
    })
});
app.get("/mobiles/ROM/:ROM",function(req,res){
    let ROM=req.params.ROM;
    let sql=`SELECT * FROM mobiles WHERE ROM=$1`;
    client.query(sql,[ROM],function(err,result){
        if(err) res.status(404).send("No Data Found");
        else res.send(result.rows);
    })
});
app.get("/mobiles/OS/:OS",function(req,res){
    let OS=req.params.OS;
    let sql=`SELECT * FROM mobiles WHERE OS=$1`;
    client.query(sql,[OS],function(err,result){
        if(err) res.status(404).send("No Data Found");
        else res.send(result.rows);
    })
});
app.post("/addMobile",function(req,res){
    let body=Object.values(req.body);
    let sql=`INSERT INTO mobiles(name,price,brand,ram,rom,os) VALUES ($1,$2,$3,$4,$5,$6)`;
    client.query(sql,body,function(err,result){
        if(err) res.status(404).send(err);
        else res.send(result.rowCount.toString());
    })
});
app.put("/mobiles/:name/edit", function (req, res) {
    let name = req.params.name;
    let body = req.body;
    let sql = `UPDATE mobiles SET name=$1, price=$2, brand=$3, ram=$4, rom=$5, os=$6 WHERE name=$7`;
    client.query(sql, [body.name, body.price, body.brand, body.ram, body.rom, body.os, name], function (err, result) {
        if (err) {
            res.status(404).send("Error: " + err);
        } else {
            res.send("Edited Successfully!");
        }
    });
});

app.delete("/mobiles/:name/delete",function(req,res){
    let name=req.params.name;
    let sql=`DELETE FROM mobiles WHERE name=$1`;
    client.query(sql,[name],function(err,result){
        if(err) res.status(404).send("No Data Found");
        else res.send("Deleted Successfully!");
    })
})

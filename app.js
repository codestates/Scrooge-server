require("dotenv").config();
const cors = require("cors");
const controllers = require("./controllers");
const cookieParser = require("cookie-parser");
const models = require("./models");
const express = require("express")

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    credentials: true
}));

app.use(cookieParser());

const port = 3000; // 배포환경 http: 80 // https: 443

// users
app.post("/signup", upload.single('photo'), controllers.signup);
app.post("/fixuserinfo", upload.single('photo'), controllers.fixuserinfo);
app.post("/login", controllers.login);
app.get("/signout", controllers.signout);
app.get("/deleteuser", controllers.deleteuser);
app.get("/initialize", controllers.initialize);
app.get("/kakaologin", controllers.kakaologin);
app.get("/googlelogin", controllers.googlelogin);

// settings
app.post("/darkmode", controllers.darkmode);
app.post("/changemainpage", controllers.changemainpage);
app.get("/deletedata", controllers.deletedata);

// category
app.post("/fixcategoryinfo", controllers.fixcategoryinfo);
app.get("/budget", controllers.budget);
app.get("/deletecategory", controllers.deletecategory);
app.get("/getcategoryinfo", controllers.getcategoryinfo);

// day
app.post("/editspendmoney", controllers.editspendmoney);
app.post("/createspendmoney", controllers.createspendmoney);
app.post("/deletespendmoney", controllers.deletespendmoney);
app.get("/daypage", controllers.daypage);

// month
app.get("/getmonthlydata", controllers.getmonthlydata);

// year
app.get("/getyearlydata", controllers.getyearlydata);

let server;
server = app.listen(port,() => {
    console.log(`서버가 ${port}번에서 작동중입니다.`)
})
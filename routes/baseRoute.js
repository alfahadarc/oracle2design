const express = require("express");
const router = express.Router();
const path=require('path');
const multer=require('multer');
require('dotenv').config();
const storage=multer.diskStorage(
    {
        filename:function(req,file,cb){
            console.log(req.body);
            cb(null,req.body.name);
        },
        destination:function(req,file,cb){
            cb(null,'./videos');
        }
    }
);
const upload=multer({storage});


const authRoute = require("../auth/authRoute");
const admindashboardRoute=require('../adminDashboard/adminDashboardRoute');
const clientRoute= require('../client/clientRoute');
const { authorize } = require("../middleware/authJWT");
const role = require("../middleware/role");
// const countryRoute = require("./countryRoute");

// router.use("/country", countryRoute);

//need a homepage route for all unauth user
router.use("/auth", authRoute);
router.use("/admindashboard",authorize([role.Admin]),admindashboardRoute);
router.use('/client',require('../client/clientRoute'));


router.get('/test',upload.single('video'),(req,res,next)=>{
    res.download(path.join(__dirname,'../videos/myVideo.mp4'));
})


module.exports = router;

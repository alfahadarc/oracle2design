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
const {body,validationResult}=require('express-validator');
const ValidationHandler=require('../middleware/validationHandler');
const assemblerRoute=require('../assembler/assemblerRoute');
const deliveryManRoute=require('../deliveryMan/deliveryManRoute');

// router.use("/country", countryRoute);

//need a homepage route for all unauth user
router.use("/auth", authRoute);
router.use("/admindashboard",authorize([role.Admin]),admindashboardRoute);
router.use('/client',require('../client/clientRoute'));
router.use('/assembler',authorize([role.Assesmbler]),assemblerRoute);
router.use('/deliveryMan',authorize([role.DeliveryMan]),deliveryManRoute);

router.get('/test',
body('discount').optional({nullable:true}).isInt(),
ValidationHandler(validationResult,'discount error'),
(req,res,next)=>{
    res.send('ok');
}
)



module.exports = router;

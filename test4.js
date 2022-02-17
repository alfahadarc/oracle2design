//             var products=[{PRODUCT_ID:1,COUNT:2},{PRODUCT_ID:2,COUNT:5}];
//             var freeProducts=[{PRODUCT_ID:1,COUNT:3},{PRODUCT_ID:2,COUNT:5}];
//             var combined=[];
//             products.forEach((value,index,array)=>{
//                 var second= freeProducts.find(
//                     (v)=>{
//                         return v.PRODUCT_ID==value.PRODUCT_ID;
//                     }
//                 );
//                 if(second===undefined){
//                     combined.push({PRODUCT_ID:value.PRODUCT_ID,
//                     COUNT:value.COUNT});
//                 }
//                 else{
//                     combined.push({PRODUCT_ID:value.PRODUCT_ID,
//                     COUNT:value.COUNT+second.COUNT});
//                 }
//             });
//             freeProducts.forEach((value,index,array)=>{
//                 if(combined.findIndex(
//                     (v)=>{
//                         return v.PRODUCT_ID==value.PRODUCT_ID;                
//                     }
//                 )==-1){
//                     combined.push({PRODUCT_ID:value.PRODUCT_ID,
//                         COUNT:value.COUNT});
//                 }
//             });

// console.log(combined);


var a=[{STATUS:'GOOD'},{STATUS:'BAD'},{STATUS:'GOOD'}];
var passed=a.every(
    (value)=>{
        return value.STATUS=='GOOD';
    }
);
console.log(passed);
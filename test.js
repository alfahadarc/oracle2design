var data1=[
    {
        title:"RAM",
        value:12,
        unit:"GB"
    },
    {
        title:"Web Camera Resolution",
        value:48,
        unit:"Mega Pixel"
    },
    {
        title:"Storage",
        value:2,
        unit:"TB"
    },
    {
        title:"Screen Width",
        value:15,
        unit:"inch"
    }
];

var data2=[
    {
        title:"RAM",
        value:16,
        unit:"GB"
    },
    {
        title:"Processor Speed",
        value:1.8,
        unit:"Giga Hertz"
    },
    {
        title:"Storage",
        value:1,
        unit:"TB"
    },
    {
        title:"USB Ports",
        value:4,
        unit:""
    }
];

var combined=[];

for(let i=0;i<data1.length;i++){
    var attr1=data1[i];
    var attr2=data2.find((val)=>{
        if(val.title===attr1.title)
            return true;
        return false;
    });
    if(attr2===undefined){
        combined.push({title:attr1.title,value1:attr1.value,value2:undefined,unit:attr1.unit}); 
    }
    else{
        combined.push({title:attr1.title,value1:attr1.value,value2:attr2.value,unit:attr1.unit}); 
    }
}

for(let i=0;i<data2.length;i++){
    var attr2=data2[i];
    var alreadyHas=combined.some((value)=>{
        if(value.title===attr2.title)
            return true;
        return false;
    });
    if(alreadyHas)
        continue;
    combined.push({title:attr2.title,value1:undefined,value2:attr2.value,unit:attr2.unit});
}

console.log(combined);
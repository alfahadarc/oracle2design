
class Name{
    constructor(name){
        this.name=name;
    }
    sayMyName(){
        console.log(this.name);
    }
}

class Foo{
    constructor(myFunc){
        this.myFunc=myFunc;
    }
    execMyFunc(){
        this.myFunc();
    }
}

module.exports={Name,Foo};
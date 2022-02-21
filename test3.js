/*
comment example: (here roots are 1 and 9)

1. abc
|____2. bac
|____3. cab
     |____4. aaa
     |____5. cdc
          |____6. abc
     |____7. abc
|____8. add

9. aaa
|____10.aaa
     |_____11.


*/
var commentData=[
    {
        id:1,
        parent:null
    },
    {
        id:2,
        parent:1
    },
    {
        id:3,
        parent:1
    },
    {
        id:4,
        parent:3
    },
    {
        id:5,
        parent:3
    },
    {
        id:6,
        parent:5
    },
    {
        id:7,
        parent:3
    },
    {
        id:8,
        parent:1
    },
    {
        id:9,
        parent:null
    },
    {
        id:10,
        parent:9
    },
    {
        id:11,
        parent:10
    },

];

function getRoots(commentData){
    var roots=commentData.filter(
        value=>{
            return value.parent===null;
        }
    );
    return roots;
}

function getChildren(commentData,commentID){
    var children=commentData.filter(
        value=>{
            return value.parent===commentID;
        }
    );
    return children;
}

function getTree(commentData,commentRoot){
    var tree={id:commentRoot.id,children:[]};
    var queue=[];
    queue.push(tree);
    while(queue.length>0){
        var node=queue.shift();
        var children=getChildren(commentData,node.id);
        for(let i=0;i<children.length;i++){
            var childObject={id:children[i].id,children:[]};
            node.children.push(childObject);
            queue.push(childObject);
        }
    }
    return tree;
}

function getForest(commentData){
    var forest=[];
    var roots=getRoots(commentData);
    for(let i=0;i<roots.length;i++){
        forest.push(getTree(commentData,roots[i]));
    }
    return forest;
}
// console.log(getRoots(commentData));

// console.log(getChildren(commentData,3));

console.log(getForest(commentData));


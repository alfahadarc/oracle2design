

function returnNullIfUndefined(attribute){
    if(attribute===undefined)
        return null;
    return attribute;
}

module.exports={returnNullIfUndefined};
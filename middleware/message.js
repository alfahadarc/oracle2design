
function error(message){
    return {message:message};
}

function success(message){
    return {message:message};
}

function internalServerError(){
    return error('Internal Server Error');
}

module.exports={error,internalServerError,success};
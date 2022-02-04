
function handle(validationResult, errorMessage) {
    return async function (req, res, next) {
        var error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(400).json({message:errorMessage});
            return;
        }
        else
            next();
    }
}

module.exports=handle;
exports.errorHandler = (error, req, res, next)=>{
    const err = error.message
    const errorStatus = error.statusCode
    return res.status(errorStatus).json({success:false, error:err})
}
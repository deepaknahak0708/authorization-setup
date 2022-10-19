 const authorised = (req,res, next)=>{
    if(req.isAuthenticated()){
        next()
    }else{
        res.redirect('/login')
    }
 }

 const notAuthorised = (req, res, next)=>{
    if(!req.isAuthenticated()){
        next()
    }else{
        res.redirect('/dashboard')
    }
 }

 
 module.exports = {
    authorised,
    notAuthorised
 }
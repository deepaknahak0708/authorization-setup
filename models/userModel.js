const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    firstname: {
        type:String
    },
    lastname:{
        type:String
    },
    phone:{
        type:String
    },
    otp:{
        type: Number
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    resetLink:{
        type:String
    },
    verified: {
        type: Boolean,
        default: false
    }
},
{timestamps:true}
);


userSchema.pre("save", async function(next){
    try {
        if(!this.isModified("password")){
            return next()
        }

        const hashPw = await bcrypt.hash(this.password, 12)
        this.password = hashPw

        return next()

    } catch (error) {
        next(error)
    }
})



const User = mongoose.model('User', userSchema);

module.exports = User

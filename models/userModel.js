const mongoose =  require('mongoose')

const userSchema =  new mongoose.Schema({
    fullName:{type:String, required:true},
    email:{type:String, required:true},
    password:[{type:String, required:true}], 
    from:{type:Array},
    aplication:{type:String}   
})

const User = mongoose.model('users', userSchema)
module.exports = User
const mongoose = require('mongoose')
const  validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { connect } = require('mongodb')
const des = require('./tasks')
const { deleteMany } = require('./tasks')

const userschema = mongoose.Schema(
    {

        name : {
              type: String,
              trim : true,required : true
        },
        password : {
          type : String,
          required:true,
          minLength : 6,
          trim: true,
          validate(value){ if(value.toLowerCase() == 'password'){
              throw new Error('Change password')
          }}
        },
        email : {
         type : String,unique: true,
         required : true,trim: true,
         lowercase : true,
         validate(value){
             if(!validator.isEmail(value)) {
                 throw new Error('Not an Email')
             }
         }
        
        },
         age : {
                 type : Number,
                 default : 0,
                 validate(value){
                        if(value < 0){
                            throw new Error('Age must be positive')
                        }
                 }
         },
      
         tokens : [{
             token :{
                 type : String,
                 required:true,
                 
             }
         }],
         avatar : {
             type : Buffer,
            //  for files
         }
    },   { timestamps : true},
       
    
)

// virtual prop

userschema.virtual('tasks',{

    ref : 'tasks',
    localField : '_id',
    foreignField : 'author',
})


userschema.statics.findByCredentials = async (email,password)=>{
// gets called from router
const user = await User.findOne({email})
if(!user){
    throw new Error('Unable to login')
}
const match =  await bcrypt.compare(password,user.password)

if(!match){
    throw new Error('Unable to login')
}
return user

}

// authtoken
userschema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id : user.id.toString()},process.env.jwt_secret)
    user.tokens = user.tokens.concat({token})
    // concat() is used to join two or more strings 
    await user.save()
    return token
}

userschema.methods.toJSON = function(){
// userschema.methods.getPublicProfile = function (){
// toJSON returns stringified object
    const user = this
    const userobject = user.toObject()

    delete userobject.password
    delete userobject.tokens
    delete userobject.avatar
     return userobject
}

// pre runs before user is saved  POST after 
// plain text password hash before saving


userschema.pre('save',async function(next){
 
      const user = this

      if(user.isModified('password')){
          user.password = await bcrypt.hash(user.password,8)
      }

      console.log('Just before save')


      next()
    //   to know the save is done
})
// deleter uer tasks when user removed
userschema.pre('remove',async function(next){
    const user = this
    des.deleteMany({ owner : user._id})
    next()
})

const User = mongoose.model('user',userschema)

module.exports = User
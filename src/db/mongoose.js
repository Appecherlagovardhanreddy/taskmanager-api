const mongoose = require('mongoose')



// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    // env variabe
    mongoose.connect(process.env.MONGODB_URL,{
 useNewUrlParser : true,
 useCreateIndex : true,
 newFindAndModify : true,

})



// const me = new User({
//     name : 'Appecherla Govardhan Reddy ',
//     email : 'govardHAN123@gmail.com',
//     age : 19,
//     password : 'PASSWORD',
// })

// me.save().then((res)=>{
//     console.log('Cheers !!!',me)
// }).catch((e)=>{
//     console.log(e)
// })



// // challenge

// const des = mongoose.model('tasks',{
//     description : { type : String,
//     required : true,trim: true,
//     },
//     completed : { type : Boolean , 
//      default : false,
//     }
// })

// const putin = new des({
//      description : 'Hey Andrew .' ,
// })

// putin.save().then((r)=>{
//     console.log(putin)
// }).catch((e)=>{
//     console.log('Error Occured !')
// })
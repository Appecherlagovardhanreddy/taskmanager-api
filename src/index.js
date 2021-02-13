const express = require('express')
require('./db/mongoose')

// const User = require('./db/models/user')

const des = require('./db/models/tasks')
const { findById } = require('./db/models/user')
const { ObjectId } = require('mongodb')

const userrouter = require('./router/user')
const taskrouter = require('./router/tasks')
const app = express()


// creating new router 

// const router = new express.Router()
// router.get('/test',(req,res)=>{
//     res.send('Test') })

// register user   app.use(router)



// updating user 

  //  by express

// app.patch('/users/:id',(req,res)=>{
//     const id = req.params.id
//     des.findByIdAndUpdate(id,req.body).then((s)=>{
//         req.send(s)
//     }).catch((e)=>{
//         res.send(e)
//     })
// })






const port = process.env.PORT

// express middle ware

// app.use((req,res,next)=>{
//  if(req.method == "GET"){
//    res.send(':Disabled')
//  }
//  else{
//    next()
//  }
    
//   })

// challengr middle wear 

// app.use((req,res)=>{
//   if(req.method){
//           res.status(503).send('Website Under maintainence')
//   }
//   else{
//     next()
//   }
// })

// multer - file uploading 

const multer = require('multer')

const upload = multer({

      dest : 'images',
      limits : {
      fileSize : 1000000,
      // 1mb 
    },
        
      fileFilter(req,file,callback){
       if(!file.originalname.match(/\.(doc|docx)$/)){
          return callback('Please upload  a word doc ')
               
       }
       callback(undefined,true)
     


        // callback(new Error('File must be  a PDF '))
        // callback(undefined, true)
        // callback(undefined,false)

           }
        
})

// const error_middleware = (req,res,next) =>{
//   throw new Error (' Error my middlewear')
// }

app.post('/upload',upload.single('upload'), (req,res)=>{
  res.send()
},(error,req,res,next)=>{
// ctching error from middlw wear 
  res.status(400).send({Error : "Hello error"})
})



  app.use(express.json())
  // register router 
  app.use(userrouter)
  app.use(taskrouter)

app.listen(port,()=>{
    console.log('Server is up on port',port)
})

// const jwt = require('jsonwebtoken')

// const myfunction = async()=>{
    
//   const token =   jwt.sign({ _id : 'abc123' },'thisismytoken',{ expiresIn : '5 seconds'})

//   console.log(token)

// const data = jwt.verify(token,'thisismytoken')
// console.log(data)
// }

// myfunction()


// const prt = {
//   name : "hat"
// }

// prt.toJSON =  function(){

//   console.log(this)
//   return this
// }
// console.log(JSON.stringify(prt))

const Task = require("./db/models/tasks")
const User =  require("./db/models/user")
const main = async ()=>{
// const task = await Task.findById('601fbd56c0e44575c47c4357')
//  await task.populate('author').execPopulate()
//  console.log(task.author)
  
// populate 

// const user  = await User.findById('602269bae501ae1250c7f19b')
// await user.populate('tasks').execPopulate()
// console.log(user.tasks)
}
main()



const express = require('express')
const User = require("../db/models/user")
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        const Authtoken = await user.generateAuthToken()
        res.status(201).send({user : user})
    } catch (error) {
        res.status(400).send()
    }
   
 })

 router.post('/users/login',async(req,res)=>{
      
    try {
        // res.send({hello : 12})
    const user = await User.findByCredentials(req.body.email,req.body.password)
    // here user gets returned value
    const token = await user.generateAuthToken()
    res.send({user: user,token}) 
    // res.send({user :user.getPublicProfile,token})

} catch (e) {
    
    res.status(400).send()
}


 })
 
//  logout one device
 router.post('/users/logout',auth,async (req,res)=>{
      
   try {
          req.user.tokens =  req.user.tokens.filter((token)=>{
              return token.token !== req.token 
          })    
   
        await req.user.save()
          res.send({logged : 'OUT'})

   } catch (error) {
        res.status(500).send()
   }

 })

//  logout all 

router.post('/users/logoutall',auth,async(req,res)=>{
    try {
        
        req.user.tokens = []
        req.user.save()
        res.send()
        
    } catch (error) {
        res.status(500).send()
    }
})

 router.get('/users/me',auth,async(req,res)=>{
    //   User.find({}).then((users)=>{
    //           res.send(users)    
    //   }).catch((e)=>{ res.status(500).send()})

       res.send(req.user)
 })
 
 
 
 // by async await 
 router.patch('/users/me',auth,async(req,res)=>{
     
    // trying to update somthing that doesnot exist

    const updates =  Object.keys(req.body)
    const allowedUpdates = ['name', 'email' ,'password','age']

    const validOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!validOperation){
       return res.status(400).send({"error"  : "Invalid updates"})

   } 
  
    try {
    //   const upuser = await User.findById(req.body.id)
       
      updates.forEach((update)=> req.user[update] = req.body[update])

      await req.user.save()

        // findbyidandupdate bipasses mongoose it perfoms direct operation on db which affects middlewear
        // const upuser = await User.findByIdAndUpdate(req.params.id , req.body,{new : true,runValidators : true})
        // if(!upuser){
        //     return req.status(404).send()
        // }

        res.status(200).send(req.user)


    } catch (error) {

        res.status(400).send(error)
    }
})

router.delete('/users/me',auth ,async(req,res)=>{
   
    try {

        // const deleteUser = await User.findByIdAndDelete(req.user._id)
        // if(!deleteUser){
        //     return req.status(400).send()
        // }
    
        await req.user.remove()

        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error)
        
    }
})

// setting user profile picture

const profile_avatar = multer({
    // dest : 'avatars',
    limits : {
        fileSize : 1000000,
    },
    fileFilter (req,file,cb){
        
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
                   
            cb('PLS UPLOAD jpg,jpeg,png format only ')
        }

        cb(undefined,true )                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    }


})



router.post('/users/me/avatar',auth,profile_avatar.single('avatar'),async(req,res)=>{

     const buffer = await sharp(req.file.buffer).resize({ width : 250 , height : 250 }).png().toBuffer()

    //  req.user.avatar =  req.file.buffer
    req.user.avatar = buffer
    //contains binary data of that file
    await req.user.save()
    console.log(req.user)

    res.send()

},(error,req,res,next)=>{

    // catching error from middle wear
    res.status(400).send({ Error : 'Error Occured - not in format '})
})

// deleting router for avatar

router.delete('/users/me/avatar',auth,async (req,res)=>{

    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// fetching an avatar 

router.get('/users/:id/avatar',async(req,res)=>{

try {
    const user_id = req.params.id 

    const user = await User.findById(user_id)

    if(!user || !user.avatar){

        throw new Error()
    }
    
    res.set('Content-Type','image/png')    
    // setting the header

    res.send(user.avatar)

} catch (error) {
    res.status(400).send()
}
})

module.exports = router

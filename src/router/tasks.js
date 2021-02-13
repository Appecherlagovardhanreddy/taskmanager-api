const express = require("express")
const router =  express.Router()
const des = require("../db/models/tasks")
const auth = require('../middleware/auth')

router.post('/tasks',auth,(req,res)=>{
    // const task = new des(req.body)
    const task = new des({
        ...req.body,
        author : req.user._id
    })

    task.save().then(()=>{
        res.status(201).send(task)
    }).catch((e)=>{res.send(e)})
})

router.get('/tasks',auth,async(req,res)=>{
// GET/tasks?completed=true or false 
// GET/tasks?limit=5&skip=0
// GET/tasks?sortBy=createdAt_asc/_des or :asc / :desc
const match = {}
// match obj
const sort = {}
if(req.query.status){

    match.completed = req.query.status === 'true'
}

if(req.query.sortBy){

    const parts = req.query.sortBy.split('_')
    sort[parts[0]] = parts[1] === 'desc'? -1 : 1

}


try {
    await req.user.populate({
        path : 'tasks',
        match,
        options : {
            limit : parseInt(req.query.limit),
            skip :parseInt(req.query.skip),
            // sort : {
            //     // createdAt : -1
            //     //  asc : 1 , desc : -1
            //     // completed : -1


            // }
            sort,
        }
    }).execPopulate()

    res.status(200).send(req.user.tasks)
    
} catch (error) {

 res.status(500).send()

}





// try {
//     // await req.user.populate('tasks').execPopulate()
//     await req.user.populate({
//         path : 'tasks',
//         match : {
//             completed : req.query.status,
//             options : {
//                 // limit : parseInt(req.query.limit)
//             }
           
//         }
//     }).execPopulate()
//     res.status(200).send(req.user.tasks)
// } catch (error) {
    
// }
// des.find({author : req.user._id}).then((e)=>{ res.send(e)}).catch((e)=>{res.status(500).send()})

})

router.get('/tasks/:id',auth ,async (req,res)=>{
    const _id = req.params.id

    try {

        const task = await des.findOne({_id,author : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {

        res.status(500).send()
    }
  
    // des.findById(_id).then((r)=>{

    //     if(!r){
    //         return res.status(400).send()
    //     }
    //     res.send(r)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

// updating tasks

router.patch('/tasks/:id',async(req,res)=>{
    const update = Object.keys(req.body)
    const allowed = ['description','completed']
    const operation = update.every((k)=>{
        return allowed.includes(k)
    })
    if(!operation){
        res.status(400).send({Error : 'Update doesnot exist'})
    }

    try {

        const update_task = await des.findById(req.params.id)

  
        // const update_task = await des.findByIdAndUpdate(req.params.id,req.body,{new : true,runValidators : true})

        if(!update_task){
            return res.status(400).send()
        }
        update.forEach((s)=> update_task[s] = req.body[s])

        await update_task.save()

        res.status(200).send(update_task)
    } catch (error) {
         res.status(500).send(500)
    }
   
    

})

// deleting user and tasks



router.delete('/tasks/:id',auth,async(req,res)=>{
    _id = req.params.id
    const deleteUser = await des.findOneAndDelete({_id,author : req.user._id})
    try {
        if(!deleteUser){
            return req.status(400).send()
        }
    
        res.status(200).send(deleteUser)
    } catch (error) {
        res.status(500).send(error)
        
    }

})

module.exports = router

// challenge

const mongoose = require('mongoose')

const taskschema = mongoose.Schema({
    description : { type : String,
        required : true,trim: true,
        },
        completed : { type : Boolean , 
         default : false,
        },
        author : {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref : 'user'
            // creates relationship 
        }
},{
    timestamps :true,
}
)

const des = mongoose.model('tasks',taskschema)
    // description : { type : String,
    // required : true,trim: true,
    // },
    // completed : { type : Boolean , 
    //  default : false,
    // },
    // author : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required : true,
    //     ref : 'user'
    //     // creates relationship 
    // },




module.exports = des
const mongoose = require('mongoose');

const DBSchema = new mongoose.Schema(
    {
        date:{
            type:String,
            required: true
        },
         name:{
            type:String,
            required: true
        },
          contactno:{
            type:Number,
            required: true           
        },
         service:{
            type:String,
            required: true        
        },
        feedback:{
            type:String,
            required: true  
        },      
         status:{
            type:String,
            type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
        }, 
    },
     
) 

module.exports = mongoose.model("DB", DBSchema)
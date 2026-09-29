import mongoose from "mongoose"
const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
     quantity: {
      type: Number,
      required: true,
      min: 1,
    },
     unit: {
      type: String,
      required: true,
      enum: ["centimetre", "Meter", "pcs", "pack"],
    },
    category:{
        type:String,
        require:true
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    TopImage:{
        type:String,
        required:true
    },
    BackImage:{
        type:String,
        required:true
    },
    FrontImage:{
        type:String,
        required:true
    },
    BottomImage:{
        type:String,
        required:true
    },
    

})
 export const Product=mongoose.model("Product",productSchema)
import mangoose from "mongoose";
import {Db_Name} from "../constant.js";

const connectedDB = async ()=>{
     try{
        const connectionResult = await mangoose.connect(`${process.env.MANGODB_URL}${Db_Name}`)
        console.log(`\n MangoDB connected !! `);
     } catch(error){
        console.log("mangoDB connection faild ",error);
        process.exit(1)
     }
}
export default connectedDB;
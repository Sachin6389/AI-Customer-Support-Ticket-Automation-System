import dotenv from 'dotenv'
import connectedDB from './Db/index.js';
import app from './app.js';
import dns from "dns";

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

dotenv.config({
    path:"./.env"
})
connectedDB()
.then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`server is running at port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MangoesDB is connected error",err)
})
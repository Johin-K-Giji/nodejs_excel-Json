const mongoose = require("mongoose")

const databseConn = ()=>{
    try{
        mongoose.connect('mongodb://localhost:27017/testsample')
        console.log("Database Connected");
        

    }catch(error){
       console.error(error)
    }
}

module.exports = databseConn;
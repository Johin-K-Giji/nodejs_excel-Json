const express = require("express")

const axios = require("axios")

const readFile = require("../controller/readFile")
const transform  = require("../controller/transformFile")
const Customer = require("../db/schema")


const router = express.Router();


router.get('/read-excel', async (req, res) => {
    console.log("Reading and transforming Excel file...");
    const rawData = readFile();  
    const transformedData = transform(rawData); 
    
    console.log(transformedData);
    

    try {


        await Customer.insertMany(transformedData);

        console.log('documents inserted successfully');


        
        const response = await axios.post('https://stage.myhealthvectors.com/testserver/receive-report', transformedData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        



        res.json({
            message: "Data successfully sent to API",
            apiResponse: transformedData
        });


    } catch (error) {
        console.error("Error sending data to API:", error.message);
        res.status(500).json({
            message: "Failed to send data to API ",
            error: error.message
        });
    }
});

module.exports = router


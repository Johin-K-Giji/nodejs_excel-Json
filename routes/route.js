const express = require("express")

const axios = require("axios")

const readFile = require("../controller/readFile")
const transform  = require("../controller/transformFile")

const router = express.Router();


router.get('/read-excel', async (req, res) => {
    console.log("Reading and transforming Excel file...");
    const rawData = readFile();  
    const transformedData = transform(rawData);  

    try {
        
        const response = await axios.post('https://stage.myhealthvectors.com/testserver/receive-report', transformedData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        

        console.log("API Response:", response.data);

        res.json({
            message: "Data successfully sent to API",
            apiResponse: response.data
        });
    } catch (error) {
        console.error("Error sending data to API:", error.message);
        res.status(500).json({
            message: "Failed to send data to API",
            error: error.message
        });
    }
});

module.exports = router


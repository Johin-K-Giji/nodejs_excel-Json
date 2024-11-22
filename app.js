const express = require('express'); 
const xlsx = require('xlsx'); 
const axios = require('axios')

const app = express();
const port = 3000; 


const readExcelFile = () => {
    const excelData = xlsx.readFile('./data/input_excel_file_v1.xlsx'); 
    const sheetName = excelData.SheetNames[0];
    console.log("Sheet Names:", excelData.SheetNames); 
    const sheetData = xlsx.utils.sheet_to_json(excelData.Sheets[sheetName]); 
    return sheetData; 
}



function transformData(data) {
    const customers = []; 
  

    data.forEach((row) => {
        const parameter = {
            parameterName: row["Parameter Name"],
            unit: row["Units"],
            parameterCode: String(row["Parameter Code"]),
            value: String(row["Result"]) || null,
            lowerRange: String(row["Low Range"]) || "NULL",
            upperRange: String(row["High Range"]) || "NULL",
            displayRange: row["Low Range"] && row["High Range"]
                        ? `${row["Low Range"]}-${row["High Range"]}`
                        : "-",
        };
  
        const customer = customers.find((c) => c["Customer ID"] === String(row["Customer ID"]));
  
        if (customer) {
            const panel = customer.panelList.find(p => p.panel_code === row["panel_code"]);
  
            if (panel) {
                panel.parameters.push(parameter); 
            } else {
                customer.panelList.push({
                    panel_name: row["panel_name"],
                    panel_code: row["panel_code"],
                    parameters: [parameter] 
                });
            }
        } else {
            customers.push({
                "Customer ID": String(row["Customer ID"]),
                age: String(row["age"]),
                panelList: [{
                    panel_name: row["panel_name"],
                    panel_code: row["panel_code"],
                    parameters: [parameter] 
                }]
            });
        }
    });
  
    return customers; 
}


app.get('/read-excel', async (req, res) => {
    console.log("Reading and transforming Excel file...");
    const rawData = readExcelFile();  
    const transformedData = transformData(rawData);  

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




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

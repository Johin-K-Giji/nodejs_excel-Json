const express = require('express'); 
const xlsx = require('xlsx'); 
const fs = require('fs'); 

const app = express();
const port = 3000; 

// Function to read the Excel file and parse the sheet to JSON
const readExcelFile = () => {
    const excelData = xlsx.readFile('./data/input_excel_file_v1.xlsx'); // Load the Excel file
    const sheetName = excelData.SheetNames[0]; // Get the first sheet name
    console.log("Sheet Names:", excelData.SheetNames); // Log available sheet names for debugging
    const sheetData = xlsx.utils.sheet_to_json(excelData.Sheets[sheetName]); // Convert sheet to JSON
    return sheetData; // Return parsed data
}

// Function to transform the raw data into the required format
function transformData(data) {
    const customers = []; // This will hold all customer data
  
    // Loop through each row of data
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
                panel.parameters.push(parameter); l
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


app.get('/read-excel', (req, res) => {
    console.log("Reading and transforming Excel file...");
    const rawData = readExcelFile();
    const transformedData = transformData(rawData); 
    res.json(transformedData); 
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

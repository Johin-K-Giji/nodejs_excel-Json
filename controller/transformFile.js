

const transformData = (data)=>{
    const customers = [];

    data.forEach((row) => {
        const parameter ={
            parameterName: row["Parameter Name"],
            unit: row["Units"],
            parameterCode: String(row["Parameter Code"]),
            value: String(row["Result"]) || null,
            lowerRange: String(row["Low Range"]) || "NULL",
            upperRange: String(row["High Range"]) || "NULL",
            displayRange: row["Low Range"] && row["High Range"]
                        ? `${row["Low Range"]}-${row["High Range"]}`
                        : "-",
        }

        const customer = customers.find((c)=>c["Customer ID"]===String(row["Customer ID"]))
            if(customer){
                const panel = customer.panelList.find(p => p.panel_code === row["panel_code"]);
                if(panel){
                    panel.parameters.push(parameter); 
                }else{
                    customer.panelList.push({
                        panel_name: row["panel_name"],
                        panel_code: row["panel_code"],
                        parameters: [parameter] 
                    });
                }
            }else{
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

module.exports = transformData
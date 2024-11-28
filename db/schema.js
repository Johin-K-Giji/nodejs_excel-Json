const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    "Customer ID": String,
    age: String,
    panelList: [{
        panel_name: String,
        panel_code: String,
        parameters: [{
            parameterName: String,
            unit: String,
            parameterCode: String,
            value: String,
            lowerRange: String,
            upperRange: String,
            displayRange: String,
        }]
    }]
});

const Customer = mongoose.model('Customer', customerSchema);


module.exports =Customer;
const xlsx = require("xlsx");


const readFile = ()=>{

    const excelData = xlsx.readFile('./data/input_excel_file_v1.xlsx');
    const sheetName = excelData.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(excelData.Sheets[sheetName])
    return sheetData
}

module.exports= readFile
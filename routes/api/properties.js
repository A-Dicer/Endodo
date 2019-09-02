//----------------------------- Requirements --------------------------------------------
const router = require("express").Router();
const XLSX = require('xlsx');

//---------------------- Convert Excell to json format ----------------------------------
let workbook = XLSX.readFile('./Enodo_Skills_Assessment_Data_File_4-19-2019.xlsx');
let sheetNameList = workbook.SheetNames;
let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]])

// --------------------- Matches with "/api/properties" ---------------------------------
router.route("/").get(function (req, res) {res.send(data);})
 
module.exports = router;
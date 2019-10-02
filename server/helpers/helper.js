var Ajv = require('ajv');
var schema = require("../data/data.validator.json")
/**
 * 
 * @param {String} file 
 */
function JsonValidator(file) {
    var ajv = new Ajv({allErrors:true});
    try {
        var jsonfile = require('../data/' + file + '.json');
    } catch (error) {
        return false
    }
    var valid = ajv.validate(schema, jsonfile);
    if (!valid) return false;
    return true
}
module.exports = {
    JsonValidator
}

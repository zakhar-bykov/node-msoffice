const fs = require('fs');

const Document     = require('./modules/document');
const Presentation = require('./modules/presentation');
const Spreadsheet  = require('./modules/spreadsheet');


class MicrosoftOffice {
    constructor() {
        // code...
    }

    // code...
    open(file, callback) {
        // code...
        var object = {};

        callback(null, object);
    }
}


module.exports = new MicrosoftOffice();
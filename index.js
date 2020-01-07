const fs = require('fs');
const path = require('path');

const Document = require('./modules/document');
const Presentation = require('./modules/presentation');
const Spreadsheet = require('./modules/spreadsheet');


class MicrosoftOffice {
    constructor() {
        // code...
    }


    open(file, callback) {
        file = path.parse(file);

        if ( fs.existsSync(file.dir + '/' + file.base) ) {
            if (file.ext === '.doc' || file.ext === '.docx') {
                callback(null, new Document(file.dir + file.base));
            } else if (file.ext === '.ppt' || file.ext === '.pptx') {
                callback(null, new Presentation(file.dir + file.base));
            } else if (file.ext === '.xls' || file.ext === '.xlsx') {
                callback(null, new Spreadsheet(file.dir + file.base));
            } else {
                callback(new Error("Unknown extension: '" + file.ext + "'. Supported extensions: ppt, pptx, doc, docx [, xls, xlsx not yet]"));
            }
        } else if (fs.existsSync(file.dir)) {
            callback(new Error("File '" + file.base + "' does not exists"));
        } else {
            callback(new Error("Directory '" + file.dir + "' does not exists"));
        }
    }
}


module.exports = new MicrosoftOffice();
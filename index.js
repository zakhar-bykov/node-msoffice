const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const local = require('./modules/local');
const remote = require('./modules/remote');
const content = require('./modules/content');


class MicrosoftOffice {
    constructor() {
        // code...
    }


    open(filePath, callback) {
        let file = path.parse(filePath);
        file.path = file.dir + '/' + file.base;

        if (fs.existsSync(file.path)) {
            if (file.ext.toLowerCase() === '.doc' || file.ext.toLowerCase() === '.docx') {
                callback(null, new local.Document(file));
            } else if (file.ext.toLowerCase() === '.ppt' || file.ext.toLowerCase() === '.pptx') {
                callback(null, new local.Presentation(file));
            } else if (file.ext.toLowerCase() === '.xls' || file.ext.toLowerCase() === '.xlsx') {
                callback(null, new local.Spreadsheet(file));
            } else {
                callback(new Error("Unknown extension: '" + file.ext + "'. Supported extensions: ppt, pptx, doc, docx [, xls, xlsx not yet]"));
            }
        } else if (fs.existsSync(file.dir)) {
            callback(new Error("File '" + file.base + "' does not exists"));
        } else {
            callback(new Error("Directory '" + file.dir + "' does not exists"));
        }
    }

    read(file, callback) {
        file.type = file.type.toLowerCase();

        const url = new URL(file.url);

        if (url.protocol === 'http:' || url.protocol === 'https:') {
            const protocol = (url.protocol === 'https:') ? https : http;

            protocol.get(url.href, (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    if (file.type === 'document') {
                        callback(null, new remote.Document(data));
                    } else if (file.type === 'presentation') {
                        callback(null, new remote.Presentation(data));
                    } else if (file.type === 'spreadsheet') {
                        callback(null, new remote.Spreadsheet(data));
                    } else {
                        callback(new Error("Unknown file type: '" + file.type + "'. Supported file types: document, presentation [, spreadsheet not yet]"))
                    }
                });
            }).on('error', (err) => {
                callback(err);
            });
        } else {
            callback(new Error("Unknown protocol: '" + url.protocol + "'. Supported protocols: http, https"));
        }
    }

    parse(file, callback) {
        file.type = file.type.toLowerCase();

        if (!file.type || !file.content) return callback(new Error((!file.type) ? "Undefined file type" : "Undefined file content"));

        if (file.type === 'document') {
            callback(null, new content.Document(file.content));
        } else if (file.type === 'presentation') {
            callback(null, new content.Presentation(file.content));
        } else if (file.type === 'spreadsheet') {
            callback(null, new content.Spreadsheet(file.content));
        } else {
            callback(new Error("Unknown file type: '" + file.type + "'. Supported file types: document, presentation [, spreadsheet not yet]"))
        }
    }
}


module.exports = new MicrosoftOffice();
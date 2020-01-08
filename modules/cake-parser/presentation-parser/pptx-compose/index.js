/**
 * @module pptx-compose
 * @fileoverview Composes Open Office XML pptx buffer to JSON and ecoding XML
 *
 * @author Shobhit Sharma <hi@shobh.it>
 */

'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var assert = require('assert');
var async = require('async');
var JSZip = require('jszip');
var xml2js = require('xml2js');

/**
 * @class Parser
 *
 * @param options
 * @returns {Parser}
 * @constructor
 */
function Parser(options) {
    this.options = options || {};
    return this;
}

/**
 * @method execute
 *
 * @param {Array} files
 * @param {Function} callback
 */
Parser.prototype.execute = function execute(files, callback) {
    assert.ok(files instanceof Array, "argument 'files' must be an array");
    assert.equal(typeof callback, 'function', "argument 'callback' must be a function");

    async.map(files, this.parse, function(err, results) {
        if (err) return callback(err);

        this.bufferize(results, callback);
    }.bind(this));
};

/**
 * @method parse
 *
 * @param {string} file
 * @param {Function} callback
 */
Parser.prototype.parse = function parse(file, callback) {
    assert.equal(typeof file, 'string', "argument 'file' must be a string");
    assert.equal(typeof callback, 'function', "argument 'callback' must be a function");

    fs.readFile(file, function(err, data) {
        if (err) return callback(err);

        var content = {};

        JSZip()
            .loadAsync(data)
            .then(function(zip) {
                async.each(Object.keys(zip.files), function(key, cb) {
                    var ext = key.substr(key.lastIndexOf('.'));
                    if (ext === '.xml' || ext === '.rels') {
                        zip.file(key).async('string')
                            .then(function(xml) {
                                xml2js.parseString(xml, function(err, json) {
                                    if (err) return cb(err);

                                    content[key] = json;
                                    cb(null);
                                });
                            });
                    } else {
                        content[key] = zip.file(key).async('string');
                        cb(null);
                    }
                }, function(err) {
                    if (err) return callback(err);

                    callback(null, content);
                });
            });
    });
};

Parser.prototype.parseText = function parseText(buffer, callback) {
    assert.equal(typeof buffer, 'object', "argument 'buffer' must be a object");
    assert.equal(typeof callback, 'function', "argument 'callback' must be a function");

    var data = Buffer.from(buffer);

    var content = {};

    JSZip()
        .loadAsync(data)
        .then(function(zip) {
            async.each(Object.keys(zip.files), function(key, cb) {
                var ext = key.substr(key.lastIndexOf('.'));
                if (ext === '.xml' || ext === '.rels') {
                    zip.file(key).async('string')
                        .then(function(xml) {
                            xml2js.parseString(xml, function(err, json) {
                                if (err) {
                                    return cb(err);
                                }
                                content[key] = json;
                                cb(null);
                            });
                        });
                } else {
                    content[key] = zip.file(key).async('string');
                    cb(null);
                }
            }, function(err) {
                if (err) return callback(err);

                callback(null, content);
            });
        });
};

/**
 * @method bufferize
 *
 * Converts parsed data into buffer or file
 *
 * @param {Array} xmls
 * @param {Function} callback
 */
Parser.prototype.bufferize = function bufferize(content, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    options = options || {};

    assert.ok(typeof content, 'object', "argument 'content' must be an array");
    assert.equal(typeof options, 'object', "argument 'options' must be an object");

    var zip = new JSZip();
    var output = path.join(os.tmpdir(), uuid() + '.pptx');

    Object.keys(content).forEach(function(content) {
        for (var key in content) {
            if (content.hasOwnProperty(key)) {
                var ext = key.substr(key.lastIndexOf('.'));
                if (ext === '.xml' || ext === '.rels') {
                    var builder = new xml2js.Builder({
                        renderOpts: {
                            pretty: false
                        }
                    });
                    var xml2 = (builder.buildObject(content[key]));
                    zip.file(key, xml2);
                } else {
                    zip.file(key, content[key]);
                }
            }
        }
    });

    zip.generateAsync({
        type: 'nodebuffer'
    }).then(function(content) {
        if (options.file) {
            return fs.writeFile(output, content, function(err) {
                if (err) return callback(err);

                callback(null, output);
            });
        }

        callback(null, content);
    });
};

/**
 * @method toJSON
 *
 * Converts pptx contents to JSON
 *
 * @param {Array} file
 * @param {options} options
 * @param {Function} callback
 */
Parser.prototype.toJSON = function toJSON(file, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    options = options || {};

    assert.equal(typeof file, 'string', "argument 'file' must be a string");
    var output_dir = path.join(__dirname, 'output');
    var output = options.output || path.join(output_dir, uuid() + '.json');

    if (!fs.existsSync(output_dir)) {
        fs.mkdirSync(output_dir);
    }

    this.parse(file, function(err, json) {
        if (err) return callback(err);

        fs.writeFile(output, JSON.stringify(json, null, 2), {
            encoding: 'utf8',
            flag: 'wx'
        }, function(err) {
            if (err) return callback(err);

            callback(null, output);
        });
    });
};

/**
 * @func uuid
 *
 * Generates a random unique ID
 *
 * @returns {string}
 */
function uuid() {
    var primary = (Math.random() * 46656) | 0;
    var secondary = (Math.random() * 46656) | 0;
    primary = ('000' + primary.toString(36)).slice(-3);
    secondary = ('000' + secondary.toString(36)).slice(-3);
    return primary + secondary;
}

module.exports = Parser;
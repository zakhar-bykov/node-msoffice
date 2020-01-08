const PresentationParser = require('./../../cake-parser/presentation-parser');
const Slide = require('./slide');

class Presentation {
    constructor() {
        this.parser = new PresentationParser();
        this.Slide = Slide;
    }


    getSlides(err, json, callback) {
        var slides = [];

        var jsonString = JSON.stringify(json, null, 2);
        var numOfSlides = jsonString.match(/\"ppt\/slides\/slide/g).length;

        for (let slideId = 0; slideId < numOfSlides; slideId++) {
            slides.push(new Slide(slideId, json));
        }

        callback(err, slides);
    }
}

module.exports = Presentation;
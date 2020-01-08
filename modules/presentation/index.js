const PresentationParser = require('./../presentation-parser');


class Presentation {
    constructor(file) {
        this.parser = new PresentationParser();
        this.file = file;
        this.json = '';

        this.init();
    }


    init() {
        this.parser.parse(this.file.path, (err, json) => {
            if (err) throw err;

            this.json = json;
            console.log(1);
        });
    }

    getSlides() {
        var slides = [];

        // var jsonString = JSON.stringify(this.json, null, 2);
        // var numOfSlides = jsonString.match(/\"ppt\/slides\/slide/g).length;

        // for (let slideId = 0; slideId < numOfSlides; slideId++) {
        // slides.push(new Slide(slideId, this.json));
        // }

        return this.json;
    }

    getJSON() {
        console.log(5);
        return JSON.stringify(this.json);
    }
}


module.exports = Presentation;
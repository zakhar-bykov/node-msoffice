const Presentation = require('./../../class/presentation/presentation');

class ContentPresentation extends Presentation {
    constructor(content) {
        super();
        this.content = content;
    }


    getSlides(callback) {
        if (this.content.type === 'buffer') {
            this.parser.parseText(this.content.buffer, (err, json) => {
                super.getSlides(err, json, callback);
            });
        } else if (this.content.type === 'json') {
            var json = this.content.json;

            super.getSlides(null, json, callback);
        }
    }
}


module.exports = ContentPresentation;
class Slide {
    constructor(slideId, json) {
        this.id = slideId;
        this.number = slideId + 1;
        this.text = [];

        var presentation = JSON.parse(JSON.stringify(json, null, 2));
        var textElements = presentation['ppt/slides/slide' + (slideId + 1) + '.xml']['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp'][0]['p:txBody'][0]['a:p'][0]['a:r'];

        textElements.forEach(element => {
            this.text.push(element['a:t']);
        });

        // console.log(json['ppt/slides/slide' + (slideId + 1) + '.xml']);
    }

    getText() {
        return this.text;
    }
}

module.exports = Slide;
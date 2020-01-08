class Slide {
    constructor(slideId, json) {
        this.id = slideId;
        this.number = slideId + 1;
        this.text = [];

        var presentation = JSON.parse(JSON.stringify(json, null, 2));
        var textElements = presentation['ppt/slides/slide' + (slideId + 1) + '.xml']['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp'][0]['p:txBody'][0]['a:p'][0]['a:r'];

        textElements.forEach(element => {
            this.text.push({
                value: element['a:t'],
                mistake: (element['a:rPr'][0]['$']['err']) ? true : false,
                style: {
                    bold: (element['a:rPr'][0]['$']['b']) ? true : false,
                    italic: (element['a:rPr'][0]['$']['i']) ? true : false,
                    underline: (element['a:rPr'][0]['$']['u']) ? true : false,
                    strike: (element['a:rPr'][0]['$']['strike']) ? true : false,
                    fill: (element['a:rPr'][0]['a:solidFill']) ? '#' + element['a:rPr'][0]['a:solidFill'][0]['a:srgbClr'][0]['$']['val'] : '#000000'
                }
            });
        });
    }

    getText() {
        return this.text;
    }
}

module.exports = Slide;
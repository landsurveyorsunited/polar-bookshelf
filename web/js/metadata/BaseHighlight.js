const {SerializedObject} = require("./SerializedObject.js");
const {Preconditions} = require("../Preconditions");
const {AnnotationWithNote} = require("./AnnotationWithNote");

module.exports.BaseHighlight = class extends AnnotationWithNote {

    constructor(val) {
        super(val);

        /**
         * The rectangles where we need to place content for this highlights.
         *
         * @type {{}}
         */
        this.rects = {};

        /**
         * Optional thumbnail for this highlight.
         * @type {null}
         */
        this.thumbnail = null;

    }

    validate() {
        super.validate();

        Preconditions.assertNotNull(this.rects, "rects");
        Preconditions.assertNotInstanceOf(this.rects, "rects", Array);
    };

};

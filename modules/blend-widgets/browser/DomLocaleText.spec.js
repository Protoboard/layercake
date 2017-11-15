"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("DomLocaleText", function () {
    var DomLocaleText,
        domLocaleText;

    beforeAll(function () {
      DomLocaleText = $oop.getClass('test.$widgets.DomLocaleText.DomLocaleText')
      .blend($widgets.LocaleText)
      .blend($widgets.HtmlText)
      .blend($widgets.DomLocaleText);
      DomLocaleText.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("syncToActiveLocale()", function () {
      beforeEach(function () {
        domLocaleText = DomLocaleText.create({
          textString: "Hello World".toTranslatable()
        });
        spyOn(domLocaleText, 'reRenderContents');
      });

      it("should invoke reRenderContents()", function () {
        domLocaleText.syncToActiveLocale();
        expect(domLocaleText.reRenderContents).toHaveBeenCalled();
      });
    });
  });
});
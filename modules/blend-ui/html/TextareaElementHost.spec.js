"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("TextareaElementHost", function () {
    var TextareaElementHost,
        inputElementHost;

    beforeAll(function () {
      TextareaElementHost = $oop.getClass('test.$ui.TextareaElementHost.TextareaElementHost')
      .blend($widget.Widget)
      .blend($ui.Inputable)
      .blend($ui.TextareaElementHost);
      TextareaElementHost.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize elementName", function () {
        inputElementHost = TextareaElementHost.create();
        expect(inputElementHost.elementName).toBe('textarea');
      });
    });
  });
});

"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("OtherInputTypeHost", function () {
    var OtherInputTypeHost,
        otherInputTypeHost;

    beforeAll(function () {
      OtherInputTypeHost = $oop.createClass('test.$ui.OtherInputTypeHost.OtherInputTypeHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.OtherInputTypeHost)
      .build();
      OtherInputTypeHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".create()", function () {
      it("should initialize 'value' attribute", function () {
        otherInputTypeHost = OtherInputTypeHost.create({
          inputValue: 'foo'
        });
        expect(otherInputTypeHost.getAttribute('value')).toBe('foo');
      });
    });

    describe("#setInputValue()", function () {
      beforeEach(function () {
        otherInputTypeHost = OtherInputTypeHost.create();
      });

      it("should return self", function () {
        var result = otherInputTypeHost.setInputValue('foo');
        expect(result).toBe(otherInputTypeHost);
      });

      it("should add 'value' attribute", function () {
        otherInputTypeHost.setInputValue('foo');
        expect(otherInputTypeHost.getAttribute('value')).toBe('foo');
      });
    });
  });
});

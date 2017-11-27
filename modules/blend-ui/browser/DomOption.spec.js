"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("DomOption", function () {
    var DomOption,
        domOption;

    beforeAll(function () {
      DomOption = $oop.getClass('test.$ui.DomOption.DomOption')
      .blend($widget.Widget)
      .blend($ui.Option)
      .blend($ui.DomOption);
      DomOption.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("select()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('option');
        domOption = DomOption.create();
        spyOn(domOption, 'getElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domOption.select();
        expect(result).toBe(domOption);
      });

      it("should sync element's 'selected' property", function () {
        domOption.select();
        expect(element.selected).toBeTruthy();
      });
    });

    describe("deselect()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('option');
        domOption = DomOption.create();
        spyOn(domOption, 'getElement').and.returnValue(element);
        domOption.select();
      });

      it("should return self", function () {
        var result = domOption.deselect();
        expect(result).toBe(domOption);
      });

      it("should sync element's 'selected' property", function () {
        domOption.deselect();
        expect(element.selected).toBeFalsy();
      });
    });

    describe("onElementInput()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('option');
        domOption = DomOption.create();
        spyOn(domOption, 'getElement').and.returnValue(element);
        element.selected = true;
        domOption.onRender();
      });

      it("should sync to element's 'selected' property", function () {
        element.dispatchEvent(new Event('input'));
        expect(domOption.isSelected()).toBeTruthy();
      });
    });

    describe("onElementChange()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('option');
        domOption = DomOption.create();
        spyOn(domOption, 'getElement').and.returnValue(element);
        element.selected = false;
        domOption.onRender();
      });

      it("should sync to element's 'selected' property", function () {
        element.dispatchEvent(new Event('change'));
        expect(domOption.isSelected()).toBeFalsy();
      });
    });
  });

  describe("HtmlOption", function () {
    var HtmlOption,
        htmlOption;

    beforeAll(function () {
      HtmlOption = $oop.getClass('test.$ui.DomOption.HtmlOption')
      .blend($widget.Widget)
      .blend($ui.Option)
      .blend($ui.HtmlOption);
    });

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return DomOption instance", function () {
          htmlOption = HtmlOption.create();
          expect($ui.DomOption.mixedBy(htmlOption))
          .toBeTruthy();
        });
      });
    });
  });
});
"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("HtmlStateful", function () {
    var HtmlStateful,
        htmlStateful;

    beforeAll(function () {
      HtmlStateful = $oop.createClass('test.$widget.HtmlStateful.HtmlStateful')
      .blend($widget.Node)
      .blend($widget.HtmlStateful)
      .build();
      HtmlStateful.__builder.forwards = {list: [], lookup: {}};
    });

    describe("#setStateValue()", function () {
      beforeEach(function () {
        htmlStateful = HtmlStateful.create();
      });

      it("should return self", function () {
        var result = htmlStateful.setStateValue('foo', 'bar');
        expect(result).toBe(htmlStateful);
      });

      describe("when going from undefined to true", function () {
        it("should add binary CSS class", function () {
          htmlStateful.setStateValue('foo', true);
          expect(htmlStateful.cssClasses.data).toEqual({
            foo: 1
          });
        });
      });

      describe("when going from true to falsy", function () {
        beforeEach(function () {
          htmlStateful.setStateValue('foo', true);
        });

        it("should remove binary CSS class", function () {
          htmlStateful.setStateValue('foo', false);
          expect(htmlStateful.cssClasses.data).toEqual({});
        });
      });

      describe("when going between non-boolean defined values", function () {
        beforeEach(function () {
          htmlStateful.setStateValue('foo', 'bar');
        });

        it("should remove old and add new CSS class", function () {
          htmlStateful.setStateValue('foo', 'baz');
          expect(htmlStateful.cssClasses.data).toEqual({
            'foo-baz': 1
          });
        });
      });

      describe("when going from non-boolean to undefined", function () {
        beforeEach(function () {
          htmlStateful.setStateValue('foo', 'bar');
        });

        it("should remove CSS class", function () {
          htmlStateful.setStateValue('foo', undefined);
          expect(htmlStateful.cssClasses.data).toEqual({});
        });
      });

      describe("when going from undefined to undefined", function () {
        it("should not add CSS class", function () {
          htmlStateful.setStateValue('foo', undefined);
          expect(htmlStateful.cssClasses.data).toEqual({});
        });
      });

      describe("when passing same value", function () {
        beforeEach(function () {
          htmlStateful.setStateValue('foo', true);
        });

        it("should not change CSS classes", function () {
          htmlStateful.setStateValue('foo', true);
          expect(htmlStateful.cssClasses.data).toEqual({
            'foo': 1
          });
        });
      });
    });
  });

  describe("Stateful", function () {
    var Stateful,
        stateful;

    beforeAll(function () {
      Stateful = $oop.createClass('test.$widget.HtmlStateful.Stateful')
      .blend($widget.Node)
      .blend($widget.Stateful)
      .build();
    });

    describe(".create()", function () {
      describe("in HTML environment", function () {
        it("should return HtmlStateful instance", function () {
          stateful = Stateful.create();
          expect($widget.HtmlStateful.mixedBy(stateful)).toBeTruthy();
        });
      });
    });
  });
});

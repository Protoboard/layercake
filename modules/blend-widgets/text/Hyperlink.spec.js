"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("Hyperlink", function () {
    var Hyperlink,
        hyperlink;

    beforeAll(function () {
      Hyperlink = $oop.getClass('test.$widgets.Hyperlink.Hyperlink')
      .blend($widgets.Hyperlink);
      Hyperlink.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("setTargetUrl()", function () {
      beforeEach(function () {
        hyperlink = Hyperlink.create();
      });

      it("should return self", function () {
        var result = hyperlink.setTargetUrl();
        expect(result).toBe(hyperlink);
      });

      it("should set targetUrl", function () {
        hyperlink.setTargetUrl('http://foo.com');
        expect(hyperlink.targetUrl).toBe('http://foo.com');
      });

      it("should save before state", function () {
        hyperlink.setTargetUrl('http://foo.com');
        expect(hyperlink.setTargetUrl.shared.targetUrlBefore)
        .toBeUndefined();
      });
    });
  });
});

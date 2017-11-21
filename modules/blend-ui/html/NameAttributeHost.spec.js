"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("NameAttributeHost", function () {
    var NameAttributeHost,
        nameAttributeHost;

    beforeAll(function () {
      NameAttributeHost = $oop.getClass('test.$ui.NameAttributeHost.NameAttributeHost')
      .blend($ui.Button)
      .blend($ui.NameAttributeHost);
      NameAttributeHost.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize 'name' attribute", function () {
        nameAttributeHost = NameAttributeHost.create({
          nodeName: 'foo'
        });
        expect(nameAttributeHost.getAttribute('name')).toBe('foo');
      });
    });

    describe("setNodeName()", function () {
      beforeEach(function () {
        nameAttributeHost = NameAttributeHost.create();
      });

      it("should return self", function () {
        var result = nameAttributeHost.setNodeName('foo');
        expect(result).toBe(nameAttributeHost);
      });

      it("should set 'name' attribute", function () {
        nameAttributeHost.setNodeName('foo');
        expect(nameAttributeHost.getAttribute('name')).toBe('foo');
      });
    });
  });
});
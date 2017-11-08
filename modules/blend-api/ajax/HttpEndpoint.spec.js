"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("HttpEndpoint", function () {
    var HttpEndpoint,
        ajaxEndpoint;

    beforeAll(function () {
      HttpEndpoint = $oop.getClass('test.$api.HttpEndpoint.HttpEndpoint')
      .blend($api.HttpEndpoint);
      HttpEndpoint.__forwards = {list: [], sources: [], lookup: {}};
      HttpEndpoint.__instanceLookup = {};
    });

    it("should be cached by components", function () {
      expect(HttpEndpoint.fromComponents(['foo', 'bar']))
      .toBe(HttpEndpoint.fromComponents(['foo', 'bar']));
      expect(HttpEndpoint.fromComponents(['foo', 'bar']))
      .not.toBe(HttpEndpoint.fromComponents(['foo', 'baz']));
    });

    describe("create", function () {
      it("should initialize endpointId", function () {
        ajaxEndpoint = HttpEndpoint.fromComponents(['foo', 'bar']);
        expect(ajaxEndpoint.endpointId).toBe('foo.bar');
      });

      it("should initialize components", function () {
        ajaxEndpoint = HttpEndpoint.fromEndpointId('foo.bar');
        expect(ajaxEndpoint.components).toEqual(['foo', 'bar']);
      });
    });
  });
});

describe("$data", function () {
  describe("Path", function () {
    describe("toAjaxEndpoint()", function () {
      var path,
          ajaxEndpoint;

      beforeEach(function () {
        $api.HttpEndpoint.__instanceLookup = {};
        path = 'foo.bar.baz'.toPath();
      });

      it("should return a HttpEndpoint instance", function () {
        ajaxEndpoint = path.toAjaxEndpoint();
        expect($api.HttpEndpoint.mixedBy(ajaxEndpoint)).toBeTruthy();
      });

      it("should set components", function () {
        ajaxEndpoint = path.toAjaxEndpoint();
        expect(ajaxEndpoint.components).toBe(path.components);
      });
    });
  });
});

describe("String", function () {
  describe("toAjaxEndpoint()", function () {
    var ajaxEndpoint;

    it("should return a HttpEndpoint instance", function () {
      ajaxEndpoint = 'foo.bar.baz'.toAjaxEndpoint();
      expect($api.HttpEndpoint.mixedBy(ajaxEndpoint)).toBeTruthy();
    });

    it("should set components property", function () {
      ajaxEndpoint = 'foo.bar.baz'.toAjaxEndpoint();
      expect(ajaxEndpoint.components).toEqual([
        'foo', 'bar', 'baz'
      ]);
    });
  });
});

describe("Array", function () {
  describe("toAjaxEndpoint()", function () {
    var ajaxEndpoint,
        array = ['1', '2', '3'];

    it("should return a HttpEndpoint instance", function () {
      ajaxEndpoint = array.toAjaxEndpoint();
      expect($api.HttpEndpoint.mixedBy(ajaxEndpoint)).toBeTruthy();
    });

    it("should set components property", function () {
      ajaxEndpoint = array.toAjaxEndpoint();
      expect(ajaxEndpoint.components).toBe(array);
    });
  });
});
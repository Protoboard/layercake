"use strict";

var $oop = window['blend-oop'],
    $router = window['blend-router'];

describe("$router", function () {
  describe("Route", function () {
    var Route,
        route;

    beforeAll(function () {
      Route = $oop.getClass('test.$router.Route.Route')
      .blend($router.Route);
      Route.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromString()", function () {
      it("should return Route instance", function () {
        route = Route.fromString('foo/bar/baz');
        expect(Route.mixedBy(route)).toBeTruthy();
      });

      it("should set Path components", function () {
        route = Route.fromString('foo/bar/baz');
        expect(route.components).toEqual(['foo', 'bar', 'baz']);
      });

      describe("when URL has encoded characters", function () {
        it("should decode encoded characters", function () {
          route = Route.fromString('foo%2F/bar/baz');
          expect(route.components).toEqual(['foo/', 'bar', 'baz']);
        });
      });
    });

    describe("create()", function () {
      it("should initialize listeningPath", function () {
        route = Route.create({components: ['foo', 'bar', 'baz']});
        expect(route.listeningPath).toBe('route.foo.bar.baz');
      });

      it("should initialize triggerPaths", function () {
        route = Route.create({components: ['foo', 'bar', 'baz']});
        expect(route.triggerPaths.list).toContain(
            'route.foo.bar.baz',
            'route');
      });
    });

    describe("navigateTo()", function () {
      var router;

      beforeEach(function () {
        route = Route.fromComponents(['foo/', 'bar', 'baz']);
        router = $router.Router.create();
        spyOn(router, 'navigateToRoute');
      });

      it("should return self", function () {
        var result = route.navigateTo();
        expect(result).toBe(route);
      });

      it("should invoke Router#navigateToRoute", function () {
        route.navigateTo();
        expect(router.navigateToRoute).toHaveBeenCalledWith(route);
      });
    });

    describe("navigateToDebounced()", function () {
      var router,
          promise;

      beforeEach(function () {
        route = Route.fromComponents(['foo/', 'bar', 'baz']);
        router = $router.Router.create();
        promise = {};
        spyOn(router, 'navigateToRouteDebounced').and.returnValue(promise);
      });

      it("should invoke Router#navigateToRouteDebounced", function () {
        route.navigateToDebounced();
        expect(router.navigateToRouteDebounced).toHaveBeenCalledWith(route);
      });

      it("should return Promise", function () {
        var result = route.navigateToDebounced();
        expect(result).toBe(promise);
      });
    });

    describe("toString()", function () {
      beforeEach(function () {
        route = Route.create({components: ['foo/', 'bar', 'baz']});
      });

      it("should escape URI component strings", function () {
        var result = route.toString();
        expect(result).toBe('foo%2F/bar/baz');
      });
    });
  });
});

describe("String", function () {
  describe("toRoute()", function () {
    var route;

    beforeEach(function () {
      route = $router.Route.fromString('foo/bar/baz');
      spyOn($router.Route, 'create').and.returnValue(route);
    });

    it("should create a Route instance", function () {
      'foo/bar/baz'.toRoute();
      expect($router.Route.create).toHaveBeenCalledWith({
        components: ['foo', 'bar', 'baz']
      });
    });

    it("should return created instance", function () {
      var result = 'foo/bar/baz'.toRoute();
      expect(result).toBe(route);
    });
  });
});

describe("Array", function () {
  describe("toRoute()", function () {
    var route;

    beforeEach(function () {
      route = $router.Route.fromString('foo/bar/baz');
      spyOn($router.Route, 'create').and.returnValue(route);
    });

    it("should create a Route instance", function () {
      ['foo', 'bar', 'baz'].toRoute();
      expect($router.Route.create).toHaveBeenCalledWith({
        components: ['foo', 'bar', 'baz']
      });
    });

    it("should return created instance", function () {
      var result = ['foo', 'bar', 'baz'].toRoute();
      expect(result).toBe(route);
    });
  });
});

"use strict";

var $assert = window['blend-assert'],
    $data = window['blend-data'];

describe("$data", function () {
  describe("ObjectContainer", function () {
    var data,
        ObjectContainer,
        objectContainer,
        result;

    beforeAll(function () {
      ObjectContainer = $oop.createClass('test.$data.ObjectContainer.ObjectContainer')
      .blend($data.DataContainer)
      .blend($data.ObjectContainer)
      .build();
    });

    beforeEach(function () {
      data = {};
      objectContainer = ObjectContainer.create({data: data});
    });

    describe(".create()", function () {
      it("should set data property", function () {
        expect(objectContainer.data).toBe(data);
      });

      describe("on missing arguments", function () {
        beforeEach(function () {
          objectContainer = ObjectContainer.create();
        });

        it("should set data property", function () {
          expect(objectContainer.data).toEqual({});
        });
      });

      describe("on invalid arguments", function () {
        it("should throw", function () {
          expect(function () {
            $data.ObjectContainer.create({data: "foo"});
          }).toThrow();
        });
      });
    });

    describe("#clear()", function () {
      beforeEach(function () {
        result = objectContainer.clear();
      });

      it("should return self", function () {
        expect(result).toBe(objectContainer);
      });

      it("should replace data with empty object", function () {
        expect(objectContainer.data).toEqual({});
      });
    });
  });
});

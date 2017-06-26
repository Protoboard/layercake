"use strict";

var $assert = window['giant-assert'],
    $data = window['giant-data'];

describe("$data", function () {
  describe("ArrayContainer", function () {
    var data,
        ArrayContainer,
        arrayContainer,
        result;

    beforeEach(function () {
      data = [];
      ArrayContainer = $oop.getClass('test.$data.ArrayContainer.ArrayContainer')
      .extend($data.DataContainer)
      .extend($data.ArrayContainer);
      arrayContainer = ArrayContainer.create(data);
    });

    describe("create()", function () {
      it("should set data property", function () {
        expect(arrayContainer.data).toBe(data);
      });

      describe("on missing arguments", function () {
        beforeEach(function () {
          arrayContainer = ArrayContainer.create();
        });

        it("should set data property", function () {
          expect(arrayContainer.data).toEqual([]);
        });
      });

      describe("on invalid arguments", function () {
        it("should throw", function () {
          expect(function () {
            $data.ArrayContainer.create({});
          }).toThrow();
        });
      });
    });

    describe("destroy()", function () {
      beforeEach(function () {
        spyOn(arrayContainer, 'clear');
        result = arrayContainer.destroy();
      });

      it("should return self", function () {
        expect(result).toBe(arrayContainer);
      });

      it("should clear data", function () {
        expect(arrayContainer.clear).toHaveBeenCalled();
      });
    });

    describe("clear()", function () {
      beforeEach(function () {
        result = arrayContainer.clear();
      });

      it("should return self", function () {
        expect(result).toBe(arrayContainer);
      });

      it("should replace data with empty object", function () {
        expect(arrayContainer.data).toEqual([]);
      });
    });
  });
});

"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  var indexEntry,
      index,
      result;

  beforeEach(function () {
    indexEntry = {
      list: [],
      lookup: {}
    };
    index = {
      foo: indexEntry
    };
  });

  describe("getSafeIndexEntry()", function () {
    it("should retrieve specified indexEntry", function () {
      result = $oop.getSafeIndexEntry(index, 'foo');
      expect(result).toBe(indexEntry);
    });

    describe("on absent key", function () {
      it("should store new entry in index", function () {
        result = $oop.getSafeIndexEntry(index, 'bar');
        expect(result).toEqual({
          list: [],
          lookup: {}
        });
        expect(index.bar).toEqual({
          list: [],
          lookup: {}
        });
      });
    });
  });
});
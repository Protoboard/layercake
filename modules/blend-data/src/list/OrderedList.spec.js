"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'];

describe("$data", function () {
  var data,
      OrderedList,
      orderedList,
      result;

  describe("OrderedList", function () {
    var compare;

    beforeAll(function () {
      OrderedList = $oop.createClass("test.$data.OrderedList.OrderedList")
      .blend($data.OrderedList)
      .build();
    });

    beforeEach(function () {
      data = ['bar', 'foo'];
      compare = function (a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      };
      orderedList = OrderedList.create({data: data, compare: compare});
    });

    describe(".create()", function () {
      it("should set data buffer", function () {
        expect(orderedList.data).toBe(data);
      });

      it("should set compare", function () {
        expect(orderedList.compare).toBe(compare);
      });

      describe("on missing arguments", function () {
        beforeEach(function () {
          orderedList = OrderedList.create();
        });

        it("should set default properties", function () {
          expect(orderedList.data).toEqual([]);
          expect(orderedList.compare)
          .toBe(orderedList._comparePrimitives);
        });
      });

      describe("on invalid arguments", function () {
        it("should throw", function () {
          expect(function () {
            OrderedList.create({data: 'foo'});
          }).toThrow();
          expect(function () {
            OrderedList.create({data: [], compare: 'foo'});
          }).toThrow();
        });
      });
    });

    describe("#clone()", function () {
      beforeEach(function () {
        result = orderedList.clone();
      });

      it("should set compare property", function () {
        expect(result.compare).toBe(orderedList.compare);
      });
    });

    describe("#setItem()", function () {
      beforeEach(function () {
        result = orderedList.setItem('baz');
      });

      it("should return self", function () {
        expect(result).toBe(orderedList);
      });

      it("should splice item into list", function () {
        expect(orderedList.data).toEqual([
          'bar', 'baz', 'foo'
        ]);
      });

      it("should update _itemCount", function () {
        expect(orderedList._itemCount).toBe(3);
      });

      describe("on lower-than-first item", function () {
        beforeEach(function () {
          result = orderedList.setItem('abc');
        });

        it("should splice item in at start", function () {
          expect(orderedList.data).toEqual([
            'abc', 'bar', 'baz', 'foo'
          ]);
        });
      });

      describe("on higher-than-last item", function () {
        beforeEach(function () {
          result = orderedList.setItem('quux');
        });

        it("should splice item in at end", function () {
          expect(orderedList.data).toEqual([
            'bar', 'baz', 'foo', 'quux'
          ]);
        });
      });

      describe("on duplicate", function () {
        beforeEach(function () {
          result = orderedList.setItem('baz');
        });

        it("should splice item into list", function () {
          expect(orderedList.data).toEqual([
            'bar', 'baz', 'baz', 'foo'
          ]);
        });
      });
    });

    describe("#deleteItem()", function () {
      beforeEach(function () {
        result = orderedList.deleteItem('bar');
      });

      it("should return self", function () {
        expect(result).toBe(orderedList);
      });

      it("should remove item from buffer", function () {
        expect(orderedList.data).toEqual([
          'foo'
        ]);
      });

      it("should update _itemCount", function () {
        expect(orderedList._itemCount).toBe(1);
      });

      describe("on absent item", function () {
        beforeEach(function () {
          result = orderedList.deleteItem('bar');
        });

        it("should not change buffer", function () {
          expect(orderedList.data).toEqual([
            'foo'
          ]);
        });

        it("should not change _itemCount", function () {
          expect(orderedList._itemCount).toBe(1);
        });
      });
    });

    describe("#hasItem()", function () {
      describe("for existing item", function () {
        it("should return true", function () {
          expect(orderedList.hasItem('foo')).toBeTruthy();
        });
      });
      describe("for absent item", function () {
        it("should return false", function () {
          expect(orderedList.hasItem('baz')).toBeFalsy();
        });
      });
    });

    describe("#forEachItem()", function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy();
        result = orderedList.forEachItem(callback);
      });

      it("should return self", function () {
        expect(result).toBe(orderedList);
      });

      it("should pass items to callback", function () {
        expect(callback.calls.allArgs()).toEqual([
          ['bar'],
          ['foo']
        ]);
      });

      describe("when interrupted", function () {
        beforeEach(function () {
          callback = jasmine.createSpy().and.returnValue(false);
          orderedList.forEachItem(callback);
        });

        it("should stop at interruption", function () {
          expect(callback).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("#indexOf()", function () {
      beforeEach(function () {
        data = [
          {order: 1},
          {order: 4},
          {order: 5},
          {order: 7},
          {order: 9},
          {order: 100}
        ];
        orderedList = OrderedList.create({
          data: data,
          compare: function (a, b) {
            var orderA = a && a.order,
                orderB = b && b.order;
            return orderA > orderB ? 1 :
                orderA < orderB ? -1 :
                    0;
          }
        });
      });

      describe("for present items", function () {
        it("should return index", function () {
          expect(orderedList.indexOf(data[0])).toBe(0);
          expect(orderedList.indexOf(data[1])).toBe(1);
          expect(orderedList.indexOf(data[2])).toBe(2);
          expect(orderedList.indexOf(data[3])).toBe(3);
          expect(orderedList.indexOf(data[4])).toBe(4);
          expect(orderedList.indexOf(data[5])).toBe(5);
        });
      });

      describe("for absent items", function () {
        it("should return -1", function () {
          expect(orderedList.indexOf({order: 0})).toBe(-1);
          expect(orderedList.indexOf({order: 2})).toBe(-1);
          expect(orderedList.indexOf({order: 20})).toBe(-1);
          expect(orderedList.indexOf({order: 200})).toBe(-1);
        });
      });
    });

    describe("#getRange()", function () {
      beforeEach(function () {
        orderedList
        .setItem('baz')
        .setItem('quux')
        .setItem('hello')
        .setItem('world')
        .setItem('lorem')
        .setItem('ipsum');

        result = orderedList.getRange('foo', 'lorem');
      });

      it("should return array", function () {
        expect(result instanceof Array).toBeTruthy();
      });

      it("should return specified range", function () {
        expect(result).toEqual([
          'foo', 'hello', 'ipsum'
        ]);
      });

      describe("on absent bounds", function () {
        it("should return included range", function () {
          expect(orderedList.getRange('far', 'lorus')).toEqual([
            'foo', 'hello', 'ipsum', 'lorem'
          ]);
        });
      });

      describe("on repeating items", function () {
        beforeEach(function () {
          orderedList.setItem('foo');
        });

        it("should return repeated items in range", function () {
          expect(orderedList.getRange('foo', 'foo_')).toEqual([
            'foo', 'foo'
          ]);
        });
      });

      describe("when offset & limit is specified", function () {
        it("should filter result by offset & limit", function () {
          expect(orderedList.getRange('bar', 'lorem', 2)).toEqual([
            'foo', 'hello', 'ipsum'
          ]);
          expect(orderedList.getRange('bar', 'lorem', 2, 2)).toEqual([
            'foo', 'hello'
          ]);
        });
      });
    });

    describe("#getRangeWrapped()", function () {
      var data;

      beforeEach(function () {
        data = [];
        spyOn(orderedList, 'getRange').and.returnValue(data);
        result = orderedList.getRangeWrapped('foo', 'bar', 10, 5);
      });

      it("should return instance of the current class", function () {
        expect(OrderedList.mixedBy(result)).toBeTruthy();
      });

      it("should invoke getRange() with same arguments", function () {
        expect(orderedList.getRange).toHaveBeenCalledWith(
            'foo', 'bar', 10, 5);
      });

      it("should wrap result of getRange()", function () {
        expect(result.data).toBe(data);
      });
    });
  });

  describe("DataContainer", function () {
    describe("#asOrderedList()", function () {
      var buffer = $data.DataContainer.create({data: [1, 2, 3]});

      beforeEach(function () {
        result = buffer.asOrderedList();
      });

      it("should return a OrderedList instance", function () {
        expect($data.OrderedList.mixedBy(result)).toBeTruthy();
      });

      it("should set data set", function () {
        expect(result.data).toBe(buffer.data);
      });
    });
  });

  describe("SetContainer", function () {
    describe("#toOrderedList()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.StringSet.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toOrderedList();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.OrderedList);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });

  describe("KeyValueContainer", function () {
    describe("#toOrderedList()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.OrderedList.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toOrderedList();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.OrderedList);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("#asOrderedList()", function () {
    var array = [1, 2, 3];

    beforeEach(function () {
      result = array.asOrderedList();
    });

    it("should return a OrderedList instance", function () {
      expect($data.OrderedList.mixedBy(result)).toBeTruthy();
    });

    it("should set data set", function () {
      expect(result.data).toBe(array);
    });
  });
});

"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("Item", function () {
    var Item,
        item;

    beforeEach(function () {
      Item = $oop.getClass('test.$entity.Item.Item')
      .mix($entity.Item);
      item = Item.fromEntityKey('foo/bar/baz/quux'.toItemKey());
    });

    describe("fromComponents()", function () {
      beforeEach(function () {
        item = Item.fromComponents('foo', 'bar', 'baz', 'quux');
      });

      it("should return Item instance", function () {
        expect(Item.mixedBy(item)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(item.entityKey.equals('foo/bar/baz/quux'.toItemKey()));
      });
    });

    describe("fromString()", function () {
      beforeEach(function () {
        item = Item.fromString('foo/bar/baz/quux');
      });

      it("should return Item instance", function () {
        expect(Item.mixedBy(item)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(item.entityKey.equals('foo/bar/baz/quux'.toItemKey()));
      });
    });

    describe("create()", function () {
      it("should initialize listeningPath", function () {
        expect(item.listeningPath)
        .toEqual('entity.document.foo.bar.baz.quux'.toPath());
      });

      it("should initialize triggerPaths", function () {
        expect(item.triggerPaths)
        .toEqual([
          'entity.document.foo.bar.baz.quux'.toPath(),
          'entity.document.__item.foo\/baz'.toPath()
        ]);
      });
    });
  });

  describe("ItemKey", function () {
    var itemKey,
        result;

    describe("toItem()", function () {
      beforeEach(function () {
        itemKey = 'foo/bar/baz/quux'.toItemKey();
        result = itemKey.toItem();
      });

      it("should return Item instance", function () {
        expect($entity.Item.mixedBy(result)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(result.entityKey).toBe(itemKey);
      });
    });
  });

  describe("Entity", function () {
    var entity;

    describe("create", function () {
      describe("when passing ItemKey", function () {
        beforeEach(function () {
          entity = $entity.Entity.fromEntityKey('foo/bar/baz/quux'.toItemKey());
        });

        it("should return Item instance", function () {
          expect($entity.Item.mixedBy(entity)).toBeTruthy();
        });
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toItem()", function () {
    var item;

    beforeEach(function () {
      item = $entity.Item.fromString('foo/bar/baz/quux');
      spyOn($entity.Item, 'create').and.returnValue(item);
      result = 'foo/bar/baz/quux'.toItem();
    });

    it("should create a Item instance", function () {
      expect($entity.Item.create).toHaveBeenCalledWith({
        entityKey: 'foo/bar/baz/quux'.toItemKey()
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(item);
    });
  });
});

describe("Array", function () {
  var result;

  describe("toItem()", function () {
    var components,
        item;

    beforeEach(function () {
      components = ['foo', 'bar', 'baz', 'quux'];
      item = $entity.Item.fromComponents('foo', 'bar', 'baz', 'quux');
      spyOn($entity.Item, 'create').and.returnValue(item);
      result = components.toItem();
    });

    it("should create a Item instance", function () {
      expect($entity.Item.create).toHaveBeenCalledWith({
        entityKey: 'foo/bar/baz/quux'.toItemKey()
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(item);
    });
  });
});
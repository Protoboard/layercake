"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $entity = window['blend-entity'];

describe("$assert", function () {
  var itemKey;

  beforeEach(function () {
    itemKey = $entity.ItemKey.fromComponents('foo', 'bar', 'baz');
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isItemKey()", function () {
    it("should pass message to assert", function () {
      $assert.isItemKey(itemKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-ItemKey", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isItemKey({});
        }).toThrow();
      });
    });
  });

  describe("isItemKeyOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isItemKeyOptional(itemKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-chain", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isItemKeyOptional({});
        }).toThrow();
      });
    });
  });
});

describe("$entity", function () {
  describe("ItemKey", function () {
    var ItemKey,
        itemKey,
        result;

    beforeAll(function () {
      ItemKey = $oop.getClass('test.$entity.ItemKey.ItemKey')
      .blend($entity.ItemKey);
    });

    beforeEach(function () {
      itemKey = ItemKey.create({
        fieldKey: 'foo/bar/baz'.toFieldKey(),
        itemId: 'quux'
      });
    });

    describe("fromComponents()", function () {
      beforeEach(function () {
        itemKey = ItemKey.fromComponents('foo', 'bar', 'baz', 'quux');
      });

      it("should return a ItemKey instance", function () {
        expect(ItemKey.mixedBy(itemKey)).toBeTruthy();
      });

      it("should set fieldKey & itemId properties", function () {
        expect(itemKey.fieldKey).toEqual('foo/bar/baz'.toFieldKey());
        expect(itemKey.itemId).toBe('quux');
      });
    });

    describe("fromString()", function () {
      beforeEach(function () {
        itemKey = ItemKey.fromString('foo/bar/baz/\\/quux');
      });

      it("should return a ItemKey instance", function () {
        expect(ItemKey.mixedBy(itemKey)).toBeTruthy();
      });

      it("should set fieldKey & itemId properties", function () {
        expect(itemKey.fieldKey).toEqual('foo/bar/baz'.toFieldKey());
        expect(itemKey.itemId).toBe('/quux');
      });
    });

    describe("create()", function () {
      describe("from _entityPath", function () {
        beforeEach(function () {
          itemKey = ItemKey.create({
            _entityPath: 'document.foo.bar.baz.quux'.toPath()
          });
        });

        it("should set fieldKey & itemId properties", function () {
          expect(itemKey.fieldKey).toEqual('foo/bar/baz'.toFieldKey());
          expect(itemKey.itemId).toBe('quux');
        });
      });

      describe("when documentType is static", function () {
        beforeEach(function () {
          itemKey = $entity.ItemKey.create({
            fieldKey: '__foo/bar/baz'.toFieldKey(),
            itemId: 'quux'
          });
        });

        it("should mix StringifyCached into instance", function () {
          expect($utils.StringifyCached.mixedBy(itemKey)).toBeTruthy();
        });
      });
    });

    describe("equals()", function () {
      describe("for matching keys", function () {
        it("should return true", function () {
          expect('foo/bar/baz/quux'.toItemKey()
          .equals('foo/bar/baz/quux'.toItemKey()))
          .toBe(true);
        });
      });

      describe("for non-matching keys", function () {
        it("should return false", function () {
          expect('foo/bar/baz/quux'.toItemKey()
          .equals('bar/baz/quux/foo'.toItemKey()))
          .toBe(false);
        });
      });
    });

    describe("getAttributeDocumentKey()", function () {
      beforeEach(function () {
        result = itemKey.getAttributeDocumentKey();
      });

      it("should return an AttributeDocumentKey", function () {
        expect($entity.AttributeDocumentKey.mixedBy(result)).toBeTruthy();
      });

      it("should return attribute document key to parent field", function () {
        expect(result.equals($entity.DocumentKey.fromString('__field/foo\\/baz')))
        .toBeTruthy();
      });
    });

    describe("getEntityPath()", function () {
      beforeEach(function () {
        result = itemKey.getEntityPath();
      });

      it("should return a Path", function () {
        expect($data.Path.mixedBy(result)).toBeTruthy();
      });

      it("should return entity path to the item", function () {
        expect(result.equals('document.foo.bar.baz.quux'.toPath()));
      });

      it("should set _entityPath property", function () {
        expect(itemKey._entityPath).toBe(result);
      });
    });

    describe("getIdType()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = $entity.AttributeDocumentKey.fromDocumentIdComponents(
            '__field', ['user', 'friends']).getFieldKey('itemIdType');
        $entity.entities.setNode(attributeKey.getEntityPath(), 'reference');
        result = 'user/1/friends/Joe'.toItemKey().getIdType();
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should retrieve itemIdType attribute of field", function () {
        expect(result).toBe('reference');
      });
    });

    describe("getValueType()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = $entity.AttributeDocumentKey.fromDocumentIdComponents(
            '__field', ['user', 'friends']).getFieldKey('itemValueType');
        $entity.entities.setNode(attributeKey.getEntityPath(), 'reference');
        result = 'user/1/friends/Joe'.toItemKey().getValueType();
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should retrieve itemValueType attribute of field", function () {
        expect(result).toBe('reference');
      });
    });

    describe("toString()", function () {
      it("should return string representation", function () {
        expect(itemKey.toString()).toBe('foo/bar/baz/quux');
      });

      it("should escape delimiters in components", function () {
        expect(['foo/', '/bar', 'ba/z', 'qu/ux'].toItemKey().toString())
        .toBe('foo\\//\\/bar/ba\\/z/qu\\/ux');
      });
    });
  });

  describe("EntityKey", function () {
    var result;

    describe("create()", function () {
      describe("when passing field entity path", function () {
        beforeEach(function () {
          result = $entity.EntityKey.create({
            _entityPath: 'document.foo.bar.baz.quux'.toPath()
          });
        });

        it("should return ItemKey instance", function () {
          expect($entity.ItemKey.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toItemKey()", function () {
    var itemKey;

    beforeEach(function () {
      itemKey = $entity.ItemKey.fromString('foo/bar/baz/quux');
      spyOn($entity.ItemKey, 'create').and.returnValue(itemKey);
      result = 'foo/bar/baz/quux'.toItemKey();
    });

    it("should create a ItemKey instance", function () {
      expect($entity.ItemKey.create).toHaveBeenCalledWith({
        fieldKey: 'foo/bar/baz'.toFieldKey(),
        itemId: 'quux'
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(itemKey);
    });
  });
});

describe("Array", function () {
  var result;

  describe("toItemKey()", function () {
    var components,
        fieldKey;

    beforeEach(function () {
      components = ['foo', 'bar', 'baz', 'quux'];
      fieldKey = $entity.ItemKey.fromComponents('foo', 'bar', 'baz', 'quux');
      spyOn($entity.ItemKey, 'create').and.returnValue(fieldKey);
      result = components.toItemKey();
    });

    it("should create a ItemKey instance", function () {
      expect($entity.ItemKey.create).toHaveBeenCalledWith({
        fieldKey: 'foo/bar/baz'.toFieldKey(),
        itemId: 'quux'
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(fieldKey);
    });
  });
});
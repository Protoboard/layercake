"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("CollectionField", function () {
    var CollectionField,
        collectionFieldKey,
        collectionField,
        result;

    beforeAll(function () {
      CollectionField = $oop.createClass('test.$entity.CollectionField.CollectionField')
      .blend($entity.CollectionField)
      .build();
      CollectionField.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      collectionFieldKey = $entity.CollectionFieldKey.fromReference('foo/bar/baz');
      collectionField = CollectionField.fromEntityKey(collectionFieldKey);
    });

    describe(".create()", function () {
      it("should initialize triggerPaths", function () {
        expect(collectionField.triggerPaths.list).toContain(
            'entity.document.__field.__field/itemIdType.options.string',
            'entity.document.__field.__field/itemValueType.options.string');
      });
    });

    describe("#spawnEntityChangeEvents()", function () {
      var nodeBefore,
          nodeAfter;

      beforeEach(function () {
        nodeBefore = {
          0: 1,
          1: 1,
          2: 1,
          3: 1
        };
        nodeAfter = {
          2: 2,
          3: 1,
          4: 1,
          5: 1
        };

        result = collectionField
        .spawnEntityChangeEvents(nodeBefore, nodeAfter);
      });

      it("should spawn events", function () {
        expect(result).toEqual([
          CollectionField.fromEntityKey(collectionFieldKey)
          .spawnEvent({
            eventName: $entity.EVENT_ENTITY_CHANGE,
            propertiesAdded: ['4', '5'],
            propertiesRemoved: ['0', '1']
          }),
          'foo/bar/baz/2'.toItem().spawnEvent({
            eventName: $entity.EVENT_ENTITY_CHANGE,
            nodeBefore: 1,
            nodeAfter: 2
          })
        ]);
      });
    });

    describe("#getItem()", function () {
      var item;

      it("should return an Item instance", function () {
        var result = collectionField.getItem('quux');
        expect($entity.Item.mixedBy(result)).toBeTruthy();
      });

      it("should set item components", function () {
        item = $entity.Item.fromEntityKey('foo/bar/baz/quux'.toItemKey());
        var result = collectionField.getItem('quux');
        expect(result.equals(item)).toBeTruthy();
      });
    });
  });

  describe("Field", function () {
    var result;

    describe(".create()", function () {
      describe("when entityKey is CollectionFieldKey", function () {
        beforeEach(function () {
          result = $entity.CollectionFieldKey.fromReference('foo/bar/baz')
          .toField();
        });

        it("should return CollectionField instance", function () {
          expect($entity.CollectionField.mixedBy(result))
          .toBeTruthy();
        });
      });
    });
  });
});

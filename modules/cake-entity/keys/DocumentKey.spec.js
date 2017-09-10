"use strict";

var $assert = window['cake-assert'],
    $oop = window['cake-oop'],
    $data = window['cake-data'],
    $entity = window['cake-entity'];

describe("$assert", function () {
  var documentKey;

  beforeEach(function () {
    documentKey = $entity.DocumentKey.fromComponents('foo', 'bar');
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isDocumentKey()", function () {
    it("should pass message to assert", function () {
      $assert.isDocumentKey(documentKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-DocumentKey", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isDocumentKey({});
        }).toThrow();
      });
    });
  });

  describe("isDocumentKeyOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isDocumentKeyOptional(documentKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-DocumentKey", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isDocumentKeyOptional({});
        }).toThrow();
      });
    });
  });
});

describe("$entity", function () {
  describe("DocumentKey", function () {
    var DocumentKey,
        documentKey,
        result;

    beforeEach(function () {
      DocumentKey = $oop.getClass('test.$entity.DocumentKey.DocumentKey')
      .mix($entity.DocumentKey);
      documentKey = DocumentKey.create({
        documentType: 'foo',
        documentId: 'bar'
      });
    });

    describe("fromComponents()", function () {
      beforeEach(function () {
        documentKey = DocumentKey.fromComponents('foo', 'bar');
      });

      it("should return a DocumentKey instance", function () {
        expect(DocumentKey.mixedBy(documentKey)).toBeTruthy();
      });

      it("should set documentType & documentId properties", function () {
        expect(documentKey.documentType).toBe('foo');
        expect(documentKey.documentId).toBe('bar');
      });
    });

    describe("fromEntityPath()", function () {
      var entityPath = 'document.foo.bar'.toPath();

      beforeEach(function () {
        documentKey = DocumentKey.fromEntityPath(entityPath);
      });

      it("should return a DocumentKey instance", function () {
        expect(DocumentKey.mixedBy(documentKey)).toBeTruthy();
      });

      it("should set documentType & documentId properties", function () {
        expect(documentKey.documentType).toBe('foo');
        expect(documentKey.documentId).toBe('bar');
      });

      it("should set _entityPath property", function () {
        expect(documentKey._entityPath).toBe(entityPath);
      });
    });

    describe("fromString()", function () {
      beforeEach(function () {
        documentKey = DocumentKey.fromString('\\/bar/baz');
      });

      it("should return a DocumentKey instance", function () {
        expect(DocumentKey.mixedBy(documentKey)).toBeTruthy();
      });

      it("should set documentType & documentId properties", function () {
        expect(documentKey.documentType).toBe('/bar');
        expect(documentKey.documentId).toBe('baz');
      });
    });

    describe("equals()", function () {
      describe("for matching keys", function () {
        it("should return true", function () {
          expect('foo/bar'.toDocumentKey().equals('foo/bar'.toDocumentKey()))
          .toBe(true);
          expect('bar/baz'.toDocumentKey().equals('bar/baz'.toDocumentKey()))
          .toBe(true);
        });
      });

      describe("for non-matching keys", function () {
        it("should return false", function () {
          expect('foo/bar'.toDocumentKey().equals('bar/baz'.toDocumentKey()))
          .toBe(false);
          expect('bar/baz'.toDocumentKey().equals('baz/foo'.toDocumentKey()))
          .toBe(false);
        });
      });
    });

    describe("getMetaKey()", function () {
      beforeEach(function () {
        result = documentKey.getMetaKey();
      });

      it("should return a MetaKey", function () {
        expect($entity.MetaKey.mixedBy(result)).toBeTruthy();
      });

      it("should return meta key to the document type", function () {
        expect(result.equals($entity.MetaKey.fromString('__document/foo')))
        .toBeTruthy();
      });
    });

    describe("getEntityPath()", function () {
      beforeEach(function () {
        result = documentKey.getEntityPath();
      });

      it("should return a Path", function () {
        expect($data.Path.mixedBy(result)).toBeTruthy();
      });

      it("should return entity path to the document", function () {
        expect(result.equals('document.foo.bar'.toPath()));
      });

      it("should set _entityPath property", function () {
        expect(documentKey._entityPath).toBe(result);
      });
    });

    describe("getFieldKey()", function () {
      beforeEach(function () {
        result = documentKey.getFieldKey('baz');
      });

      it("should return a FieldKey", function () {
        expect($entity.FieldKey.mixedBy(result)).toBeTruthy();
      });

      it("should return field in document", function () {
        expect(result).toEqual('foo/bar/baz'.toFieldKey());
      });
    });

    describe("toString()", function () {
      it("should return string representation", function () {
        expect(documentKey.toString()).toBe('foo/bar');
      });

      it("should escape delimiters in components", function () {
        expect(['foo/', '/bar'].toDocumentKey().toString())
        .toBe('foo\\//\\/bar');
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toDocumentKey()", function () {
    var documentKey;

    beforeEach(function () {
      documentKey = $entity.DocumentKey.fromString('foo/bar');
      spyOn($entity.DocumentKey, 'create').and.returnValue(documentKey);
      result = 'foo/bar'.toDocumentKey();
    });

    it("should create a DocumentKey instance", function () {
      expect($entity.DocumentKey.create).toHaveBeenCalledWith({
        documentType: 'foo',
        documentId: 'bar'
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(documentKey);
    });
  });
});

describe("Array", function () {
  var result;

  describe("toDocumentKey()", function () {
    var components,
        documentKey;

    beforeEach(function () {
      components = ['foo', 'bar'];
      documentKey = 'foo/bar'.toDocumentKey();
      spyOn($entity.DocumentKey, 'create').and.returnValue(documentKey);
      result = components.toDocumentKey();
    });

    it("should create a DocumentKey instance", function () {
      expect($entity.DocumentKey.create).toHaveBeenCalledWith({
        documentType: 'foo',
        documentId: 'bar'
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(documentKey);
    });
  });
});

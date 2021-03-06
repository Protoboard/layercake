"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe("TranslationIndex", function () {
    var TranslationIndex,
        translationIndex;

    beforeAll(function () {
      TranslationIndex = $oop.createClass('test.$i18n.TranslationIndex.TranslationIndex')
      .blend($i18n.TranslationIndex)
      .build();
      TranslationIndex.__builder.forwards = {list: [], lookup: {}};
    });

    it("should be singleton", function () {
      expect(TranslationIndex.create()).toBe(TranslationIndex.create());
    });

    describe(".create()", function () {
      var translationIndexData;

      beforeEach(function () {
        TranslationIndex.__builder.instances = {};
        $entity.entities.appendNode('document'.toTreePath(), {
          _locale: {
            'en-us': {
              localeName: 'US English',
              translations: {
                '_translation/apple-en-us': 1,
                '_translation/state-en-us': 1
              }
            },
            'de': {
              localeName: 'German',
              translations: {
                '_translation/apple-de': 1,
                '_translation/state-de': 1
              }
            }
          },
          _translation: {
            'apple-en-us': {
              originalString: 'apple',
              pluralForms: {
                0: 'apple',
                1: 'apples'
              }
            },
            'state-en-us': {
              originalString: 'state',
              context: 'geography',
              pluralForms: {
                0: 'state',
                1: 'states'
              }
            },
            'apple-de': {
              originalString: 'apple',
              pluralForms: {
                0: 'Apfel',
                1: 'Äpfel'
              }
            },
            'state-de': {
              originalString: 'state',
              context: 'geography',
              pluralForms: {
                0: 'Staat',
                1: 'Staaten'
              }
            }
          }
        });

        translationIndexData = $entity.index.data._translation;
        $entity.index.data._translation = {};
      });

      afterEach(function () {
        $entity.index.data._translation = translationIndexData;
      });

      it("should initialize index", function () {
        TranslationIndex.create();
        expect($entity.index.data._translation).toEqual({
          'en-us': {
            'apple': {
              '': {
                0: 'apple',
                1: 'apples'
              }
            },
            'state': {
              'geography': {
                0: 'state',
                1: 'states'
              }
            }
          },
          'de': {
            'apple': {
              '': {
                0: 'Apfel',
                1: 'Äpfel'
              }
            },
            'state': {
              'geography': {
                0: 'Staat',
                1: 'Staaten'
              }
            }
          }
        });
      });
    });

    describe("#addTranslation()", function () {
      var translationIndexData;

      beforeEach(function () {
        translationIndex = TranslationIndex.create();

        translationIndexData = $entity.index.data._translation;
        $entity.index.data._translation = {};
      });

      afterEach(function () {
        $entity.index.data._translation = translationIndexData;
      });

      it("should return self", function () {
        var result = translationIndex.addTranslation(
            'en-us', 'state', 'geography', 1, "states");
        expect(result).toBe(translationIndex);
      });

      it("should add translation to index", function () {
        translationIndex.addTranslation(
            'en-us', 'state', 'geography', 1, "states");
        expect($entity.index.data._translation).toEqual({
          'en-us': {
            'state': {
              'geography': {
                1: "states"
              }
            }
          }
        });
      });

      describe("when context is omitted", function () {
        it("should use default context", function () {
          translationIndex.addTranslation(
              'en-us', 'state', null, 1, "states");
          expect($entity.index.data._translation).toEqual({
            'en-us': {
              'state': {
                '': {
                  1: "states"
                }
              }
            }
          });
        });
      });

      describe("when pluralIndex is omitted", function () {
        it("should use default pluralIndex", function () {
          translationIndex.addTranslation(
              'en-us', 'state', 'geography', null, "state");
          expect($entity.index.data._translation).toEqual({
            'en-us': {
              'state': {
                'geography': {
                  0: "state"
                }
              }
            }
          });
        });
      });
    });

    describe("#getTranslation()", function () {
      var translationIndexData;

      beforeEach(function () {
        translationIndex = TranslationIndex.create();

        translationIndexData = $entity.index.data._translation;
        $entity.index.data._translation = {
          'en-us': {
            'state': {
              'geography': {
                0: "state",
                1: "states"
              }
            },
            'apple': {
              '': {
                0: "apple",
                1: "apples"
              }
            }
          }
        };
      });

      afterEach(function () {
        $entity.index.data._translation = translationIndexData;
      });

      it("should return translation matching parameters", function () {
        var result = translationIndex.getTranslation(
            'en-us', 'state', 'geography', 1);
        expect(result).toBe('states');
      });

      describe("when context is omitted", function () {
        it("should use default context", function () {
          var result = translationIndex.getTranslation(
              'en-us', 'apple', null, 1);
          expect(result).toBe('apples');
        });
      });

      describe("when pluralIndex is omitted", function () {
        it("should use default pluralIndex", function () {
          var result = translationIndex.getTranslation(
              'en-us', 'apple', null, null);
          expect(result).toBe('apple');
        });
      });
    });

    describe("#onTranslationsFieldChange()", function () {
      beforeEach(function () {
        $i18n.TranslationIndex.create();
      });

      describe("when adding translation document", function () {
        var translationIndexData;

        beforeEach(function () {
          '_translation/foo-en-us'.toDocument().deleteNode();
          '_locale/en-us/translations'.toField().deleteNode();

          translationIndexData = $entity.index.data._translation;
          $entity.index.data._translation = {};
        });

        afterEach(function () {
          $entity.index.data._translation = translationIndexData;
        });

        it("should add new entry to index", function () {
          '_translation/foo-en-us'.toDocument().setNode({
            locale: '_locale/en-us',
            originalString: 'foo',
            pluralForms: ['foo', 'foo']
          });
          '_locale/en-us/translations'.toField().appendNode({
            '_translation/foo-en-us': 1
          });

          expect($entity.index.data._translation).toEqual({
            'en-us': {
              'foo': {
                '': {
                  0: "foo",
                  1: "foo"
                }
              }
            }
          });
        });
      });
    });
  });
});

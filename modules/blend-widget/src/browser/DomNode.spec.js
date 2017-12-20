"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'];

describe("$widget", function () {
  describe("DomNode", function () {
    var DomNode,
        domNode;

    beforeAll(function () {
      DomNode = $oop.createClass('test.$widget.DomNode.DomNode')
      .blend($widget.Node)
      .blend($widget.DomNode)
      .define({
        getContentMarkup: function fn() {
          return fn.returned + "FOO";
        }
      })
      .build();
      DomNode.__builder.forwards = {list: [], lookup: {}};
    });

    describe("addChildNode()", function () {
      var element,
          childNode, childElement;

      beforeEach(function () {
        domNode = DomNode.fromNodeName('foo');
        element = document.createElement('div');
        childNode = DomNode.create({nodeName: 'bar', nodeOrder: 2});
        childElement = document.createElement('div');

        spyOn(domNode, 'getElement').and.returnValue(element);
        spyOn(childNode, 'createElement').and.returnValue(childElement);
      });

      it("should return self", function () {
        var result = domNode.addChildNode(childNode);
        expect(result).toBe(domNode);
      });

      it("should render node as child", function () {
        domNode.addChildNode(childNode);
        expect(element.childNodes.item(0)).toBe(childElement);
      });

      describe("when node already has children", function () {
        var childNode2, childElement2;

        beforeEach(function () {
          childNode2 = DomNode.create({nodeName: 'baz', nodeOrder: 1});
          childElement2 = document.createElement('div');
          spyOn(childNode, 'getElement').and.returnValue(childElement);
          spyOn(childNode2, 'createElement').and.returnValue(childElement2);

          domNode.addChildNode(childNode);
        });

        it("should render at appropriate index", function () {
          domNode.addChildNode(childNode2);
          expect(element.childNodes.item(0)).toBe(childElement2);
          expect(element.childNodes.item(1)).toBe(childElement);
        });
      });
    });

    describe("removeChildNode()", function () {
      var element,
          childNode, childElement;

      beforeEach(function () {
        domNode = DomNode.fromNodeName('foo');
        element = document.createElement('div');
        childNode = DomNode.create({nodeName: 'bar', nodeOrder: 2});
        childElement = document.createElement('div');

        spyOn(domNode, 'getElement').and.returnValue(element);
        spyOn(childNode, 'createElement').and.returnValue(childElement);
        spyOn(childNode, 'getElement').and.returnValue(childElement);

        domNode.addChildNode(childNode);
      });

      it("should return self", function () {
        var result = domNode.removeChildNode('bar');
        expect(result).toBe(domNode);
      });

      it("should remove child element from parent", function () {
        domNode.removeChildNode('bar');
        expect(element.childNodes.length).toBe(0);
      });
    });

    describe("setChildOrder()", function () {
      var element,
          childNode1, childElement1,
          childNode2, childElement2;

      beforeEach(function () {
        domNode = DomNode.fromNodeName('foo');
        element = document.createElement('div');
        childNode1 = DomNode.create({nodeName: 'bar', nodeOrder: 1});
        childElement1 = document.createElement('div');
        childNode2 = DomNode.create({nodeName: 'baz', nodeOrder: 2});
        childElement2 = document.createElement('div');

        spyOn(domNode, 'getElement').and.returnValue(element);
        spyOn(childNode1, 'createElement').and.returnValue(childElement1);
        spyOn(childNode1, 'getElement').and.returnValue(childElement1);
        spyOn(childNode2, 'createElement').and.returnValue(childElement2);
        spyOn(childNode2, 'getElement').and.returnValue(childElement2);

        domNode
        .addChildNode(childNode1)
        .addChildNode(childNode2);
      });

      it("should return self", function () {
        var result = domNode.setChildOrder(childNode1, 3);
        expect(result).toBe(domNode);
      });

      it("should move element in parent", function () {
        domNode.setChildOrder(childNode1, 3);
        expect(element.childNodes.item(0)).toBe(childElement2);
        expect(element.childNodes.item(1)).toBe(childElement1);
      });
    });

    describe("setAttribute()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('div');
        domNode = DomNode.create();
        spyOn(domNode, 'getElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domNode.setAttribute('foo', 'bar');
        expect(result).toBe(domNode);
      });

      it("should set attribute on element", function () {
        domNode.setAttribute('foo', 'bar');
        expect(element.getAttribute('foo')).toBe('bar');
      });

      describe("when attribute is style", function () {
        it("should set style.cssText", function () {
          domNode.setAttribute('style', 'width:10px');
          expect(element.style.cssText).toBe('width: 10px;');
        });
      });
    });

    describe("deleteAttribute()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('div');
        domNode = DomNode.create();
        spyOn(domNode, 'getElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domNode.deleteAttribute('foo');
        expect(result).toBe(domNode);
      });

      it("should remove attribute from element", function () {
        domNode.setAttribute('foo', 'bar');
        domNode.deleteAttribute('foo');
        expect(element.getAttribute('foo')).toBe(null);
      });

      describe("when attribute is style", function () {
        beforeEach(function () {
          domNode.setAttribute('style', 'width:10px');
        });

        it("should set style.cssText", function () {
          domNode.deleteAttribute('style');
          expect(element.style.cssText).toBe('');
        });
      });
    });

    describe("createElement()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('div');
        domNode = DomNode.fromElementId('foo')
        .setAttribute('hello', 'world')
        .addChildNode(DomNode.create({
          elementId: 'bar',
          nodeName: 'baz'
        }));
        spyOn(document, 'createElement').and.returnValue(element);
      });

      it("should create new HTML element", function () {
        domNode.createElement();
        expect(document.createElement)
        .toHaveBeenCalledWith(domNode.elementName);
      });

      it("should return Element instance", function () {
        var result = domNode.createElement();
        expect(result).toBe(element);
      });

      it("should add attributes", function () {
        var result = domNode.createElement();
        expect(result.getAttribute('hello')).toBe('world');
      });

      it("should add contents", function () {
        var result = domNode.createElement();
        expect(result.innerHTML)
        .toEqual('<div id="bar">FOO</div>FOO');
      });
    });

    describe("getElement()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('div');
        domNode = DomNode.fromElementId('foo');
        spyOn(document, 'getElementById').and.returnValue(element);
      });

      it("should retrieve element by elementId", function () {
        domNode.getElement();
        expect(document.getElementById).toHaveBeenCalledWith('foo');
      });

      it("should return retrieved element", function () {
        var result = domNode.getElement();
        expect(result).toBe(element);
      });
    });

    describe("renderInto()", function () {
      var parentElement,
          element;

      beforeEach(function () {
        parentElement = document.createElement('div');
        element = document.createElement('div');
        domNode = DomNode.fromElementId('foo');

        spyOn(domNode, 'createElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domNode.renderInto(parentElement);
        expect(result).toBe(domNode);
      });

      it("should append element to parentElement", function () {
        domNode.renderInto(parentElement);
        expect(parentElement.lastChild).toBe(element);
      });

      describe("when already rendered in DOM", function () {
        var oldParentElement;

        beforeEach(function () {
          oldParentElement = document.createElement('div');
          oldParentElement.appendChild(element);
          spyOn(domNode, 'getElement').and.returnValue(element);
        });

        it("should remove element from old parent", function () {
          domNode.renderInto(parentElement);
          expect(oldParentElement.contains(element)).toBeFalsy();
        });
      });
    });

    describe("reRender()", function () {
      var parentElement,
          oldElement,
          newElement;

      beforeEach(function () {
        parentElement = document.createElement('div');
        oldElement = document.createElement('div');
        newElement = document.createElement('div');
        parentElement.appendChild(oldElement);
        domNode = DomNode.fromElementId('foo');

        spyOn(domNode, 'getElement').and.returnValue(oldElement);
        spyOn(domNode, 'createElement').and.returnValue(newElement);
      });

      it("should return self", function () {
        var result = domNode.reRender();
        expect(result).toBe(domNode);
      });

      it("should replace element", function () {
        domNode.reRender();
        expect(parentElement.contains(oldElement)).toBeFalsy();
        expect(parentElement.contains(newElement)).toBeTruthy();
      });
    });

    describe("reRenderContents()", function () {
      var domNode, element,
          childNode, childElement;

      beforeEach(function () {
        element = document.createElement('div');
        domNode = DomNode.fromElementName('div');
        childNode = DomNode.fromElementName('div');
        spyOn(domNode, 'getElement').and.returnValue(element);

        domNode
        .addChildNode(childNode);
      });

      it("should return self", function () {
        var result = domNode.reRenderContents();
        expect(result).toBe(domNode);
      });

      it("should replace contents", function () {
        childElement = element.childNodes[0];
        domNode.reRenderContents();
        expect(element.innerHTML).toBe('<div>FOO</div>FOO');
        expect(element.childNodes[0]).not.toBe(childElement);
      });
    });
  });

  describe("HtmlNode", function () {
    var HtmlNode,
        htmlNode;

    beforeAll(function () {
      HtmlNode = $oop.createClass('test.$widget.DomNode.HtmlNode')
      .blend($widget.Node)
      .blend($widget.HtmlNode)
      .build();
    });

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return DomNode instance", function () {
          htmlNode = HtmlNode.create();
          expect($widget.DomNode.mixedBy(htmlNode)).toBeTruthy();
        });
      });
    });
  });
});
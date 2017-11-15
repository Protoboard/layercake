"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("DomClickable", function () {
    var DomClickable,
        domClickable;

    beforeAll(function () {
      DomClickable = $oop.getClass('test.$widgets.DomClickable.DomClickable')
      .blend($widget.Widget)
      .blend($widget.HtmlWidget)
      .blend($widgets.DomClickable);
      DomClickable.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("onClick()", function () {
      var element,
          clickEvent;

      beforeEach(function () {
        element = document.createElement('div');
        domClickable = DomClickable.create();

        spyOn(domClickable, 'getElement').and.returnValue(element);
        spyOn(domClickable, 'click');

        domClickable.onRender();
        clickEvent = new Event('click');
      });

      it('should push click event to EventTrail', function () {
        domClickable.getElement().dispatchEvent(clickEvent);
        var wrapperEvent = $event.EventTrail.create().data.previousLink;
        expect($event.WrapperEvent.mixedBy(wrapperEvent)).toBeTruthy();
        expect(wrapperEvent.wrapped).toBe(clickEvent);
      });

      it("should invoke click()", function () {
        domClickable.getElement().dispatchEvent(new Event('click'));
        expect(domClickable.click).toHaveBeenCalled();
      });
    });
  });
});
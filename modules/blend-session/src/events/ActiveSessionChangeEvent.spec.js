"use strict";

var $oop = window['blend-oop'],
    $session = window['blend-session'];

describe("$event", function () {
  describe("Event", function () {
    describe(".create()", function () {
      describe("when event name is prefixed with 'session.change.session-state'", function () {
        it("should return ActiveSessionChangeEvent instance", function () {
          var result = $event.Event.create({eventName: 'session.change.active-session'});
          expect($session.ActiveSessionChangeEvent.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});

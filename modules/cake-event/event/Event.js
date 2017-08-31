"use strict";

/**
 * @function $event.Event.create
 * @param {Object} properties
 * @param {string} properties.eventName
 * @returns {$event.Event}
 */

/**
 * Signals a change in the state of some component of the application. Carries
 * information about the affected component and the cause(s) that led to the
 * corresponding change.
 * @todo What about payload?
 * @class $event.Event
 * @extends $utils.Cloneable
 * @extends $data.Link
 */
$event.Event = $oop.getClass('$event.Event')
.mix($utils.Cloneable)
.mix($data.Link)
.define(/** @lends $event.Event# */{
  /**
   * Identifies event type.
   * @member {string} $event.Event#eventName
   */

  /**
   * Event instance the current event is the effect of. In other words, the
   * triggering of which led to the triggering of the current event. A chain
   * of causing events usually leads back to user interaction, or scheduled
   * operations.
   * It is possible to set this property using
   * {@link $event.Event#setCausingEvent}, but most of the time it's set
   * by the event mechanism once the event is triggered.
   * @member {$event.Event} $event.Event#causingEvent
   */

  /**
   * Identifies the application component (instance) that is responsible for
   * triggering the current event.
   * @todo Should this be #publisher instead?
   * @member {*} $event.Event#sender
   */

  /**
   * Series of paths that the event will visit during the bubbling process.
   * @member {Array.<$data.Path>} $event.Event#targetPaths
   */

  /**
   * Path currently visited by the event. Defined only while triggered.
   * @member {$data.Path} $event.Event#currentPath
   */

  /**
   * Creates a `Event` instance based on the specified event name.
   * @memberOf $event.Event
   * @param {string} eventName
   * @returns {$event.Event}
   */
  fromEventName: function (eventName) {
    return this.create({eventName: eventName});
  },

  /** @ignore */
  spread: function () {
      this.targetPaths = this.targetPaths || [];
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.eventName, "Invalid eventName.");
    this.elevateMethods('unlink');
  },

  /**
   * @param {Array<$utils.Thenable>} thenables
   * @returns {$utils.Promise}
   * @private
   */
  _unlinkWhen: function (thenables) {
    return $utils.Promise.when(thenables)
    .then(this.unlink, this.unlink);
  },

  /**
   * @returns {$event.Event}
   */
  clone: function clone() {
    var cloned = clone.returned;

    cloned.causingEvent = this.causingEvent;
    cloned.sender = this.sender;
    cloned.targetPaths = $data.shallowCopy(this.targetPaths);
    cloned.currentPath = this.currentPath;

    return cloned;
  },

  /**
   * Triggers event. Invokes callbacks subscribed to `eventName`, on each of
   * `targetPaths`. Callbacks on a certain path will be invoked in an
   * unspecified order. The returned promise resolves when all subscribed
   * callbacks (synchronous or otherwise) have completed.
   * @returns {$utils.Promise}
   * @see $event.EventSpace#on
   */
  trigger: function () {
    if (this.sender === undefined) {
      $assert.fail("Event sender is not defined. Can't trigger.");
    }

    var eventTrail = $event.EventTrail.create();

    if (this.causingEvent === undefined && !eventTrail.isEmpty()) {
      this.causingEvent = eventTrail.data.previousLink;
    }

    eventTrail.push(this);

    var eventSpace = $event.EventSpace.create(),
        eventName = this.eventName,
        targetPaths = this.targetPaths,
        targetPathCount = targetPaths.length,
        targetPath,
        callbacksPath,
        callbacks,
        subscriberIds,
        callbackCount,
        i, j,
        results = [];

    for (i = 0; i < targetPathCount; i++) {
      targetPath = targetPaths[i];
      callbacksPath = $data.Path.fromComponents([
        'callbacks', 'bySubscription', eventName, targetPath.toString()]);
      callbacks = eventSpace.subscriptions.getNode(callbacksPath);
      subscriberIds = callbacks && Object.keys(callbacks);
      callbackCount = subscriberIds && subscriberIds.length || 0;

      // setting current path
      this.currentPath = targetPath;

      // invoking callbacks for eventName / targetPath
      for (j = 0; j < callbackCount; j++) {
        results.push(callbacks[subscriberIds[j]](this));
      }
    }

    return this._unlinkWhen(results);
  },

  /**
   * @param causingEvent
   * @returns {$event.Event}
   */
  setCausingEvent: function (causingEvent) {
    this.causingEvent = causingEvent;
    return this;
  },

  /**
   * @param sender
   * @returns {$event.Event}
   */
  setSender: function (sender) {
    this.sender = sender;
    return this;
  },

  /**
   * @param targetPaths
   * @returns {$event.Event}
   */
  addTargetPaths: function (targetPaths) {
    this.targetPaths = this.targetPaths.concat(targetPaths);
    return this;
  },

  /**
   * @returns {$event.Event}
   */
  stopPropagation: function () {
    this.bubbles = false;
    return this;
  }
});

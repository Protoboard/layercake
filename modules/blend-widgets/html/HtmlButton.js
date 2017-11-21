"use strict";

/**
 * @mixin $widgets.HtmlButton
 * @extend $widget.HtmlWidget
 * @extend $widget.HtmlDisabledAttributeHost
 * @augments $widgets.Button
 */
$widgets.HtmlButton = $oop.getClass('$widgets.HtmlButton')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$widgets.HtmlDisabledAttributeHost'))
.expect($oop.getClass('$widgets.Button'))
.define(/** @lends $widgets.HtmlButton# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'button';
  }
});

$oop.getClass('$widgets.Button')
.forwardBlend($widgets.HtmlButton, $widget.isHtml);

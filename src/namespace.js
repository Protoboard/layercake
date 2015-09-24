/*jshint node:true */

/** @namespace */
var giant = giant || require('giant-namespace');

/** @namespace */
var $assertion = $assertion || require('giant-assertion');

/** @namespace */
var $oop = $oop || require('giant-oop');

/** @namespace */
var $data = $data || require('giant-data');

/** @namespace */
var $event = $event || require('giant-event');

/** @namespace */
var $entity = $entity || require('giant-entity');

/** @namespace */
var $templating = $templating || require('giant-templating');

/** @namespace */
var $i18n = $i18n || require('giant-i18n');

/** @namespace */
var $routing = $routing || require('giant-routing');

if (typeof require === 'function') {
    require('giant-asset');
    require('giant-common-widgets');
    require('giant-table');
    require('giant-transport');
    require('giant-widget');
}

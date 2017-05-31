"use strict";

/**
 * @name $data.Chain.create
 * @function
 * @returns {$data.Chain}
 */

/**
 * Chain data structure with two fixed ends and value carrying links in between.
 * Chain behaves like a stack in that you may append and prepend the chain
 * using a stack-like API. (push, pop, etc.)
 * TODO: Add DataContainer#toChain w/ data transform
 * @class $data.Chain
 * @extends $data.DataContainer
 * @extends $data.ScalarContainer
 */
$data.Chain = $oop.getClass('$data.Chain')
    .extend($oop.getClass('$data.DataContainer'))
    .extend($oop.getClass('$data.ScalarContainer'))
    .define(/** @lends $data.Chain# */{
        /** @ignore */
        init: function () {
            /**
             * @type {$data.MainLink}
             * @private
             */
            this._data = $data.MainLink.create(this);
        },

        /**
         * @param {$data.Link} item
         * @returns {$data.Chain}
         */
        setItem: function (item) {
            this.pushLink(item);
            return this;
        },

        /**
         * @param {$data.Link} item
         * @returns {$data.Chain}
         */
        deleteItem: function (item) {
            item.unlink();
            return this;
        },

        /**
         * @param {$data.Link} item
         * @returns {boolean}
         */
        hasItem: function (item) {
            return item._chain === this;
        },

        /**
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.Chain}
         */
        forEachItem: function (callback, context) {
            var link = this._data.nextLink;

            while (link !== this._data) {
                if (callback.call(context || this, link) === false) {
                    break;
                }
                link = link.nextLink;
            }

            return this;
        },

        /**
         * Adds link at the end of the chain.
         * @param {$data.Link} link
         */
        pushLink: function (link) {
            link.addBefore(this._data);
            return this;
        },

        /**
         * Removes link from the end of the chain and returns removed link.
         * @returns {$data.Link}
         */
        popLink: function () {
            return this._data.previousLink.unlink();
        },

        /**
         * Adds link at the start of the chain.
         * @param {$data.Link} link
         */
        unshiftLink: function (link) {
            link.addAfter(this._data);
            return this;
        },

        /**
         * Removes link from the start of the chain and returns removed link.
         * @returns {$data.Link}
         */
        shiftLink: function () {
            return this._data.nextLink.unlink();
        }
    });
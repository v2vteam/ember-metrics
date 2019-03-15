/* jshint unused: false */
import { assert } from '@ember/debug';

import { guidFor } from '@ember/object/internals';
import { typeOf } from '@ember/utils';
import emberObject, { set, aliasMethod } from '@ember/object';
import Ember from 'ember';
import canUseDOM from '../utils/can-use-dom';

const {
  K
} = Ember;

function makeToString(ret) {
  return (() => ret);
}

export default emberObject.extend({
  init() {
    assert(`[ember-metrics] ${this.toString()} must implement the init hook!`);
  },

  willDestroy() {
    assert(`[ember-metrics] ${this.toString()} must implement the willDestroy hook!`);
  },

  toString() {
    const hasToStringExtension = typeOf(this.toStringExtension) === 'function';
    const extension = hasToStringExtension ? ':' + this.toStringExtension() : '';
    const ret = `ember-metrics@metrics-adapter:${extension}:${guidFor(this)}`;

    this.toString = makeToString(ret);
    return ret;
  },

  metrics: null,
  config: null,
  identify: K,
  trackEvent: K,
  trackPage: K,
  alias: K
});

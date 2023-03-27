import { isPresent } from '@ember/utils';
import { copy } from '@ember/object/internals';
import { assert } from '@ember/debug';
import { merge } from '@ember/polyfills';
import $ from 'jquery';
import { capitalize } from '@ember/string';
import canUseDOM from '../utils/can-use-dom';
import { compact } from '../utils/object-transforms';
import BaseAdapter from './base';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'GoogleAnalytics';
  },

  init() {
    const { id, options } = this.config;

    assert(`[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`, id);

    this.options = {
      send_page_view: true,
      ...options,
    };

    this._injectScript(id);

    window.dataLayer = window.dataLayer || [];
    this.gtag('js', new Date());
    this.gtag('config', id, compact(this.options));
  },

  _injectScript(id) {
    let script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;

    document.head.appendChild(script);
  },

  gtag() {
    window.dataLayer.push(arguments);

    return arguments;
  },

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;

    if (!event) {
      return;
    }

    delete compactedOptions.event;

    return this.gtag('event', event, compactedOptions);
  },

  trackPage(options = {}) {
    if (this.options.send_page_view) {
      return;
    }

    if (options?.page && !options?.page_location) {
      options.page_location = options?.page;
      delete options.page;
    }

    if (options?.title && !options?.page_title) {
      options.page_title = options?.title;
      delete options.title;
    }

    return this.trackEvent({
      event: 'page_view',
      ...options,
    });
  },

  willDestroy() {
    $('script[src*="gtag/js"]').remove();
    delete window.dataLayer;
  }
});

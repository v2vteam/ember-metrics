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
    // const config = copy(this.config);
    // const { id, options } = config;
    const { id, options } = this.config;

    assert(`[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`, id);

    // delete config.id;

    // const hasAlias = isPresent(this.alias);
    // const hasOptions = isPresent(Object.keys(config));


    //--------
    this.options = {
      send_page_view: true,
      ...options,
    };

    console.log('init', compact(this.options), this.alias, compact(this.config))

    this._injectScript(id);

    window.dataLayer = window.dataLayer || [];
    this.gtag('js', new Date());
    this.gtag('config', id, compact(this.options));
    //--------

    // if (canUseDOM) {
    //   console.log('init GA', config.options, hasOptions, id);
    //   if ($('script[src*="gtag/js"]').length === 0) {
    //     /* jshint ignore:start */
    //     // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    //     //   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    //     //   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    //     // })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    //
    //     this._injectScript(id);
    //
    //     window.dataLayer = window.dataLayer || [];
    //     this.gtag('js', new Date());
    //     this.gtag('config', id, compact(config.options));
    //
    //     /* jshint ignore:end */
    //   }
    //
    //   // OBS: NAO ESTA FUNCIONANDO PARA MAIS DE UM GOOGLE ANALYTICS.
    //   // ACHO QUE A VERSAO NOVA DEVE FUNCIONAR DE FORMA DIFERENTE.
    //   // LER DOCUMENTAÇÃO.
    //   // let params = ['create', id, 'auto'];
    //   // if (hasAlias) params.push(this.alias);
    //   // if (hasOptions) params.push(config);
    //   //
    //   // window.ga(...params);
    //
    // }
  },

  _injectScript(id) {
    let script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;

    document.head.appendChild(script);
  },

  gtag() {
    console.log('gtag', arguments);
    window.dataLayer.push(arguments);

    return arguments;
  },

  // _eventName() {
  //   return isPresent(this.alias) ? `${this.alias}.send` : 'send';
  // },

  // identify(options = {}) {
  //   const compactedOptions = compact(options);
  //   const { distinctId } = compactedOptions;
  //
  //   window.ga('set', 'userId', distinctId);
  // },

  // trackEvent(options = {}) {
  //   console.log('trackEvent GA');
  //   const compactedOptions = compact(options);
  //   const sendEvent = { hitType: 'event' };
  //   let gaEvent = {};
  //
  //   if (compactedOptions.nonInteraction) {
  //     gaEvent.nonInteraction = compactedOptions.nonInteraction;
  //     delete compactedOptions.nonInteraction;
  //   }
  //
  //   for (let key in compactedOptions) {
  //     const capitalizedKey = capitalize(key);
  //     gaEvent[`event${capitalizedKey}`] = compactedOptions[key];
  //   }
  //
  //   const event = merge(sendEvent, gaEvent);
  //   window.gtag(this._eventName(), event);
  //
  //   return event;
  // },
  trackEvent(options = {}) {
    console.log('trackEvent GA4', options, this.config);
    const compactedOptions = compact(options);
    const { event } = compactedOptions;

    if (!event) {
      return;
    }

    delete compactedOptions.event;

    return this.gtag('event', event, compactedOptions);
  },

  // trackPage(options = {}) {
  //   console.log('trackPage GA XXXX', options);
  //   const compactedOptions = compact(options);
  //   const sendEvent = { hitType: 'pageview' };
  //
  //   const event = merge(sendEvent, compactedOptions);
  //   window.ga(this._eventName(), event);
  //
  //   return event;
  // },

  trackPage(options = {}) {
    console.log('trackPage GA4', options);
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

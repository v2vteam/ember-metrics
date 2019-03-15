import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;

module('google-analytics adapter', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    sandbox = sinon.sandbox.create();
    config = {
      id: 'UA-XXXX-Y'
    };
  });

  hooks.afterEach(function() {
    sandbox.restore();
  });

  test('#identify calls ga with the right arguments', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:google-analytics').create({ config });
    window.ga = sandbox.stub().callsFake(() => {
      return true;
    });
    adapter.identify({
      distinctId: 123
    });
    assert.ok(window.ga.calledWith('set', 'userId', 123), 'it sends the correct arguments');
  });

  test('#trackEvent returns the correct response shape', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:google-analytics').create({ config });
    window.ga = sandbox.stub();
    const result = adapter.trackEvent({
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4
    });
    const expectedResult = {
      hitType: 'event',
      eventCategory: 'button',
      eventAction: 'click',
      eventLabel: 'nav buttons',
      eventValue: 4
    };

    assert.deepEqual(result, expectedResult, 'it sends the correct response shape');
  });

  test('#trackPage returns the correct response shape', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:google-analytics').create({ config });
    window.ga = sandbox.stub();
    const result = adapter.trackPage({
      page: '/my-overridden-page?id=1',
      title: 'my overridden page'
    });
    const expectedResult = {
      hitType: 'pageview',
      page: '/my-overridden-page?id=1',
      title: 'my overridden page'
    };

    assert.deepEqual(result, expectedResult, 'it sends the correct response shape');
  });

  test('#trackPage returns the correct response shape', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:google-analytics').create({ config });
    window.ga = sandbox.stub();
    const result = adapter.trackPage();
    const expectedResult = {
      hitType: 'pageview'
    };

    assert.deepEqual(result, expectedResult, 'it sends the correct response shape');
  });
});

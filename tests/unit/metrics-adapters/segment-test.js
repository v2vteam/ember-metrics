import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;

module('segment adapter', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    sandbox = sinon.sandbox.create();
    config = {
      key: 'SEGMENT_KEY'
    };
  });

  hooks.afterEach(function() {
    sandbox.restore();
  });

  test('#identify calls analytics with the right arguments', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:segment').create({ config });
    window.analytics.identify = sandbox.stub().returns(true);
    adapter.identify({
      distinctId: 123
    });
    assert.ok(window.analytics.identify.calledWith(123), 'it sends the correct arguments');
  });

  test('#trackEvent returns the correct response shape', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:segment').create({ config });
    window.analytics.track = sandbox.stub().returns(true);
    adapter.trackEvent({
      event: 'Signed Up',
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4
    });
    const expectedArguments = {
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4
    };

    assert.ok(window.analytics.track.calledWith('Signed Up', expectedArguments), 'track called with proper arguments');
  });

  test('#trackPage returns the correct response shape', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:segment').create({ config });
    window.analytics.page = sandbox.stub().returns(true);
    adapter.trackPage({
      page: '/my-overridden-page?id=1',
      title: 'my overridden page'
    });
    const expectedArguments = {
      title: 'my overridden page'
    };

    assert.ok(window.analytics.page.calledWith('/my-overridden-page?id=1', expectedArguments), 'page called with proper arguments');
  });

  test('#trackPage returns the correct response shape', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:segment').create({ config });
    window.analytics.page = sandbox.stub().returns(true);
    adapter.trackPage();

    assert.ok(window.analytics.page.calledWith(), 'page called with default arguments');
  });

  test('#alias returns the correct response shape', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:segment').create({ config });
    window.analytics.alias = sandbox.stub().returns(true);
    adapter.alias({ alias: 'foo', original: 'bar' });

    assert.ok(window.analytics.alias.calledWith('foo', 'bar'), 'page called with default arguments');
  });
});

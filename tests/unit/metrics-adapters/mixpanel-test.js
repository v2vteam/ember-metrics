import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;

module('mixpanel adapter', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    sandbox = sinon.sandbox.create();
    config = {
      token: 'meowmeows'
    };
  });

  hooks.afterEach(function() {
    sandbox.restore();
  });

  test('#identify calls `mixpanel.identify` with the right arguments', function(assert) {
    var adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:mixpanel').create({ config });
    window.mixpanel.identify = sandbox.stub().returns(true);
    adapter.identify({
      distinctId: 123,
      foo: 'bar',
      cookie: 'chocolate chip'
    });
    adapter.identify({
      distinctId: 123
    });
    assert.ok(window.mixpanel.identify.firstCall.calledWith(123, { cookie: 'chocolate chip', foo: 'bar' }), 'it sends the correct arguments and options');
    assert.ok(window.mixpanel.identify.secondCall.calledWith(123), 'it sends the correct arguments');
  });

  test('#trackEvent calls `mixpanel.track` with the right arguments', function(assert) {
    var adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:mixpanel').create({ config });
    window.mixpanel.track = sandbox.stub().returns(true);
    adapter.trackEvent({
      event: 'Video played',
      videoLength: 213,
      id: 'hY7gQr0'
    });
    adapter.trackEvent({
      event: 'Ate a cookie'
    });
    assert.ok(window.mixpanel.track.calledWith('Video played', { videoLength: 213, id: 'hY7gQr0' }), 'it sends the correct arguments and options');
    assert.ok(window.mixpanel.track.calledWith('Ate a cookie'), 'it sends the correct arguments');
  });

  test('#alias calls `mixpanel.alias` with the right arguments', function(assert) {
    var adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:mixpanel').create({ config });
    window.mixpanel.alias = sandbox.stub().returns(true);
    adapter.alias({
      alias: 'user@example.com',
      original: 123
    });
    adapter.alias({
      alias: 'foo@bar.com'
    });
    assert.ok(window.mixpanel.alias.firstCall.calledWith('user@example.com', 123), 'it sends the correct arguments and options');
    assert.ok(window.mixpanel.alias.secondCall.calledWith('foo@bar.com'), 'it sends the correct arguments');
  });
});

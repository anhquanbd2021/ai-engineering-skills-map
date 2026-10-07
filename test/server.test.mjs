import test from 'node:test';
import assert from 'node:assert/strict';
import { createStaticServer } from '../app/server.js';
import { once } from 'node:events';

async function withServer(fn) {
  const server = createStaticServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    server.close();
  }
}

test('/health returns ok', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/health`);
    assert.equal(res.status, 200);
    assert.equal(await res.text(), 'ok');
  });
});

test('/version returns package metadata', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/version`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.name, 'ai-engineering-skills-map-demo');
    assert.ok(body.version && body.commit);
  });
});

test('serves allowlisted assets, 404s everything else', async () => {
  await withServer(async (base) => {
    for (const p of ['/', '/guide.html', '/styles.css', '/app.js', '/skills.mjs', '/meter.mjs', '/examples.mjs']) {
      const res = await fetch(base + p);
      assert.equal(res.status, 200, p);
    }
    for (const p of ['/package.json', '/../package.json', '/app/server.js', '/nope', '/test/meter.test.mjs']) {
      const res = await fetch(base + p);
      assert.equal(res.status, 404, p);
    }
    // HEAD works, POST does not
    assert.equal((await fetch(`${base}/`, { method: 'HEAD' })).status, 200);
    assert.equal((await fetch(`${base}/`, { method: 'POST' })).status, 404);
  });
});

test('security headers present on responses', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/`);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.match(res.headers.get('content-security-policy'), /default-src 'self'/);
  });
});

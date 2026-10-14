// test.js — Quick endpoint verification script
// Run with: node test.js  (server must be running on port 3000)

const http = require('http');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(raw) });
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function pass(label) { console.log(`  ✅ PASS: ${label}`); }
function fail(label, detail) { console.log(`  ❌ FAIL: ${label} — ${detail}`); }

async function runTests() {
  console.log('\n══════════════════════════════════════════');
  console.log('   Book REST API — Endpoint Test Suite');
  console.log('══════════════════════════════════════════\n');

  let res;

  // ── TEST 1: GET /books ──────────────────────────────────────────────────────
  console.log('TEST 1 — GET /books');
  res = await request('GET', '/books');
  console.log(`  Status: ${res.status}`, JSON.stringify(res.body, null, 2));
  res.status === 200 && res.body.success && Array.isArray(res.body.data)
    ? pass('GET /books returns 200 with array')
    : fail('GET /books', `status=${res.status}`);

  // ── TEST 2: POST /books (valid) ─────────────────────────────────────────────
  console.log('\nTEST 2 — POST /books (valid body)');
  res = await request('POST', '/books', { title: 'Atomic Habits', author: 'James Clear' });
  console.log(`  Status: ${res.status}`, JSON.stringify(res.body, null, 2));
  res.status === 201 && res.body.success && res.body.data.id
    ? pass('POST /books returns 201 and assigns id')
    : fail('POST /books valid', `status=${res.status}`);

  // ── TEST 3: POST /books (missing author) ────────────────────────────────────
  console.log('\nTEST 3 — POST /books (missing author → 400)');
  res = await request('POST', '/books', { title: 'No Author Book' });
  console.log(`  Status: ${res.status}`, JSON.stringify(res.body, null, 2));
  res.status === 400 && !res.body.success
    ? pass('POST /books missing author returns 400')
    : fail('POST /books missing author', `status=${res.status}`);

  // ── TEST 4: POST /books (empty title) ──────────────────────────────────────
  console.log('\nTEST 4 — POST /books (empty title → 400)');
  res = await request('POST', '/books', { title: '   ', author: 'Someone' });
  console.log(`  Status: ${res.status}`, JSON.stringify(res.body, null, 2));
  res.status === 400 && !res.body.success
    ? pass('POST /books empty title returns 400')
    : fail('POST /books empty title', `status=${res.status}`);

  // ── TEST 5: PUT /books/1 (valid) ────────────────────────────────────────────
  console.log('\nTEST 5 — PUT /books/1 (valid update)');
  res = await request('PUT', '/books/1', { title: 'Updated Title', author: 'Updated Author' });
  console.log(`  Status: ${res.status}`, JSON.stringify(res.body, null, 2));
  res.status === 200 && res.body.data.title === 'Updated Title'
    ? pass('PUT /books/1 returns 200 with updated data')
    : fail('PUT /books/1 valid', `status=${res.status}`);

  // ── TEST 6: PUT /books/999 (not found) ─────────────────────────────────────
  console.log('\nTEST 6 — PUT /books/999 (not found → 404)');
  res = await request('PUT', '/books/999', { title: 'X', author: 'Y' });
  console.log(`  Status: ${res.status}`, JSON.stringify(res.body, null, 2));
  res.status === 404 && !res.body.success
    ? pass('PUT /books/999 returns 404')
    : fail('PUT /books/999', `status=${res.status}`);

  // ── TEST 7: DELETE /books/2 ─────────────────────────────────────────────────
  console.log('\nTEST 7 — DELETE /books/2');
  res = await request('DELETE', '/books/2');
  console.log(`  Status: ${res.status}`, JSON.stringify(res.body, null, 2));
  res.status === 200 && res.body.success
    ? pass('DELETE /books/2 returns 200')
    : fail('DELETE /books/2', `status=${res.status}`);

  // ── TEST 8: DELETE /books/2 again (already deleted) ─────────────────────────
  console.log('\nTEST 8 — DELETE /books/2 again (404)');
  res = await request('DELETE', '/books/2');
  console.log(`  Status: ${res.status}`, JSON.stringify(res.body, null, 2));
  res.status === 404 && !res.body.success
    ? pass('DELETE /books/2 again returns 404')
    : fail('DELETE /books/2 again', `status=${res.status}`);

  // ── TEST 9: Unknown route ────────────────────────────────────────────────────
  console.log('\nTEST 9 — GET /unknown (unknown route → 404)');
  res = await request('GET', '/unknown');
  console.log(`  Status: ${res.status}`, JSON.stringify(res.body, null, 2));
  res.status === 404 && !res.body.success
    ? pass('Unknown route returns 404')
    : fail('Unknown route', `status=${res.status}`);

  // ── TEST 10: GET /books (final state) ──────────────────────────────────────
  console.log('\nTEST 10 — GET /books (final state after mutations)');
  res = await request('GET', '/books');
  console.log(`  Status: ${res.status}`, JSON.stringify(res.body, null, 2));
  res.status === 200
    ? pass(`GET /books final: ${res.body.count} books in store`)
    : fail('GET /books final', `status=${res.status}`);

  console.log('\n══════════════════════════════════════════');
  console.log('   All tests completed!');
  console.log('══════════════════════════════════════════\n');
}

runTests().catch((err) => {
  console.error('\n❌ Could not connect to server:', err.message);
  console.error('   Make sure the server is running with: npm start\n');
});

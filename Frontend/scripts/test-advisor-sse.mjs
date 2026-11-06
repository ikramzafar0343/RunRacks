/**
 * Advisor SSE frame parse smoke (no browser).
 */
import assert from "node:assert/strict";

function parseSseChunk(chunk) {
  const lines = chunk.replace(/\r\n/g, "\n").split("\n");
  let event = null;
  const dataLines = [];
  for (const line of lines) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }
  if (!event || dataLines.length === 0) return null;
  try {
    return { event, data: JSON.parse(dataLines.join("\n")) };
  } catch {
    return null;
  }
}

const crlf = parseSseChunk('event: response.delta\r\ndata: {"text":"Hi"}\r\n');
assert.equal(crlf?.event, "response.delta");
assert.equal(crlf?.data.text, "Hi");

const multi = parseSseChunk(
  'event: response.complete\ndata: {"text":"line1\\nline2","messageId":"m1","store":"memory"}',
);
assert.equal(multi?.event, "response.complete");
assert.equal(multi?.data.store, "memory");
assert.equal(multi?.data.messageId, "m1");

const block = parseSseChunk(
  'event: response.block\ndata: {"block":{"type":"replyChips","chips":[{"id":"a","label":"Website"}]}}',
);
assert.equal(block?.event, "response.block");
assert.equal(block?.data.block.type, "replyChips");

assert.equal(parseSseChunk("event: noop\ndata: {"), null);

console.log("test-advisor-sse OK");

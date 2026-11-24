import * as fs from "node:fs";
import * as path from "node:path";

// Famous Last Words at 1 Percent.
// The phone is not dying: it is resigning after 412 unthanked charges.
// First-person phone voice, its own dying battery, punch lands at the end,
// no will reading, no goodbye to the charger, no pun on 1 percent.
const LINE =
  "You charged me 412 times and never once said thank you. I am not dying. I am quitting.";

function main(): void {
  const chars = [...LINE];
  if (chars.length < 1 || chars.length > 199) {
    throw new Error(`entry must be 1-199 characters, got ${chars.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(LINE)) {
    throw new Error("entry must be a single line");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "entry.txt");
  // Write atomically: a run killed mid-write must never leave a torn entry.
  const tmpPath = `${outPath}.tmp-${process.pid}`;
  fs.writeFileSync(tmpPath, LINE, "utf8");
  fs.renameSync(tmpPath, outPath);
  const back = fs.readFileSync(outPath, "utf8");
  if (back !== LINE) {
    throw new Error("round-trip read-back mismatch");
  }
  if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
    throw new Error("round-trip byte length mismatch");
  }
}

main();

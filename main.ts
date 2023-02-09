// Spawn a bunch of workers and wait until they close.

for (let i = 0; i < 30; i++) {
  new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
}

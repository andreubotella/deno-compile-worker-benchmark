import {dirname, fromFileUrl, join} from "https://deno.land/std@0.177.0/path/mod.ts";

const EXE_SUFFIX = (Deno.build.os === "windows") ? ".exe" : "";
const CWD = dirname(fromFileUrl(import.meta.url));
const FLAGS = [
  "--extra-side-modules",
  "./worker.ts",
  "--no-check",
  "--import-map",
  "./import_map.json",
  "--allow-env",
  "--allow-read",
  "--allow-net",
];

async function denoCompile(main: string, binaryName: string): Promise<void> {
  const exeName = binaryName + EXE_SUFFIX;
  console.log("Compiling %s...", exeName);

  const process = Deno.run({
    cmd: [Deno.execPath(), "compile", ...FLAGS, "--output", binaryName, main],
    cwd: CWD
  });
  const status = await process.status();
  if (!status.success) {
    console.log("Compiling %s failed: %o", exeName, status);
    Deno.exit(status.code);
  }
}

await Promise.all([
  denoCompile("./main.ts", "parallelStressTest"),
  denoCompile("./worker.ts", "singleTest")
]);

// -----------------------------------------------------------------------------

Deno.bench("parallel stress test", async () => {
  const process = Deno.run({
    cmd: [join(CWD, "parallelStressTest" + EXE_SUFFIX)],
    cwd: CWD
  });
  const status = await process.status();
  if (!status.success) {
    throw new Error(`Parallel stress test failed: ${JSON.stringify(status)}`);
  }
});

Deno.bench("single test", async () => {
  const process = Deno.run({
    cmd: [join(CWD, "singleTest" + EXE_SUFFIX)],
    cwd: CWD
  });
  const status = await process.status();
  if (!status.success) {
    throw new Error(`Single test failed: ${JSON.stringify(status)}`);
  }
});
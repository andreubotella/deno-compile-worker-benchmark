// We import the fresh server (as an example of a realistic module graph), and
// then close the worker as soon as the module map is fully evaluated.

import "$fresh/server.ts";

self.close();

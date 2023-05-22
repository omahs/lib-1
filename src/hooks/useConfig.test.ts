import { assert, assertEquals, assertFalse } from "deno/testing/asserts.ts"
import useConfig, { _internals } from "./useConfig.ts"

Deno.test("useConfig", () => {
  let config = useTestConfig()
  assertEquals(config.UserAgent, "tea.lib/0.1.0")

  config = ConfigDefault({ TEA_PANTRY_PATH: "/foo:/bar", CI: "true" })
  assertEquals(config.pantries.map(x => x.string), ["/foo", "/bar"])
  assertEquals(config.options.compression, "gz")

  assertFalse(_internals.boolize("false"))
  assertFalse(_internals.boolize("0"))
  assertFalse(_internals.boolize("no"))
  assert(_internals.boolize("1"))
  assert(_internals.boolize("yes"))

  assert(_internals.initialized())
})


import { ConfigDefault } from "./useConfig.ts"
import Path from "../utils/Path.ts"

export function useTestConfig(env?: Record<string, string>) {
  env ??= {}

  /// always prefer a new prefix
  env.TEA_PREFIX ??= Path.mktemp().string

  /// reuse these unless the test overrides them to speed up testing
  env.TEA_CACHE_DIR ??= Path.home().join(".tea/tea.xyz/var/www").string
  env.TEA_PANTRY_PATH ??= Path.home().join(".tea/tea.xyz/var/pantry").string

  return useConfig(ConfigDefault(env))
}
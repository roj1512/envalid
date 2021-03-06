import { CleanOptions, ValidatorSpec } from "./types.ts";
import { getSanitizedEnv } from "./core.ts";
import { applyDefaultMiddleware } from "./middleware.ts";

/**
 * Returns a sanitized, immutable environment object. _Only_ the env vars
 * specified in the `validators` parameter will be accessible on the returned
 * object.
 * @param environment An object containing your env vars (eg. process.env).
 * @param specs An object that specifies the format of required vars.
 * @param options An object that specifies options for cleanEnv.
 */
export function cleanEnv<T extends Record<never, never>>(
  environment: unknown,
  specs: { [K in keyof T]: ValidatorSpec<T[K]> },
  options: CleanOptions<T> = {},
): Readonly<T> {
  const cleaned = getSanitizedEnv(environment, specs, options);
  return Object.freeze(
    // TODO
    Object.assign({}, applyDefaultMiddleware(cleaned, environment)),
  );
}

/**
 * Returns a sanitized, immutable environment object, and passes it through a custom
 * applyMiddleware function before being frozen. Most users won't need the flexibility of custom
 * middleware; prefer cleanEnv() unless you're sure you need it
 *
 * @param environment An object containing your env vars (eg. process.env).
 * @param specs An object that specifies the format of required vars.
 * @param applyMiddleware A function that applies transformations to the cleaned env object
 * @param options An object that specifies options for cleanEnv.
 */
export function customCleanEnv<T, MW>(
  environment: unknown,
  specs: { [K in keyof T]: ValidatorSpec<T[K]> },
  applyMiddleware: (cleaned: T, rawEnv: unknown) => MW,
  options: CleanOptions<T> = {},
): Readonly<MW> {
  const cleaned = getSanitizedEnv(environment, specs, options);
  return Object.freeze(applyMiddleware(cleaned, environment));
}

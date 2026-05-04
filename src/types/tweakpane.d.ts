/**
 * Local Tweakpane 4.x typings.
 *
 * Tweakpane 4.0.5 ships .d.ts files that re-export from `@tweakpane/core`,
 * a package that isn't actually installed (the runtime is bundled).
 * `tsconfig.app.json` redirects "tweakpane" here so we can use the runtime
 * with a clean type surface.
 *
 * Scope: only the Pane API the dev console actually consumes.
 * If T8 brings Tweakpane into the production UI we will widen this.
 */

declare module "tweakpane" {
  export interface BindingChangeEvent<T> {
    value: T;
    last: boolean;
    presetKey: string;
  }

  export interface BindingApi<T> {
    on(event: "change", handler: (ev: BindingChangeEvent<T>) => void): BindingApi<T>;
    refresh(): void;
    dispose(): void;
  }

  export interface BindingParams {
    label?: string;
    readonly?: boolean;
    format?: (v: number) => string;
    options?: Record<string, string>;
    min?: number;
    max?: number;
    step?: number;
  }

  export interface PaneConfig {
    container?: HTMLElement;
    title?: string;
    expanded?: boolean;
  }

  export class Pane {
    constructor(config?: PaneConfig);
    addBinding<O extends object, K extends keyof O & string>(
      object: O,
      key: K,
      params?: BindingParams,
    ): BindingApi<O[K]>;
    refresh(): void;
    dispose(): void;
  }
}

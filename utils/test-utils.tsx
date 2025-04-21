import {
  cleanup,
  render as rtlRender,
  RenderOptions,
} from "@testing-library/react";
import { afterEach } from "vitest";
import AppStateProvider from "~/states/app-context";
import React, { ReactElement } from "react";
import { BrowserRouter as Router } from "react-router-dom";

if (typeof window !== "undefined") {
  // @ts-expect-error hack the react preamble
  window.__vite_plugin_react_preamble_installed__ = true;
}
afterEach(() => {
  cleanup();
});
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) =>
  rtlRender(ui, {
    wrapper: ({ children }) => (
      <Router>
        <AppStateProvider>{children}</AppStateProvider>
      </Router>
    ),
    ...options,
  });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };

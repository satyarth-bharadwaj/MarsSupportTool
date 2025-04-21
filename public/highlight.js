import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("json", json);

export const highlightJSONResponse = (code ) =>
  hljs.highlight(code, { language: "json" }).value;
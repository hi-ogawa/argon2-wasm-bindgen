import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import { render } from "solid-js/web";
import { App } from "./app";

function main() {
  const el = document.querySelector("#root");
  tinyassert(el);
  render(() => <App />, el);
}

main();

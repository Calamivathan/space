import "./ui/styles/global.css";
import { boot } from "@app/boot";

const canvas = document.querySelector<HTMLCanvasElement>("canvas#stage");
const bootEl = document.querySelector<HTMLElement>("[data-boot]");

if (!canvas || !bootEl) {
  throw new Error("Boot failed: required DOM nodes are missing.");
}

const session = boot({ canvas, bootEl });

if (import.meta.hot) {
  import.meta.hot.dispose(() => session.dispose());
}

export const worker = new Worker(new URL("./task.ts", import.meta.url).href, {
  type: "module",
});

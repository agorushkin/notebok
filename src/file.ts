export const file = (path: string) => {
  return fetch(`file://${ Deno.cwd() }/${ path }`)
    .then(async (file) => await file.text())
    .catch(() => null);
}
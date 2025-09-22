import { copyFile, access, constants } from 'fs/promises';

async function main() {
  try {
    await access('out/index.html', constants.F_OK);
    await copyFile('out/index.html', 'out/404.html');
    console.log('404.html generado a partir de index.html');
  } catch {
    console.log('No se generó 404.html (no existe out/index.html todavía).');
  }
}
main();

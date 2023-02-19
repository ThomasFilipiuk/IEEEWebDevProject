import { readFile } from 'fs/promises';
const json = JSON.parse(
  await readFile(
    new URL('./data.json', import.meta.url)
  )
);

console.log(json);
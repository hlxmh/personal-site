import 'server-only'

import Jimp from "jimp";

const ASCII_CHARACTERS = " .,:;i1tfLCG08@";
const ASCII_WIDTH = 45;
const ASCII_HEIGHT = 45;
const CHARACTER_RATIO = 2;
const INTENSITY_STEP = (255 * 4) / (ASCII_CHARACTERS.length - 1);

function renderPixel(image: Jimp, x: number, y: number) {
  const { r, g, b, a } = Jimp.intToRGBA(image.getPixelColor(x, y));
  const characterIndex = Math.round((r + g + b + a) / INTENSITY_STEP);
  const character = ASCII_CHARACTERS[characterIndex].repeat(CHARACTER_RATIO);

  return `<span style="color:rgb(${r},${g},${b})">${character}</span>`;
}

export default async function html_asciify(img: string) {
  const response = await fetch(img);
  if (!response.ok) {
    throw new Error(`Image request failed with status ${response.status}.`);
  }

  const image = await Jimp.read(Buffer.from(await response.arrayBuffer()));
  const cropSize = Math.min(image.bitmap.width, image.bitmap.height);
  const cropX = Math.floor((image.bitmap.width - cropSize) / 2);
  const cropY = Math.floor((image.bitmap.height - cropSize) / 2);
  image.crop(cropX, cropY, cropSize, cropSize);
  image.resize(ASCII_WIDTH, ASCII_HEIGHT);

  const lines = Array.from({ length: ASCII_HEIGHT }, (_, y) => {
    let line = "";
    for (let x = 0; x < ASCII_WIDTH; x += 1) {
      line += renderPixel(image, x, y);
    }
    return line;
  });

  return { __html: lines.join("<br>") };
}

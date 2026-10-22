import 'server-only'

import asciify from "asciify-image";
import Convert from "ansi-to-html";
import Jimp from "jimp";

export default async function html_asciify(img: string) {
  const convert = new Convert();
  const options = {
    fit: "box" as const,
    width: 45,
    height: 45,
  };
  const asciiImage = { __html: "" };
  const response = await fetch(img);
  if (!response.ok) {
    throw new Error(`Image request failed with status ${response.status}.`);
  }

  const sourceImage = await Jimp.read(Buffer.from(await response.arrayBuffer()));
  const cropSize = Math.min(sourceImage.bitmap.width, sourceImage.bitmap.height);
  const cropX = Math.floor((sourceImage.bitmap.width - cropSize) / 2);
  const cropY = Math.floor((sourceImage.bitmap.height - cropSize) / 2);
  sourceImage.crop(cropX, cropY, cropSize, cropSize);

  const croppedImage = await sourceImage.getBufferAsync(Jimp.MIME_JPEG);
  const res = await asciify(croppedImage, options);

  if (typeof res === "string") {
    asciiImage.__html = convert.toHtml(res).replaceAll("\n", "<br>");
  }

  return asciiImage;
}

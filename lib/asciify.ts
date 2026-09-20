import 'server-only'

import asciify from "asciify-image";
import Convert from "ansi-to-html";

export default async function html_asciify(img: string) {
const convert = new Convert();
const options = {
    fit: "box" as const,
    width: 25,
    height: 25,
  };
  const asciiImage = { __html: "" };
  const res = await asciify(img, options);

  if (typeof res === "string") {
    asciiImage.__html = convert.toHtml(res);
  }

  return asciiImage;
}

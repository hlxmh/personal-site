'use server'

import asciify from "asciify-image";
import Convert from "ansi-to-html";
import { revalidatePath } from "next/cache";

export default async function html_asciify(img: string) {
var convert = new Convert();
var options: any = {
    fit: "box",
    width: 20,
    height: 20,
  };
  var ascii_img: any = { __html: "" };
  const res = await asciify(img, options);

  typeof res === "string"
    ? (ascii_img.__html = convert.toHtml(res))
    : (ascii_img = "");

  // i think maybe not needed
  // revalidatePath('/')
  console.log(ascii_img)
  return ascii_img
}

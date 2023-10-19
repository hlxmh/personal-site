'use server'

import asciify from "asciify-image";
import Convert from "ansi-to-html";
import { revalidatePath } from "next/cache";

export default async function Home() {
var convert = new Convert();
var options: any = {
    fit: "box",
    width: 20,
    height: 20,
  };
  // var ascii_img: any = { __html: "<p>some raw html</p>" };


  var ascii_img: any = { __html: "<p>some raw html</p>" };
  const res = await asciify("public/igor.jpg", options);

    // typeof asciified === "string" ? console.log(asciified) : ascii_img = "";
    typeof res === "string"
      ? (ascii_img.__html = '<div class="ascii">' + convert.toHtml(res) + '</div>')
      : (ascii_img = "");

  // asciify("public/igor.jpg", options, function (err, asciified) {
  //   if (err) throw err;

  //   // typeof asciified === "string" ? console.log(asciified) : ascii_img = "";
  //   typeof asciified === "string"
  //     ? (ascii_img.__html = convert.toHtml(asciified))
  //     : (ascii_img = "");
  // });

  // revalidatePath('/')
  console.log(ascii_img)
  return ascii_img
}

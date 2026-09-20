import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import {
  getPostId,
  isSafePostId,
  validatePostMetadata,
} from "./post-utils";

const postsDirectory = path.join(process.cwd(), "posts");
const markdownExtension = ".md";

export type PostSummary = {
  id: string;
  date: string;
  title: string;
};

export type PostData = PostSummary & {
  contentHtml: string;
};

function getMarkdownFileNames() {
  return fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && path.extname(entry.name) === markdownExtension,
    )
    .map((entry) => entry.name);
}

function readPost(fileName: string) {
  const fileContents = fs.readFileSync(
    path.join(postsDirectory, fileName),
    "utf8",
  );
  const parsed = matter(fileContents);

  return {
    content: parsed.content,
    metadata: validatePostMetadata(fileName, parsed.data),
  };
}

export function getSortedPostsData(): PostSummary[] {
  return getMarkdownFileNames()
    .map((fileName) => {
      const id = getPostId(fileName);
      const { metadata } = readPost(fileName);

      return { id, ...metadata };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllPostIds(): Array<{ id: string }> {
  return getMarkdownFileNames().map((fileName) => ({
    id: getPostId(fileName),
  }));
}

export async function getPostData(id: string): Promise<PostData | null> {
  if (!isSafePostId(id)) {
    return null;
  }

  const fileName = `${id}${markdownExtension}`;
  const fullPath = path.join(postsDirectory, fileName);

  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    return null;
  }

  const { content, metadata } = readPost(fileName);
  const processedContent = await remark().use(html).process(content);

  return {
    id,
    contentHtml: processedContent.toString(),
    ...metadata,
  };
}

import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

// Run on Node.js to avoid edge bundle size limits (edge limit = 1MB on free plan)
export const runtime = "nodejs";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { slug: string }; // not a Promise; synchronous params
}) {
  const { slug } = params;

  // Pull only what's needed to keep the function light
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true },
  });

  const title = post?.title ?? slug.replace(/-/g, " ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          fontSize: 64,
          fontWeight: 800,
        }}
      >
        {title}
      </div>
    ),
    { ...size }
  );
}

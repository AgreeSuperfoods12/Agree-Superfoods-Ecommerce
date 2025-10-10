import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";
import { toAbsoluteUrl } from "@/lib/seo";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, coverImage: true },
  });

  const title = post?.title ?? slug.replace(/-/g, " ");
  const bg = post?.coverImage
    ? post.coverImage.startsWith("/")
      ? toAbsoluteUrl(post.coverImage)
      : post.coverImage
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 64,
          justifyContent: "center",
          alignItems: "flex-end",
          background:
            "linear-gradient(135deg, #111827 0%, #1f2937 45%, #111827 100%)",
          position: "relative",
        }}
      >
        {bg ? (
          <img
            src={bg}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.25,
              filter: "blur(2px)",
            }}
          />
        ) : null}

        <div
          style={{
            width: "100%",
            borderRadius: 24,
            background: "rgba(255,255,255,0.08)",
            padding: 40,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 28, fontWeight: 600 }}>
            Phenomena • Blog
          </div>
        </div>
      </div>
    ),
    size
  );
}

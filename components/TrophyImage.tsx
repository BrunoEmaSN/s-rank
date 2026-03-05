"use client";

import { CldImage } from "next-cloudinary";

export interface TrophyImageProps {
  /** Cloudinary public_id, full URL, or legacy emoji/text (fallback) */
  src: string | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

function isImageUrl(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

function isCloudinaryPublicId(src: string): boolean {
  return (
    !src.includes(" ") &&
    !src.startsWith("http") &&
    src.length > 0 &&
    /^[\w/-]+$/.test(src)
  );
}

export function TrophyImage({
  src,
  alt = "Trofeo",
  width = 80,
  height = 80,
  className = "",
}: TrophyImageProps) {
  if (!src?.trim()) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-secondary bg-secondary/30 text-2xl text-foreground-muted ${className}`}
        style={{ width, height }}
        aria-hidden
      >
        🏆
      </div>
    );
  }

  if (isImageUrl(src)) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-lg object-cover ${className}`}
      />
    );
  }

  if (isCloudinaryPublicId(src)) {
    return (
      <CldImage
        src={src}
        width={width}
        height={height}
        alt={alt}
        className={`rounded-lg object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-secondary bg-secondary/30 text-2xl ${className}`}
      style={{ width, height }}
      aria-hidden
    >
      {src}
    </div>
  );
}

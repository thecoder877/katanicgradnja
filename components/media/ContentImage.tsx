import Image from "next/image";
import { cn } from "@/lib/utils";

type ContentImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  radius?: boolean;
};

export function ContentImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  imageClassName,
  radius = true,
}: ContentImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface",
        radius && "rounded-[12px]",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      ) : null}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PreviewDialog } from "@/components/preview-dialog";
import type { GalleryImage } from "@/lib/data";

export function GraphicGallery({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  return (
    <>
      <div className="graphic-gallery">
        {images.map((image, index) => (
          <button
            type="button"
            key={image.src}
            onClick={() => setSelected(image)}
            aria-label={`View ${image.alt}`}
            data-motion-scene
            data-interactive-media
          >
            <div className="graphic-frame">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={800}
                sizes="(max-width: 600px) 44vw, (max-width: 900px) 44vw, 30vw"
              />
              <span>
                <ArrowUpRight size={22} />
              </span>
            </div>
            <span className="graphic-caption">
              {image.alt}
              <small>{String(index + 1).padStart(2, "0")}</small>
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <PreviewDialog title={selected.alt} onClose={() => setSelected(null)}>
          <div className="graphic-full">
            <Image
              src={selected.src}
              alt={selected.alt}
              width={1200}
              height={1200}
              sizes="90vw"
            />
          </div>
        </PreviewDialog>
      )}
    </>
  );
}

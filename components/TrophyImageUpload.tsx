"use client";

import { CldUploadWidget, CldImage } from "next-cloudinary";

/**
 * Requiere en .env.local:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 * - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (opcional; por defecto "trophies")
 * Crear un upload preset sin firmar en el dashboard de Cloudinary para la carpeta de trofeos.
 */
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "trophies";
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export interface TrophyImageUploadProps {
  value: string | null;
  onChange: (urlOrPublicId: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function TrophyImageUpload({
  value,
  onChange,
  onRemove,
  className = "",
}: TrophyImageUploadProps) {
  return (
    <div className={className}>
      {value ? (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-secondary bg-secondary/30">
            {value.startsWith("http") ? (
              <img
                src={value}
                alt="Icono del trofeo"
                className="h-full w-full object-cover"
              />
            ) : (
              <CldImage
                src={value}
                width={80}
                height={80}
                alt="Icono del trofeo"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="flex gap-2">
            <CldUploadWidget
              uploadPreset={UPLOAD_PRESET}
              options={{
                maxFiles: 1,
                maxFileSize: MAX_FILE_SIZE_BYTES,
                resourceType: "image",
                cropping: true,
                croppingAspectRatio: 1,
              }}
              onSuccess={(result) => {
                const info = result?.info as { secure_url?: string; public_id?: string } | undefined;
                if (info?.public_id) {
                  onChange(info.public_id);
                } else if (info?.secure_url) {
                  onChange(info.secure_url);
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="rounded-lg border border-secondary bg-secondary/50 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Cambiar imagen
                </button>
              )}
            </CldUploadWidget>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-500/20 dark:text-red-400"
              >
                Quitar
              </button>
            )}
          </div>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={UPLOAD_PRESET}
          options={{
            maxFiles: 1,
            maxFileSize: MAX_FILE_SIZE_BYTES,
            resourceType: "image",
            cropping: true,
            croppingAspectRatio: 1,
          }}
          onSuccess={(result) => {
            const info = result?.info as { secure_url?: string; public_id?: string } | undefined;
            if (info?.public_id) {
              onChange(info.public_id);
            } else if (info?.secure_url) {
              onChange(info.secure_url);
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-secondary bg-secondary/20 text-foreground-muted transition hover:border-accent hover:bg-secondary/30 hover:text-foreground"
            >
              <span className="text-2xl">+</span>
              <span className="text-xs">Subir imagen</span>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}

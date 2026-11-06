"use client";

/**
 * Renders local attachment preview chips in the AI advisor composer.
 */
import { X } from "lucide-react";
import { AI_COPY } from "@/features/ai-advisor/model/aiContent";

export type ComposerAttachment = {
  id: string;
  name: string;
  kind: "image" | "file";
  previewUrl?: string;
};

type ComposerAttachmentsProps = {
  attachments: readonly ComposerAttachment[];
  onRemove: (id: string) => void;
};

export function ComposerAttachments({
  attachments,
  onRemove,
}: ComposerAttachmentsProps) {
  if (attachments.length === 0) return null;

  return (
    <ul className="aiComposerAttachments">
      {attachments.map((item) => (
        <li key={item.id} className="aiComposerChip">
          {item.previewUrl ? (
            // Local blob preview — next/image cannot optimize object URLs.
            // eslint-disable-next-line @next/next/no-img-element -- blob: preview
            <img src={item.previewUrl} alt="" />
          ) : null}
          <span>{item.name}</span>
          <button
            type="button"
            aria-label={`${AI_COPY.removeFileLabel} ${item.name}`}
            onClick={() => onRemove(item.id)}
          >
            <X size={14} aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}

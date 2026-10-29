"use client";

/**
 * Composer — text, photos, files, and browser voice-to-text.
 * Attachments stay on the device; the message API is text-only.
 */
import { ArrowUp, Image, Mic, Paperclip, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { speechCtor, type SpeechRec } from "@/features/ai-advisor/components/composerSpeech";
import { AI_COPY, AI_MAX_INPUT_CHARS } from "@/features/ai-advisor/model/aiContent";

const MAX_FILES = 4;
const MAX_BYTES = 8 * 1024 * 1024;

type ComposerAttachment = {
  id: string;
  name: string;
  kind: "image" | "file";
  previewUrl?: string;
};

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  pending: boolean;
  disabled?: boolean;
};

export function ChatComposer({
  value,
  onChange,
  onSend,
  pending,
  disabled = false,
}: ChatComposerProps) {
  const composingRef = useRef(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const speechRef = useRef<SpeechRec | null>(null);
  const prefixRef = useRef("");
  const attachmentsRef = useRef<ComposerAttachment[]>([]);
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const canSend = !pending && !disabled && Boolean(value.trim());

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    return () => {
      speechRef.current?.stop();
      for (const item of attachmentsRef.current) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      }
    };
  }, []);

  function addFiles(list: FileList | null, kind: "image" | "file") {
    if (!list?.length) return;
    const incoming = Array.from(list);
    const room = MAX_FILES - attachments.length;
    if (room <= 0) {
      setNote(AI_COPY.tooManyFiles);
      return;
    }
    const next: ComposerAttachment[] = [];
    let message: string = AI_COPY.attachLocal;
    for (const file of incoming) {
      if (next.length >= room) {
        message = AI_COPY.tooManyFiles;
        break;
      }
      if (file.size > MAX_BYTES) {
        message = AI_COPY.fileTooBig;
        continue;
      }
      next.push({
        id: crypto.randomUUID(),
        name: file.name || (kind === "image" ? "Photo" : "File"),
        kind,
        previewUrl: kind === "image" ? URL.createObjectURL(file) : undefined,
      });
    }
    if (next.length === 0) {
      setNote(message);
      return;
    }
    setAttachments((current) => [...current, ...next]);
    setNote(message);
  }

  function removeAttachment(id: string) {
    setAttachments((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  function stopMic() {
    speechRef.current?.stop();
    speechRef.current = null;
    setListening(false);
  }

  function toggleMic() {
    if (listening) {
      stopMic();
      return;
    }
    const Ctor = speechCtor();
    if (!Ctor) {
      setNote(AI_COPY.micUnsupported);
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    prefixRef.current = value.trim();
    recognition.onresult = (event) => {
      let finalText = "";
      let interim = "";
      for (let index = 0; index < event.results.length; index += 1) {
        const chunk = event.results[index][0]?.transcript ?? "";
        if (event.results[index].isFinal) finalText += chunk;
        else interim += chunk;
      }
      const spoken = `${finalText}${interim}`.trim();
      const prefix = prefixRef.current;
      const next = [prefix, spoken].filter(Boolean).join(" ");
      onChange(next.slice(0, AI_MAX_INPUT_CHARS));
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed") setNote(AI_COPY.micDenied);
      else if (event.error === "audio-capture") setNote(AI_COPY.micMissing);
      else if (event.error !== "aborted" && event.error !== "no-speech") {
        setNote(AI_COPY.micUnsupported);
      }
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    speechRef.current = recognition;
    setListening(true);
    setNote(null);
    try {
      recognition.start();
    } catch {
      setListening(false);
      setNote(AI_COPY.micUnsupported);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSend) {
      if (attachments.length > 0) setNote(AI_COPY.attachLocal);
      return;
    }
    stopMic();
    onSend();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    if (composingRef.current || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (!canSend) return;
    stopMic();
    onSend();
  }

  return (
    <form className="aiAdvisorComposer" onSubmit={handleSubmit}>
      <div className="aiComposerTools">
        <button
          type="button"
          className="aiComposerTool"
          aria-label={AI_COPY.galleryLabel}
          disabled={pending || disabled}
          onClick={() => imageRef.current?.click()}
        >
          <Image size={18} aria-hidden />
        </button>
        <button
          type="button"
          className="aiComposerTool"
          aria-label={AI_COPY.filesLabel}
          disabled={pending || disabled}
          onClick={() => fileRef.current?.click()}
        >
          <Paperclip size={18} aria-hidden />
        </button>
      </div>
      <label className="sr-only" htmlFor="ai-advisor-input">
        Message RunRacks AI
      </label>
      <textarea
        id="ai-advisor-input"
        className="aiAdvisorTextarea"
        name="message"
        rows={1}
        value={value}
        maxLength={AI_MAX_INPUT_CHARS}
        placeholder={AI_COPY.placeholder}
        disabled={pending || disabled}
        onChange={(event) => onChange(event.target.value)}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={() => {
          composingRef.current = false;
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="aiComposerActions">
        <button
          type="button"
          className={listening ? "aiComposerTool aiComposerTool--live" : "aiComposerTool"}
          aria-label={listening ? AI_COPY.micStopLabel : AI_COPY.micLabel}
          aria-pressed={listening}
          disabled={pending || disabled}
          onClick={toggleMic}
        >
          <Mic size={18} aria-hidden />
        </button>
        <button
          type="submit"
          className="aiAdvisorSend"
          disabled={!canSend}
          aria-label={pending ? AI_COPY.pendingLabel : AI_COPY.sendLabel}
        >
          <ArrowUp size={18} strokeWidth={2.4} aria-hidden />
        </button>
      </div>
      <input
        ref={imageRef}
        className="aiComposerFileInput"
        type="file"
        accept="image/*"
        multiple
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          addFiles(event.target.files, "image");
          event.target.value = "";
        }}
      />
      <input
        ref={fileRef}
        className="aiComposerFileInput"
        type="file"
        multiple
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          addFiles(event.target.files, "file");
          event.target.value = "";
        }}
      />
      {attachments.length > 0 ? (
        <ul className="aiComposerAttachments">
          {attachments.map((item) => (
            <li key={item.id} className="aiComposerChip">
              {item.previewUrl ? (
                <img src={item.previewUrl} alt="" />
              ) : null}
              <span>{item.name}</span>
              <button
                type="button"
                aria-label={`${AI_COPY.removeFileLabel} ${item.name}`}
                onClick={() => removeAttachment(item.id)}
              >
                <X size={14} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {note ? <p className="aiComposerNote">{note}</p> : null}
    </form>
  );
}

/**
 * Browser speech-to-text. Fills the composer only; audio is not uploaded.
 */

export type SpeechResult = {
  readonly isFinal: boolean;
  readonly 0: { transcript: string };
};

export type SpeechEvent = {
  resultIndex: number;
  results: ArrayLike<SpeechResult>;
};

export type SpeechRec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function speechCtor(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const host = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
}

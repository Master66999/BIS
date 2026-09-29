/**
 * Bhashini-Inspired Multilingual Speech-to-Text & Text-to-Speech Engine
 * Supports Hindi (hi-IN), Marathi (mr-IN), and Indian English (en-IN).
 */

export const LANG_LOCALE_MAP: Record<string, { code: string; label: string; listeningPrompt: string }> = {
  en: {
    code: "en-IN",
    label: "Indian English",
    listeningPrompt: "Listening in English... Speak your question about Indian Standards or BIS certification.",
  },
  hi: {
    code: "hi-IN",
    label: "हिन्दी (Hindi)",
    listeningPrompt: "हिन्दी में सुन रहे हैं... भारतीय मानक, हॉलमार्किंग या ISI मार्क के बारे में पूछें।",
  },
  mr: {
    code: "mr-IN",
    label: "मराठी (Marathi)",
    listeningPrompt: "मराठीत ऐकत आहे... मानक, हॉलमार्किंग किंवा BIS सेवेबद्दल विचारा.",
  },
};

/**
 * Strips markdown and special characters so speech synthesis sounds natural and conversational.
 */
export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/#{1,6}\s?/g, "") // Headings
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/\*(.*?)\*/g, "$1") // Italics
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // Code blocks
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Links
    .replace(/\[Clause\s+[^\]]+\]/gi, "") // Clause brackets
    .replace(/https?:\/\/\S+/g, "") // URLs
    .replace(/•|\*|-|\+/g, " ") // Bullet points
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Speaks text using the browser's native Web Speech Synthesis API.
 * Prioritizes native Indian locale voices.
 */
export function speakText(
  text: string,
  lang: string = "en",
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported in this browser.");
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const clean = cleanTextForSpeech(text);
  if (!clean) return false;

  const targetLocale = LANG_LOCALE_MAP[lang]?.code || "en-IN";
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = targetLocale;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Find best matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) =>
      v.lang.toLowerCase() === targetLocale.toLowerCase() ||
      v.lang.toLowerCase().startsWith(lang.toLowerCase())
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Checks if SpeechRecognition (STT) is supported in the current browser.
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

/**
 * Initializes a SpeechRecognition instance calibrated to the target language.
 */
export function createSpeechRecognizer(
  lang: string = "en",
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (err: any) => void,
  onEnd: () => void
): any {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRec();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = LANG_LOCALE_MAP[lang]?.code || "en-IN";

  recognition.onresult = (event: any) => {
    let interim = "";
    let final = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    onResult(final || interim, Boolean(final));
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}


import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Square,
  Headphones,
} from "lucide-react";

export default function TextToSpeech({
  contentRef,
  title = "Listen to this page",
}) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speed, setSpeed] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const utteranceRef = useRef(null);

  const speechSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window;

  // Load available browser voices
  useEffect(() => {
    if (!speechSupported) return;

    const loadVoices = () => {
      const availableVoices =
        window.speechSynthesis.getVoices();

      setVoices(availableVoices);

      setSelectedVoice((current) => {
        if (current) return current;

        const preferred =
          availableVoices.find(
            (voice) =>
              voice.lang.toLowerCase() === "en-in"
          ) ||
          availableVoices.find((voice) =>
            voice.lang.toLowerCase().startsWith("en")
          ) ||
          availableVoices[0];

        return preferred?.voiceURI || "";
      });
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );
    };
  }, [speechSupported]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  // Get only actual page content
  const getReadableText = () => {
    if (!contentRef?.current) return "";

    const clone = contentRef.current.cloneNode(true);

    // Remove speech controls and explicitly excluded elements
    clone
      .querySelectorAll(
        "[data-tts-ignore], script, style, button, select"
      )
      .forEach((element) => element.remove());

    return clone.innerText
      .replace(/\s+/g, " ")
      .trim();
  };

  // Play / Resume / Restart
  const handlePlay = () => {
    if (!speechSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();

    const text = getReadableText();

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    const voice = voices.find(
      (item) => item.voiceURI === selectedVoice
    );

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "en-IN";
    }

    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      if (
        event.error !== "canceled" &&
        event.error !== "interrupted"
      ) {
        console.error("Text-to-Speech Error:", event.error);
      }

      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);
  };

  // Pause
  const handlePause = () => {
    if (!speechSupported) return;

    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  // Stop
  const handleStop = () => {
    if (!speechSupported) return;

    window.speechSynthesis.cancel();

    utteranceRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
  };

  if (!speechSupported) return null;

  return (
    <section
      data-tts-ignore
      className="sticky top-[16%] md:top-[17.5%] lg:top-[17.5%] xl:top-[19.5%]  z-[10] w-full border-b border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md sm:px-8"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* READER TITLE */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0EC] text-[#E25238]">
            <Headphones size={20} />
          </div>

          <div>
            <p className="text-sm font-bold text-[#263247]">
              {title}
            </p>

            <p className="text-xs text-gray-500">
              {isSpeaking
                ? isPaused
                  ? "Audio paused"
                  : "Reading content..."
                : "Listen instead of reading"}
            </p>
          </div>
        </div>

        {/* READER CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">

          {/* PLAY / RESUME / RESTART */}
          <button
            type="button"
            onClick={handlePlay}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E25238] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c9442d]"
            aria-label="Play or resume reading"
          >
            <Play size={16} fill="currentColor" />

            {isPaused
              ? "Resume"
              : isSpeaking
                ? "Restart"
                : "Listen"}
          </button>

          {/* PAUSE */}
          {isSpeaking && !isPaused && (
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-[#263247] transition hover:bg-gray-100"
            >
              <Pause size={16} />
              <span className="hidden sm:inline">Pause</span>
            </button>
          )}

          {/* STOP */}
          {isSpeaking && (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-[#263247] transition hover:bg-gray-100"
            >
              <Square size={15} />
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}

          {/* VOICE SELECTION */}
          {voices.length > 0 && (
            <select
              value={selectedVoice}
              onChange={(e) =>
                setSelectedVoice(e.target.value)
              }
              disabled={isSpeaking && !isPaused}
              aria-label="Select voice"
              className="hidden max-w-[180px] rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-xs text-[#263247] outline-none focus:border-[#E25238] md:block"
            >
              {voices.map((voice) => (
                <option
                  key={voice.voiceURI}
                  value={voice.voiceURI}
                >
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          )}

          {/* SPEED CONTROL */}
          <select
            value={speed}
            onChange={(e) =>
              setSpeed(Number(e.target.value))
            }
            disabled={isSpeaking && !isPaused}
            aria-label="Reading speed"
            className="hidden rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-xs font-semibold text-[#263247] outline-none focus:border-[#E25238] md:block"
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
          </select>

        </div>
      </div>
    </section>
  );
}

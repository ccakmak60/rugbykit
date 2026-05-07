import { useEffect, useRef } from "react";
import type { AnimationState } from "./animationState";

type SceneAudioOptions = {
  enabled: boolean;
  animationState: AnimationState;
  animationIntensity: number;
};

function useSceneAudio({
  enabled,
  animationState,
  animationIntensity,
}: SceneAudioOptions) {
  const contextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    if (!enabled) {
      gainRef.current?.gain.setTargetAtTime(
        0,
        contextRef.current?.currentTime ?? 0,
        0.08,
      );
      return;
    }

    if (!contextRef.current) {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();

      oscillator.type = "triangle";
      oscillator.frequency.value = 120;
      filter.type = "lowpass";
      filter.frequency.value = 480;
      gain.gain.value = 0;

      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      oscillator.start();

      contextRef.current = context;
      oscillatorRef.current = oscillator;
      gainRef.current = gain;
      filterRef.current = filter;
    }

    const context = contextRef.current;
    const oscillator = oscillatorRef.current;
    const gain = gainRef.current;
    const filter = filterRef.current;

    if (!context || !oscillator || !gain || !filter) return;

    if (context.state === "suspended") {
      void context.resume();
    }

    const now = context.currentTime;
    const targetVolume = 0.008 + animationIntensity * 0.018;
    const targetFrequency =
      animationState === "recover"
        ? 92
        : animationState === "pass"
          ? 146
          : animationState === "run"
            ? 172
            : 116;
    const targetFilter =
      animationState === "recover"
        ? 320
        : animationState === "pass"
          ? 760
          : animationState === "run"
            ? 910
            : 500;

    oscillator.frequency.setTargetAtTime(targetFrequency, now, 0.22);
    filter.frequency.setTargetAtTime(targetFilter, now, 0.24);
    gain.gain.setTargetAtTime(targetVolume, now, 0.2);
  }, [animationIntensity, animationState, enabled]);

  useEffect(() => {
    return () => {
      oscillatorRef.current?.stop();
      oscillatorRef.current?.disconnect();
      filterRef.current?.disconnect();
      gainRef.current?.disconnect();
      contextRef.current?.close();
    };
  }, []);
}

export { useSceneAudio };

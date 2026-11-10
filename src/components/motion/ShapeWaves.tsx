"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DEFAULT_MAX_DPR } from "./shape-waves/constants";
import { mountShapeWavesRenderer } from "./shape-waves/renderer";
import type { ShapeWavesProps, ShapeWavesSettings } from "./shape-waves/types";
export type { ShapeWavesShapes } from "./shape-waves/constants";
export type { ShapeWavesProps } from "./shape-waves/types";

export default function ShapeWaves({
  text = "",
  fontFamily = 'Geist, "Geist Sans", system-ui, sans-serif',
  fontWeight = 500,
  textSize = 0.6,
  shapes = "mixed",
  cellSize = 10,
  dotSize = 0.75,
  color = "#929292",
  hoverColor = "#ffffff",
  backgroundColor = "#000000",
  speed = 1,
  scale = 1,
  contrast = 1,
  brightness = 0.4,
  flow = 0,
  direction = 0,
  fade = 0.25,
  interactive = true,
  splashRadius = 40,
  splashStrength = 0.4,
  glow = 0.35,
  intro = true,
  introDuration = 1.6,
  introKey = 0,
  paused = false,
  maxDpr = DEFAULT_MAX_DPR,
  onError,
  className = "",
}: ShapeWavesProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const settingsRef = useRef<ShapeWavesSettings>(null as unknown as ShapeWavesSettings);
  const applySettingsRef = useRef<() => void>(() => {});
  const applyMaskRef = useRef<() => void>(() => {});
  const onErrorRef = useRef<ShapeWavesProps["onError"]>(onError);

  useLayoutEffect(() => {
    settingsRef.current = {
      text: String(text ?? ""),
      fontFamily,
      fontWeight,
      textSize,
      shapes,
      cellSize: Math.max(2, cellSize),
      dotSize,
      color,
      hoverColor,
      backgroundColor,
      speed,
      scale: Math.max(0.05, scale),
      contrast,
      brightness,
      flow,
      direction,
      fade,
      interactive,
      splashRadius,
      splashStrength,
      glow,
      intro,
      introDuration: Math.max(0.1, introDuration),
      introKey,
      paused,
    };
    onErrorRef.current = onError;
  });

  const settingsSignature = [
    shapes,
    cellSize,
    dotSize,
    color,
    hoverColor,
    backgroundColor,
    speed,
    scale,
    contrast,
    brightness,
    flow,
    direction,
    fade,
    interactive,
    splashRadius,
    splashStrength,
    glow,
    intro,
    introDuration,
    paused,
  ].join("|");
  const maskSignature = [text, fontFamily, fontWeight, textSize].join("|");
  const replayRef = useRef<() => void>(() => {});

  useEffect(() => {
    applySettingsRef.current();
  }, [settingsSignature]);

  useEffect(() => {
    applyMaskRef.current();
  }, [maskSignature]);

  useEffect(() => {
    if (introKey) replayRef.current();
  }, [introKey]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    return mountShapeWavesRenderer({
      root,
      canvas,
      maxDpr,
      settingsRef,
      applySettingsRef,
      applyMaskRef,
      replayRef,
      onErrorRef,
      setReady,
    });
  }, [maxDpr]);

  return (
    <div
      ref={rootRef}
      className={`pointer-events-none relative isolate h-full w-full overflow-hidden ${className}`}
      data-ready={ready}
      style={{ backgroundColor }}
      aria-hidden='true'
    >
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 block h-full w-full transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

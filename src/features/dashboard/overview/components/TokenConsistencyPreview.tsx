"use client";

import { Check } from "lucide-react";
import { type CSSProperties, useRef, useState } from "react";
import type { TokenConsistencyData } from "@/features/findings/public";
import { WaveText } from "@/components/ui/WaveText";

function swatchForeground(value: string) {
  const color = value.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(color)) return "#ffffff";
  const [red, green, blue] = [0, 2, 4].map((index) =>
    Number.parseInt(color.slice(index, index + 2), 16),
  );
  return (red * 299 + green * 587 + blue * 114) / 1000 > 160 ? "#0c0a14" : "#ffffff";
}

export function TokenConsistencyPreview({ data }: { data: TokenConsistencyData }) {
  const initialSelection =
    data.detectedValues.find((value) => !value.isReference) ?? data.detectedValues[0];
  const [selectedId, setSelectedId] = useState(initialSelection?.id);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = data.detectedValues.find((value) => value.id === selectedId) ?? initialSelection;

  if (!selected) return null;

  const selectByIndex = (index: number) => {
    const nextIndex = (index + data.detectedValues.length) % data.detectedValues.length;
    setSelectedId(data.detectedValues[nextIndex].id);
    buttonsRef.current[nextIndex]?.focus();
  };

  return (
    <div className='token-consistency-preview'>
      <div className='token-consistency-reference'>
        <span>Reference token</span>
        <code>{data.tokenName}</code>
        <strong>{data.referenceValue}</strong>
      </div>
      <p className='token-inspection-instruction'>Select a detected value to inspect its source.</p>
      <div
        className='token-swatch-list'
        role='group'
        aria-label={`Detected values for ${data.tokenName}`}
      >
        {data.detectedValues.map((detected, index) => {
          const selectedValue = detected.id === selected.id;
          return (
            <button
              key={detected.id}
              ref={(element) => {
                buttonsRef.current[index] = element;
              }}
              type='button'
              className={`token-swatch${selectedValue ? " is-selected" : ""}`}
              aria-pressed={selectedValue}
              aria-label={`${detected.value}, ${detected.isReference ? "reference value" : "potential mismatch"}. Select to inspect.`}
              title={`Select ${detected.value} to inspect its source`}
              onClick={() => setSelectedId(detected.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  selectByIndex(index + 1);
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  selectByIndex(index - 1);
                }
              }}
            >
              <span
                className='token-swatch-color'
                style={
                  {
                    "--token-color": detected.value,
                    color: swatchForeground(detected.value),
                  } as CSSProperties
                }
              >
                {selectedValue && <Check size={15} strokeWidth={3} aria-hidden='true' />}
              </span>
              <span>
                <WaveText>{detected.value}</WaveText>
              </span>
            </button>
          );
        })}
      </div>
      <div className='token-selected-detail' key={selected.id}>
        <span>Inspecting selected value</span>
        <strong>{selected.value}</strong>
        <code>
          {selected.filePath}
          {selected.line ? `:${selected.line}` : ""}
        </code>
        <small>
          {selected.isReference
            ? "Canonical token definition — inspection only"
            : `Potential mismatch · compare with var(${data.tokenName}). This preview does not change code.`}
        </small>
      </div>
      <p className='token-suggestion'>
        Suggested token reference <code>var({data.tokenName})</code>
      </p>
    </div>
  );
}

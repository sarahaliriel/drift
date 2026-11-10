import { Children, cloneElement, Fragment, isValidElement } from "react";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type WaveTextProps = {
  children: string;
  className?: string;
  duration?: number;
  intensity?: number;
};

type WaveCharacterStyle = CSSProperties & {
  "--character-index": number;
  "--wave-duration": `${number}ms`;
  "--wave-distance": `${number}%`;
};

export function WaveText({ children, className, duration = 420, intensity = 110 }: WaveTextProps) {
  const characters = Array.from(children);

  return (
    <span className={cn("wave-text", className)}>
      <span className='sr-only'>{children}</span>
      <span className='wave-text-visual' aria-hidden='true'>
        {characters.map((character, index) => {
          const style: WaveCharacterStyle = {
            "--character-index": index,
            "--wave-duration": `${duration}ms`,
            "--wave-distance": `${intensity}%`,
          };

          return (
            <span className='wave-character' style={style} key={`${character}-${index}`}>
              <span className='wave-character-current'>
                {character === " " ? "\u00a0" : character}
              </span>
              <span className='wave-character-next'>
                {character === " " ? "\u00a0" : character}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export function renderWaveText(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      return child.length > 0 ? <WaveText>{child}</WaveText> : child;
    }

    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      return cloneElement(child, undefined, renderWaveText(child.props.children));
    }

    return child;
  });
}

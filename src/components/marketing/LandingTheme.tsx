"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type LandingThemeProps = { children: ReactNode };
const LandingThemeContext = createContext(false);

export function useLandingTheme() {
  return useContext(LandingThemeContext);
}

const lightTheme = {
  "--page-bg": "#fdfffb",
  "--page-fg": "#0c0a14",
  "--page-muted": "#625e70",
  "--page-border": "#ddd9e3",
  "--page-border-soft": "#ebe8ef",
  "--page-surface": "#ffffff",
  "--page-surface-secondary": "#f4f2f7",
  "--page-nav-bg": "#ffffff",
  "--page-shadow-color": "rgba(12, 10, 20, 0.08)",
};

const darkTheme = {
  "--page-bg": "#0c0a14",
  "--page-fg": "#fdfffb",
  "--page-muted": "#918c9d",
  "--page-border": "#3c3846",
  "--page-border-soft": "#24212d",
  "--page-surface": "#14111e",
  "--page-surface-secondary": "#1c1827",
  "--page-nav-bg": "#12101a",
  "--page-shadow-color": "rgba(0, 0, 0, 0.32)",
};

/** Theme switches as the Hero leaves the viewport, never per scroll pixel. */
export function LandingTheme({ children }: LandingThemeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef(0);
  const isDarkRef = useRef(false);
  const [isDark, setIsDark] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollY } = useScroll();

  const updateTheme = useCallback((position: number) => {
    const nextIsDark = position >= triggerRef.current;
    if (nextIsDark === isDarkRef.current) return;
    isDarkRef.current = nextIsDark;
    setIsDark(nextIsDark);
  }, []);

  useLayoutEffect(() => {
    const boundary = rootRef.current?.querySelector<HTMLElement>(
      "[data-theme-boundary]",
    );
    if (!boundary) return;

    const measure = () => {
      const rect = boundary.getBoundingClientRect();
      // Begin just before the Hero fully clears the viewport so the following
      // section arrives with its final contrast already in place.
      const leadIn = Math.min(window.innerHeight * 0.08, 96);
      triggerRef.current = window.scrollY + rect.bottom - leadIn;
      updateTheme(window.scrollY);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(boundary);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [updateTheme]);

  useMotionValueEvent(scrollY, "change", updateTheme);

  return (
    <LandingThemeContext.Provider value={isDark}>
      <motion.div
        ref={rootRef}
        className="landing-theme"
        animate={isDark ? darkTheme : lightTheme}
        transition={{
          duration: reduceMotion ? 0.01 : 0.38,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </LandingThemeContext.Provider>
  );
}

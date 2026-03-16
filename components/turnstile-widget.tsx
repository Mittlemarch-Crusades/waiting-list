"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  siteKey: string;
  resetNonce: number;
  onChange: (token: string) => void;
  onError: (message: string) => void;
};

export function TurnstileWidget({
  siteKey,
  resetNonce,
  onChange,
  onError
}: TurnstileWidgetProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onChangeRef.current = onChange;
    onErrorRef.current = onError;
  }, [onChange, onError]);

  useEffect(() => {
    if (!siteKey || !scriptLoaded || !window.turnstile || !containerRef.current || widgetIdRef.current) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "dark",
      size: "flexible",
      callback: (token) => {
        onChangeRef.current(token);
      },
      "error-callback": () => {
        onChangeRef.current("");
        onErrorRef.current("CAPTCHA could not load correctly. Please try again.");
      },
      "expired-callback": () => {
        onChangeRef.current("");
        onErrorRef.current("CAPTCHA expired. Please complete it again.");
      }
    });

    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = null;
    };
  }, [scriptLoaded, siteKey]);

  useEffect(() => {
    if (!resetNonce || !widgetIdRef.current || !window.turnstile) {
      return;
    }

    onChangeRef.current("");
    window.turnstile.reset(widgetIdRef.current);
  }, [resetNonce]);

  if (!siteKey) {
    return null;
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} />
      <p className="mt-3 text-xs uppercase tracking-[0.22em] text-stone-500">
        Protected by Turnstile
      </p>
    </div>
  );
}

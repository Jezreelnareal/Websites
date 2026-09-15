"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme: "dark";
      size: "compact";
      action: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      "timeout-callback": () => void;
      "refresh-expired": "auto";
      "refresh-timeout": "auto";
      "response-field": false;
    },
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileVerification({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("Loading verification…");

  useEffect(() => {
    const api = window.turnstile;
    if (!ready || !siteKey || !container.current || !api) return;
    let active = true;
    const invalidate = (message: string) => {
      if (!active) return;
      onToken("");
      setNotice(message);
    };
    const widget = api.render(container.current, {
      sitekey: siteKey,
      theme: "dark",
      size: "compact",
      action: "contact",
      "response-field": false,
      "refresh-expired": "auto",
      "refresh-timeout": "auto",
      callback: (token) => {
        if (!active) return;
        onToken(token);
        setNotice("Verified. You can send your message.");
      },
      "expired-callback": () =>
        invalidate("Verification expired. Please verify again."),
      "timeout-callback": () =>
        invalidate("Verification timed out. Please try again."),
      "error-callback": () =>
        invalidate(
          "Verification could not complete. Check your connection and try again, or email me directly.",
        ),
    });
    return () => {
      active = false;
      api.remove(widget);
    };
  }, [ready, siteKey, onToken]);

  return (
    <div className="contact-verification">
      <p className="contact-verification-label">Quick verification</p>
      {siteKey && (
        <>
          <Script
            id="contact-turnstile"
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            onReady={() => setReady(true)}
            onError={() => {
              onToken("");
              setNotice(
                "Verification could not load. Please check your connection or email me directly.",
              );
            }}
          />
          <div ref={container} className="contact-verification-widget" />
        </>
      )}
      <p id="contact-verification-status" role="status">
        {siteKey
          ? notice
          : "Verification is currently unavailable. Please email me directly."}
      </p>
    </div>
  );
}

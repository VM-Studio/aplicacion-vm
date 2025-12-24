"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function checkIfRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const dismissed = localStorage.getItem("pwa-install-dismissed");
  if (!dismissed) return false;
  
  const dismissedTime = parseInt(dismissed);
  const dayInMs = 24 * 60 * 60 * 1000;
  return Date.now() - dismissedTime < dayInMs;
}

function checkIfStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // No mostrar si ya está instalada o fue descartada recientemente
    if (checkIfStandalone() || checkIfRecentlyDismissed()) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showInstallPrompt) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        padding: "16px 24px",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        zIndex: 10000,
        maxWidth: "90%",
        width: 400,
        border: "1px solid #e6eaf0",
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4 }}>
          Instalar VM Studio
        </p>
        <p style={{ fontSize: 12, color: "#666" }}>
          Accede más rápido desde tu pantalla de inicio
        </p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleDismiss}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid #e6eaf0",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            color: "#666",
            cursor: "pointer",
          }}
        >
          Ahora no
        </button>
        <button
          onClick={handleInstallClick}
          style={{
            padding: "8px 16px",
            background: "#0049ff",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Instalar
        </button>
      </div>
    </div>
  );
}

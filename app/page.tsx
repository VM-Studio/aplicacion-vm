"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min(100, Math.round((elapsed / 2000) * 100));
      setProgress(percent);
      if (percent >= 100 && intervalRef.current) {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          router.push("/auth");
        }, 200);
      }
    }, 20);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router]);

  // Tamaño de la imagen (ajustable)
  const imageWidth = 280;
  const imageHeight = 140;
  const barHeight = 8;
  const barColor = "#0049ff"; // Azul solicitado

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src="/loading.gif"
        alt="Logo VM Studio"
        width={imageWidth}
        height={imageHeight}
        priority
        style={{ display: "block", margin: "0 auto" }}
      />
      <div style={{ height: 24 }} />
      <div
        style={{
          width: imageWidth,
          height: barHeight,
          background: "#222",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 1px 4px #111",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: barColor,
            transition: "width 0.2s cubic-bezier(.4,1.2,.6,1)",
          }}
        />
      </div>
      <div style={{ color: '#fff', fontSize: 16, marginTop: 8, fontWeight: 500 }}>
        {progress}%
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

function FallingHearts() {
  const [hearts, setHearts] = useState<
    {
      id: number;
      left: number;
      size: number;
      delay: number;
      duration: number;
    }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => {
        const newHeart = {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          size: Math.random() * 16 + 10,
          delay: 0,
          duration: Math.random() * 4 + 4,
        };
        return [...prev.slice(-20), newHeart];
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          style={{
            position: "absolute",
            left: `${h.left}%`,
            top: "-5%",
            fontSize: `${h.size}px`,
            animation: `fallingHeart ${h.duration}s linear forwards`,
            animationDelay: `${h.delay}s`,
            opacity: 0.7,
          }}
        >
          💕
        </span>
      ))}
    </div>
  );
}

export default function ProposalPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => {
      setReady(true);
      video.play().catch(() => {});
    };

    // Хэрэв аль хэдийн ачаалагдсан бол
    if (video.readyState >= 3) {
      onCanPlay();
      return;
    }

    video.addEventListener("canplaythrough", onCanPlay);
    video.load();

    return () => {
      video.removeEventListener("canplaythrough", onCanPlay);
    };
  }, []);

  const handleTap = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
    setTapped(true);
  }, []);

  return (
    <div className="relative w-screen h-dvh" onClick={handleTap}>
      {/* Loading screen */}
      {!ready && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-center">
            <div
              className="text-5xl mb-4"
              style={{ animation: "heartBeat 1.5s infinite" }}
            >
              💕
            </div>
            <p className="text-white/70 text-sm">Түр хүлээнэ үү...</p>
          </div>
        </div>
      )}

      {/* Background Video */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          src="/bg/video.mp4"
        />
        <div className="fixed inset-0 bg-black/30 pointer-events-none" />
      </div>

      <FallingHearts />

      {!tapped && ready && (
        <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
          <p
            className="text-white/80 text-lg"
            style={{
              textShadow: "0 1px 5px rgba(0,0,0,0.5)",
              animation: "pulse 2s infinite",
            }}
          >
            Дэлгэцэн дээр нэг удаа дарна уу 🔊
          </p>
        </div>
      )}

      <div className="relative z-20 flex items-center justify-center w-full h-full px-4 mt-[40vh] pointer-events-none">
        <div
          className="text-center max-w-lg"
          style={{
            animation: "fadeIn 1.2s ease forwards",
          }}
        >
          <p
            className="text-xl md:text-2xl text-white font-bold leading-relaxed"
            style={{
              textShadow: "0 2px 10px rgba(0,0,0,0.7)",
              animation: "fadeInSlideUp 1s ease 0.3s both",
            }}
          >
            ♾️💌
          </p>
          <p
            className="text-base md:text-lg text-white/90 mt-4"
            style={{
              textShadow: "0 1px 5px rgba(0,0,0,0.5)",
              animation: "fadeInSlideUp 1s ease 0.6s both",
            }}
          ></p>
        </div>
      </div>
    </div>
  );
}

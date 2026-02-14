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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  const handleTap = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
  }, []);

  return (
    <div className="relative w-screen h-dvh" onClick={handleTap}>
      {/* Background Video */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/bg/video.mp4"
        />
        <div className="fixed inset-0 bg-black/30 pointer-events-none" />
      </div>

      <FallingHearts />

      <div className="relative z-20 flex items-end justify-center w-full h-full px-4 pt-[15%] pointer-events-none">
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
            Дараа насандаа биш энэ насандаа ХАМТДАА байцгаая ❤️
          </p>
          <p
            className="text-base md:text-lg text-white/90 mt-4"
            style={{
              textShadow: "0 1px 5px rgba(0,0,0,0.5)",
              animation: "fadeInSlideUp 1s ease 0.6s both",
            }}
          >
            Энэ онцгой өдрийг хамтдаа тэмдэглэцгээе!
          </p>
        </div>
      </div>
    </div>
  );
}

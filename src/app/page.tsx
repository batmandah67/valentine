"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const TOTAL_IMAGES = 16;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  gravity: number;
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
}

function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let rockets: Rocket[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "#ff6b9d", "#c44dff", "#ff4d6d", "#ffd700",
      "#ff85a2", "#ff69b4", "#da70d6", "#ff1493",
      "#ffb6c1", "#ff7eb3", "#7b68ee", "#00bfff",
    ];

    const createExplosion = (x: number, y: number, color: string) => {
      const count = 80 + Math.random() * 40;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 5 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.3 ? color : colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1,
          decay: Math.random() * 0.015 + 0.01,
          gravity: 0.04,
        });
      }
    };

    const launchRocket = () => {
      const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      rockets.push({
        x,
        y: canvas.height,
        vy: -(Math.random() * 4 + 8),
        targetY: Math.random() * canvas.height * 0.4 + canvas.height * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      });
    };

    // Launch initial burst
    for (let i = 0; i < 5; i++) {
      setTimeout(() => launchRocket(), i * 200);
    }

    // Keep launching
    const launchInterval = setInterval(() => {
      const count = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        setTimeout(() => launchRocket(), i * 300);
      }
    }, 800);

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update rockets
      rockets = rockets.filter((r) => {
        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        if (r.trail.length > 8) r.trail.shift();

        r.y += r.vy;
        r.x += (Math.random() - 0.5) * 0.5;

        // Draw trail
        r.trail.forEach((t, i) => {
          t.alpha -= 0.12;
          if (t.alpha > 0) {
            ctx.beginPath();
            ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 200, ${t.alpha * 0.5})`;
            ctx.fill();
          }
        });

        // Draw rocket
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 220, 0.9)";
        ctx.fill();

        if (r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color);
          return false;
        }
        return true;
      });

      // Update particles
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color +
          Math.floor(p.alpha * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color +
          Math.floor(p.alpha * 60)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();

        return true;
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(launchInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-15 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

function FallingHearts() {
  const [hearts, setHearts] = useState<
    { id: number; left: number; size: number; delay: number; duration: number }[]
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

function BackgroundSlideshow() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div
        className="flex flex-col"
        style={{
          animation: `scrollDown ${TOTAL_IMAGES * 4}s linear infinite`,
        }}
      >
        {/* Render images twice for seamless loop */}
        {[...Array(2)].map((_, loop) =>
          Array.from({ length: TOTAL_IMAGES }, (_, i) => (
            <div
              key={`${loop}-${i}`}
              className="w-screen shrink-0 bg-cover bg-center"
              style={{
                height: "100vh",
                backgroundImage: `url(/bg/image${String(i + 1).padStart(5, "0")}.jpeg)`,
              }}
            />
          ))
        )}
      </div>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />
    </div>
  );
}

export default function ProposalPage() {
  const [response, setResponse] = useState<"yes" | "no" | null>(null);
  const [noClickCount, setNoClickCount] = useState(0);
  const [noButtonStyle, setNoButtonStyle] = useState<React.CSSProperties>({});
  const [submitted, setSubmitted] = useState(false);

  const handleNo = useCallback(() => {
    setNoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setNoButtonStyle({
          position: "fixed" as const,
          left: `${Math.random() * 60 + 20}%`,
          top: `${Math.random() * 60 + 20}%`,
          transition: "all 0.3s ease",
          zIndex: 50,
        });
      }
      return next;
    });
  }, []);

  if (submitted) {
    return (
      <div className="relative w-screen h-dvh">
        <BackgroundSlideshow />
        <Fireworks />
        <FallingHearts />
        <div className="relative z-20 flex items-center justify-center w-full h-full">
          <div
            className="text-center px-6 py-10 mx-4 rounded-3xl max-w-lg"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.3)",
              animation: "fadeIn 1s ease forwards",
            }}
          >
            <div
              className="text-6xl mb-6"
              style={{ animation: "heartBeat 1.5s infinite" }}
            >
              💖
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              Баярлалаа! 🥰
            </h1>
            <p
              className="text-lg text-white/90 mb-3"
              style={{ textShadow: "0 1px 5px rgba(0,0,0,0.4)" }}
            >
              Чиний хариулт миний зүрхийг жаргаалаа
            </p>
            <p
              className="mt-6 text-white/70 text-sm"
              style={{ animation: "float 3s ease-in-out infinite" }}
            >
              Бид хамтдаа гоё зүйлс бүтээнэ 💫
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-dvh">
      <BackgroundSlideshow />
      <FallingHearts />

      <div className="relative z-20 flex items-center justify-center w-full h-full px-4">
        <div
          className="text-center w-full max-w-md px-6 py-8 md:px-8 md:py-10 rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "fadeIn 1.2s ease forwards",
          }}
        >
          {/* Heart icon */}
          <div
            className="text-5xl mb-4"
            style={{ animation: "heartBeat 1.5s infinite" }}
          >
            💌
          </div>

          {/* Title */}
          <h1
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              animation: "fadeInSlideUp 1s ease 0.3s both",
            }}
          >
            Үерхэх Санал
          </h1>

          {/* Proposal text */}
          <div
            className="my-5"
            style={{ animation: "fadeInSlideUp 1s ease 0.6s both" }}
          >
            <p
              className="text-base md:text-lg text-white/95 leading-relaxed"
              style={{ textShadow: "0 1px 5px rgba(0,0,0,0.4)" }}
            >
              <span className="text-pink-300 font-semibold">
                Дамба-Жанцангийн Болор-Эрдэнэ
              </span>
              -д
            </p>
            <p
              className="text-base md:text-lg text-white/95 leading-relaxed mt-2"
              style={{ textShadow: "0 1px 5px rgba(0,0,0,0.4)" }}
            >
              <span className="text-pink-300 font-semibold">
                Батдоржийн Эрдэнэ-Очир
              </span>{" "}
              албан ёсоор үерхэх санал тавьж байна 💕
            </p>
            <p
              className="text-sm text-white/70 mt-3 italic"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            >
              Чамтай хамт байхыг хүсэж байна...
            </p>
          </div>

          {/* Buttons */}
          <div
            className="flex items-center justify-center gap-4"
            style={{ animation: "fadeInSlideUp 1s ease 0.9s both" }}
          >
            <button
              onClick={() => {
                setResponse("yes");
                setSubmitted(true);
              }}
              className="px-8 py-3 rounded-full text-white font-bold text-base cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #ec4899, #f43f5e, #e11d48)",
                boxShadow: "0 4px 15px rgba(236,72,153,0.5)",
                animation:
                  response === null ? "pulse 2s infinite" : "none",
              }}
            >
              Тийм 💖
            </button>

            <button
              onClick={handleNo}
              className="px-8 py-3 rounded-full text-white/80 font-semibold text-base cursor-pointer transition-all duration-300 hover:bg-white/20"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                ...noButtonStyle,
              }}
            >
              {noClickCount === 0
                ? "Үгүй 😢"
                : noClickCount === 1
                  ? "Итгэлтэй юу? 🥺"
                  : noClickCount === 2
                    ? "Дахиад бодоод? 😭"
                    : "Намайг барьж чадвал 😜"}
            </button>
          </div>

          {noClickCount >= 1 && noClickCount < 3 && (
            <p
              className="mt-3 text-white/60 text-xs"
              style={{ animation: "fadeIn 0.5s ease" }}
            >
              {noClickCount === 1
                ? "Нэг удаа бодоорой... 🥺"
                : "Сүүлийн боломж шүү... 😢"}
            </p>
          )}

          {noClickCount >= 3 && (
            <p
              className="mt-3 text-white/60 text-xs"
              style={{ animation: "fadeIn 0.5s ease" }}
            >
              Үгүй товч зугтчихлаа 😂 Тийм дарна уу!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// ── Particle config ──
const PARTICLE_COUNT = 60;
const GOLD_COLORS = ["#c5a880", "#e8d5b0", "#a07848", "#f5e6c8", "#d4af7a", "#fff0d0", "#c4856a"];

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 10,
    y: 50 + (Math.random() - 0.5) * 10,
    angle: (360 / PARTICLE_COUNT) * i + Math.random() * 20,
    speed: 180 + Math.random() * 350,
    size: 4 + Math.random() * 12,
    color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
    delay: Math.random() * 0.15,
  }));
}

function SparkleParticles({ active }: { active: boolean }) {
  const [particles] = useState(generateParticles);
  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 60 }}>
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.speed;
            const ty = Math.sin(rad) * p.speed;
            return (
              <motion.div
                key={p.id}
                initial={{ x: "50vw", y: "50vh", scale: 1, opacity: 1 }}
                animate={{ x: `calc(50vw + ${tx}px)`, y: `calc(50vh + ${ty}px)`, scale: 0, opacity: 0 }}
                transition={{ duration: 1.2 + Math.random() * 0.8, delay: p.delay, ease: [0.1, 0, 0.3, 1] }}
                style={{
                  position: "absolute", left: 0, top: 0, width: p.size, height: p.size,
                  borderRadius: p.size > 8 ? "50%" : "2px",
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                  rotate: `${Math.random() * 360}deg`,
                }}
              />
            );
          })}
          {/* Flash impact rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border border-[#e8d5b0]"
              style={{ left: "50%", top: "50%", translateX: "-50%", translateY: "-50%", zIndex: 61 }}
              initial={{ width: 0, height: 0, opacity: 1, borderWidth: 10 - i * 2 }}
              animate={{ width: 800 + i * 300, height: 800 + i * 300, opacity: 0, borderWidth: 0 }}
              transition={{ duration: 1.5 + i * 0.3, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export default function AnimateMarriage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const kidsRef = useRef<HTMLDivElement>(null);
  const groomRef = useRef<HTMLDivElement>(null);
  const brideRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  
  const [sparklesActive, setSparklesActive] = useState(false);
  const sparkleTriggered = useRef(false);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // 1. Initial 3D positioning
      gsap.set(groomRef.current, { xPercent: -180, opacity: 0, scale: 0.8, filter: "blur(12px)" });
      gsap.set(brideRef.current, { xPercent: 180, opacity: 0, scale: 0.8, filter: "blur(12px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%", // Long scroll duration for heavy 3D effect
          pin: true,
          scrub: 1, // Smooth scrub
          anticipatePin: 1,
          onUpdate: (self) => {
            // Trigger fireworks exactly at convergence (progress ~ 0.72)
            if (self.progress >= 0.72 && !sparkleTriggered.current) {
              sparkleTriggered.current = true;
              setSparklesActive(true);
              setTimeout(() => setSparklesActive(false), 2500);
            }
            if (self.progress < 0.6) {
              sparkleTriggered.current = false;
            }
          },
        },
      });

      // Heading fades in with extra smoothness
      tl.from(headingRef.current, { opacity: 0, y: -50, scale: 0.95, filter: "blur(5px)", duration: 1.2, ease: "power3.out" }, 0);

      // Stage 1: The Past (Kids photo scales down, blurs, fades)
      tl.to(kidsRef.current, { scale: 0.5, opacity: 0, filter: "blur(30px)", duration: 1.5, ease: "power2.inOut" }, 0.5);

      // Stage 2: The 3D Camera Push (Adults slide in, scale up, sharpen)
      tl.to(groomRef.current, { xPercent: -22, opacity: 1, scale: 1.1, filter: "blur(0px)", duration: 2, ease: "power3.inOut" }, 1.0);
      tl.to(brideRef.current, { xPercent: 22, opacity: 1, scale: 1.1, filter: "blur(0px)", duration: 2, ease: "power3.inOut" }, 1.0);

      // Stage 3: The Final Stance (Standing Together)
      tl.to(groomRef.current, { xPercent: 15, scale: 1.15, duration: 1.5, ease: "power2.inOut" }, 3.0);
      tl.to(brideRef.current, { xPercent: -15, scale: 1.15, duration: 1.5, ease: "power2.inOut" }, 3.0);

      // Foreground Depth Layer Parallax (Moves much faster to simulate depth of field)
      gsap.to(foregroundRef.current, {
        yPercent: -60,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 0.5,
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-[#f9f6f0]">
      {/* Background Subtle Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-[1]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
      }} />

      <div ref={headingRef} className="absolute top-[8%] left-0 w-full flex flex-col items-center justify-center text-center z-20 px-4" style={{ willChange: "transform, opacity, filter" }}>
        <h3 className="text-[#c5a880] text-[clamp(2.5rem,5vw,3.5rem)] mb-2 drop-shadow-sm" style={{ fontFamily: "'Scheherazade New',serif" }}>
          مَا شَاءَ ٱللَّٰهُ
        </h3>
        <h2 className="font-serif text-[#2c2416] text-[clamp(2.2rem,5vw,4.5rem)] italic font-medium drop-shadow-md leading-tight">
          These kids are getting married...
        </h2>
        <div className="flex items-center gap-4 mt-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c5a880]"></div>
          <p className="font-sans text-[0.65rem] tracking-[0.35em] text-[#a07848] uppercase drop-shadow-sm">
            A Journey of Love & Blessings
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c5a880]"></div>
        </div>
      </div>

      {/* STAGE 1: Childhood Photo */}
      <div ref={kidsRef} className="absolute inset-0 flex items-center justify-center z-10 pt-[15vh]">
        <div className="relative w-[clamp(240px,35vw,420px)] aspect-[3/4] rounded-[30px] overflow-hidden shadow-2xl border-[3px] border-[#c5a880]/50">
          <img src="/kids.png" alt="Childhood Past" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* STAGE 2: Adult Characters (Groom and Bride) */}
      <div ref={groomRef} className="absolute inset-y-0 left-0 w-1/2 flex items-end justify-center z-[15] pb-[5vh]">
        <img src="/groom.png" alt="Groom" className="w-[clamp(180px,35vw,450px)] h-auto object-contain drop-shadow-[15px_15px_40px_rgba(44,36,22,0.3)]" />
      </div>
      <div ref={brideRef} className="absolute inset-y-0 right-0 w-1/2 flex items-end justify-center z-[15] pb-[5vh]">
        <img src="/bride.png" alt="Bride" className="w-[clamp(180px,35vw,450px)] h-auto object-contain drop-shadow-[-15px_15px_40px_rgba(44,36,22,0.3)]" />
      </div>


      {/* FOREGROUND DEPTH LAYER: Fast-scrolling floral overlay without face-blur */}
      <div ref={foregroundRef} className="absolute -inset-[10%] pointer-events-none z-50 flex items-center justify-center"
           style={{ transformOrigin: "center center" }}>
        <div className="w-full h-full opacity-[0.35]" 
             style={{ 
               backgroundImage: 'url("/floral-border.png")', 
               backgroundSize: 'cover', 
               backgroundPosition: 'center',
             }} />
      </div>

      {/* FIREWORKS / SPARKLES */}
      <SparkleParticles active={sparklesActive} />
    </section>
  );
}

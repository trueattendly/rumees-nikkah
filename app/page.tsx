"use client";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Heart, ExternalLink, Music, VolumeX } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import AnimateMarriage from "@/components/AnimateMarriage";
import Lenis from "lenis";

import { ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, InputLabel, FormControl, Button, IconButton, Fab, Paper, Card, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

gsap.registerPlugin(ScrollTrigger);

const theme = createTheme({
  palette: {
    primary: {
      main: '#a07848',
      light: '#c5a880',
      dark: '#6b5a3e',
      contrastText: '#fff8ee',
    },
    secondary: {
      main: '#2c2416',
    },
    background: {
      default: '#f9f6f0',
      paper: '#fff8ee',
    },
    text: {
      primary: '#2c2416',
      secondary: '#6b5a3e',
    },
  },
  typography: {
    fontFamily: "'Jost', sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 248, 238, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: 24,
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid rgba(197, 168, 128, 0.3)',
          boxShadow: '0 8px 32px rgba(44, 36, 22, 0.05)',
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 32,
          backgroundColor: '#f9f6f0',
          border: '1px solid rgba(197, 168, 128, 0.4)',
          backgroundImage: 'none',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
        }
      }
    }
  }
});

/* ─── Global smooth-scroll ticker (Lenis + GSAP integration) ─────────── */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);
}

/* ─── 1. Cinematic Loading Screen ───────────────────────── */
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useGSAP(() => {
    document.body.style.overflow = 'hidden';
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        setVisible(false);
        onComplete();
      }
    });
    
    tl.fromTo(".loader-logo", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" })
      .to(".loader-logo", { opacity: 0, y: -30, duration: 0.8, delay: 0.8, ease: "power2.in" })
      .to(".loader-bg", { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "-=0.3");
      
    return () => { document.body.style.overflow = ''; }
  }, []);

  if (!visible) return null;

  return (
    <div className="loader-bg fixed inset-0 z-[999] bg-[#f9f6f0] flex items-center justify-center">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div className="loader-logo">
        <svg viewBox="0 0 320 80" width="280" height="80">
          <text x="160" y="52" textAnchor="middle" fontSize="44" fill="#c5a880" style={{ fontFamily: "'Scheherazade New',serif" }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</text>
        </svg>
      </div>
    </div>
  );
}

/* ─── 2. Floating Audio Player ──────────────────────────── */
function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoplayAttempted = useRef(false);

  useEffect(() => {
    if (autoplayAttempted.current) return;
    autoplayAttempted.current = true;

    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          const handleFirstInteraction = async () => {
            if (audioRef.current) {
              try {
                await audioRef.current.play();
                setIsPlaying(true);
              } catch (e) { console.log(e); }
            }
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('scroll', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
          };
          window.addEventListener('click', handleFirstInteraction);
          window.addEventListener('scroll', handleFirstInteraction, { once: true });
          window.addEventListener('touchstart', handleFirstInteraction, { once: true });
        }
      }
    };
    playAudio();
  }, []);

  const toggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <audio ref={audioRef} src="/bgm.mp3" loop />
      <button onClick={toggle} className="w-12 h-12 rounded-full bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgba(44,36,22,0.1)] border border-[#c5a880]/40 flex items-center justify-center text-[#a07848] transition-transform hover:scale-110">
        {isPlaying ? <Music size={18} className="animate-[spin_4s_linear_infinite]" /> : <VolumeX size={18} />}
      </button>
    </div>
  );
}

/* ─── 3. Dynamic RSVP Modal (MUI Integration) ───────────── */
function RSVPModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("1");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formspreeEndpoint = "https://formspree.io/f/YOUR_FORM_ID_HERE"; 
    try {
      if (formspreeEndpoint !== "https://formspree.io/f/YOUR_FORM_ID_HERE") {
        await fetch(formspreeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, guests })
        });
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
      setSent(true);
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 4, pb: 2, textAlign: 'center', fontFamily: "'Great Vibes', cursive", fontSize: "2.8rem", color: "#2c2416" }}>
        {sent ? "" : "RSVP"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#a07848',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 4, pt: 0 }}>
        {sent ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">🤍</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", color: "#2c2416" }}>JazakAllah Khair!</h3>
            <p style={{ fontFamily: "'Jost',sans-serif", color: "#a07848", marginTop: 8 }}>Your RSVP has been received. May Allah bless you.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-5 mt-2">
            <TextField 
              required 
              label="Your Name" 
              value={name} 
              onChange={e => setName(e.target.value)}
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.5)' } }}
            />
            <FormControl fullWidth variant="outlined" color="primary">
              <InputLabel>Number of Guests</InputLabel>
              <Select
                value={guests}
                onChange={e => setGuests(e.target.value)}
                label="Number of Guests"
                sx={{ borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.5)' }}
              >
                {["1","2","3","4","5+"].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
              </Select>
            </FormControl>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={loading}
              sx={{ py: 2, mt: 2, background: "linear-gradient(135deg,#c5a880,#a07848)", boxShadow: "0 10px 20px rgba(160,120,72,0.3)" }}
            >
              {loading ? "Confirming..." : "Confirm Attendance"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── Hero section ──────────────────────────────────────── */
function HeroSection({ isLoaded }: { isLoaded: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "+=100%", scrub: 1 } });
    tl.to(titleRef.current, { scale: 1.25, opacity: 0, filter: "blur(10px)", ease: "none" });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden paper-texture" style={{ paddingTop: "5vh" }}>
      <img src="/floral-border.png" alt="" aria-hidden className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ opacity: 0.45, zIndex: 1 }} />
      <div ref={titleRef} className="relative flex flex-col items-center text-center px-6" style={{ zIndex: 10, opacity: isLoaded ? 1 : 0 }}>
        
        {isLoaded && (
          <>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, ease: "easeOut" }} className="mb-6 bismillah-glow">
              <svg viewBox="0 0 320 80" style={{ width: "clamp(200px,40vw,320px)", height: "auto" }} aria-label="Bismillah">
                <defs>
                  <linearGradient id="bismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c5a880" /><stop offset="50%" stopColor="#e8d5b0" /><stop offset="100%" stopColor="#a07848" />
                  </linearGradient>
                </defs>
                <text x="160" y="52" textAnchor="middle" fontSize="44" fill="url(#bismGrad)" style={{ fontFamily: "'Scheherazade New',serif" }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</text>
              </svg>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1.2 }}
              style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.7rem", letterSpacing: "0.35em", color: "#a07848", textTransform: "uppercase", marginBottom: "1rem" }}>
              Save the Date
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1 }}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1rem,2vw,1.3rem)", color: "#6b5a3e", marginBottom: "0.5rem" }}>
              Welcome to the Nikkah of
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 1.2 }}
              style={{ fontFamily: "'Great Vibes',cursive", fontSize: "clamp(2.8rem,8vw,6rem)", color: "#2c2416", lineHeight: 1.05, marginBottom: "0.2rem" }}>
              Muhammed Nizamudheen
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 0.8 }}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.2rem,3vw,2rem)", color: "#a07848", letterSpacing: "0.1em" }}>
              &amp;
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: 1.2 }}
              style={{ fontFamily: "'Great Vibes',cursive", fontSize: "clamp(2.8rem,8vw,6rem)", color: "#2c2416", lineHeight: 1.05, marginBottom: "1.5rem" }}>
              Rumeeza V V
            </motion.h1>

            <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 2.2, duration: 1 }} className="gold-divider w-full max-w-sm mb-5">
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "#a07848", fontStyle: "italic" }}>
                23 July 2026 · Thursday
              </span>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.9rem,1.8vw,1.15rem)", color: "#6b5a3e", fontStyle: "italic", maxWidth: 480, lineHeight: 1.8 }}>
              Cordially invite you to grace the occasion of their Nikkah and bless the couple.
            </motion.p>

            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="mt-12 flex flex-col items-center gap-1" style={{ color: "#c5a880" }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</span>
              <svg width="20" height="26" viewBox="0 0 20 26" fill="none">
                <path d="M10 4 L10 18 M6 14 L10 18 L14 14" stroke="#c5a880" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

/* ─── 4. Elegant Countdown Timer ────────────────────────── */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    // Target Date: July 23, 2026 at 11:30 AM
    const target = new Date("2026-07-23T11:30:00").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) return clearInterval(interval);
      
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8 my-10 countdown-el">
      {Object.entries(timeLeft).map(([label, val]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-[24px] flex items-center justify-center bg-white/40 backdrop-blur-md shadow-lg border border-[#c5a880]/30 transition-transform hover:scale-105">
            <span className="font-serif text-[1.8rem] sm:text-[2.5rem] lg:text-[3rem] text-[#2c2416] font-medium tracking-tight">
              {val.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="font-sans text-[0.65rem] tracking-[0.25em] text-[#a07848] uppercase mt-4">
            {label === 'd' ? 'Days' : label === 'h' ? 'Hours' : label === 'm' ? 'Mins' : 'Secs'}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── 3D QR Scanner Card (MUI) ────────────────────────────────── */
function QRScannerCard({ title, subtitle, link }: { title: string, subtitle: string, link: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 16;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -16;
    el.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateZ(10px) scale(1.02)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)";
  };

  return (
    <Card 
      ref={ref} 
      component="a" 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      onMouseMove={handleMove} 
      onMouseLeave={handleLeave}
      className="qr-card block group will-change-transform"
      sx={{
        textDecoration: 'none',
        display: 'block',
        position: 'relative',
        p: 4,
        overflow: 'visible',
        transition: 'transform 0.3s ease-out',
        background: 'rgba(255, 248, 238, 0.5)',
        backdropFilter: 'blur(10px)',
        '&:hover .gradient-bg': { opacity: 1 },
      }}
    >
      <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-[#c5a880]/10 to-transparent rounded-[24px] opacity-0 transition-opacity duration-500" />
      <CardContent sx={{ p: 0, position: 'relative', zIndex: 2 }}>
        <h3 className="text-center font-serif text-[1.4rem] font-bold text-[#2c2416] mb-1">{title}</h3>
        <p className="text-center font-sans text-[0.65rem] tracking-[0.2em] text-[#a07848] uppercase mb-6">{subtitle}</p>
        
        <Paper elevation={0} sx={{ borderRadius: 4, p: 2, mx: 'auto', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e8d5b0', position: 'relative', backgroundColor: 'white' }}>
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#c5a880]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#c5a880]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#c5a880]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#c5a880]" />
          <QRCodeSVG 
            value={link} 
            size={120} 
            fgColor="#2c2416" 
            bgColor="#ffffff" 
            level="M" 
            className="group-hover:scale-105 transition-transform duration-500"
          />
        </Paper>
        
        <p className="text-center text-[0.7rem] text-[#6b5a3e] mt-6 font-sans tracking-wide leading-relaxed">
          Scan or Click to Navigate<br/>via Google Maps
        </p>
      </CardContent>
    </Card>
  );
}

/* ─── Details Timeline Section (MUI) ──────────────────────────── */
function DetailsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".details-heading", { opacity: 0, y: 30, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 80%", once: true } });
    gsap.from(".countdown-el", { opacity: 0, y: 30, duration: 1, delay: 0.3, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 80%", once: true } });
    
    gsap.from(".timeline-item", {
      opacity: 0, x: -30, stagger: { amount: 0.5, ease: "power2.out" },
      duration: 1.0, ease: "expo.out",
      scrollTrigger: { trigger: ".timeline-container", start: "top 75%", once: true },
    });

    gsap.from(".qr-card", {
      opacity: 0, scale: 0.9, y: 40, stagger: 0.3,
      duration: 1.2, ease: "back.out(1.2)",
      scrollTrigger: { trigger: ".qr-container", start: "top 80%", once: true },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative paper-texture overflow-hidden" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <img src="/floral-border.png" alt="" aria-hidden className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ opacity: 0.35, zIndex: 1 }} />
      <div className="relative max-w-6xl mx-auto px-6 lg:px-12" style={{ zIndex: 10 }}>
        
        {/* Section Header & Countdown */}
        <div className="text-center mb-16 details-heading">
          <p className="font-sans text-[0.65rem] tracking-[0.35em] text-[#a07848] uppercase mb-2">The Details</p>
          <h2 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-[#2c2416] italic">A Day of Blessings</h2>
          <div className="gold-divider mt-4 max-w-xs mx-auto"><Heart size={14} color="#c5a880" fill="#c5a880" /></div>
          
          <CountdownTimer />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7 timeline-container flex flex-col justify-center">
            <div className="relative pl-8 md:pl-12 border-l border-dashed border-[#c5a880]/50 space-y-16 py-6">
              
              <div className="relative timeline-item">
                <div className="absolute -left-[37px] md:-left-[53px] top-8 w-[10px] h-[10px] rounded-full bg-[#c5a880] shadow-[0_0_12px_#c5a880]" />
                <Paper elevation={0} className="p-6 md:p-8" sx={{ border: '1px solid rgba(197, 168, 128, 0.2)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={16} className="text-[#a07848]" />
                    <span className="font-serif text-xl font-semibold text-[#2c2416]">11:30 AM</span>
                  </div>
                  <h3 className="font-serif text-3xl text-[#a07848] italic mb-3">Nikkah</h3>
                  <p className="font-sans text-[0.85rem] text-[#6b5a3e] leading-relaxed max-w-md">
                    <strong>Cheruvannur Vadakke Juma Masjid</strong><br/>Kolathara
                  </p>
                </Paper>
              </div>

              <div className="relative timeline-item">
                <div className="absolute -left-[37px] md:-left-[53px] top-8 w-[10px] h-[10px] rounded-full bg-[#c5a880] shadow-[0_0_12px_#c5a880]" />
                <Paper elevation={0} className="p-6 md:p-8" sx={{ border: '1px solid rgba(197, 168, 128, 0.2)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={16} className="text-[#a07848]" />
                    <span className="font-serif text-xl font-semibold text-[#2c2416]">12:30 PM</span>
                  </div>
                  <h3 className="font-serif text-3xl text-[#a07848] italic mb-3">Wedding Lunch</h3>
                  <p className="font-sans text-[0.85rem] text-[#6b5a3e] leading-relaxed max-w-md">
                    <strong>We One Auditorium</strong><br/>Cheruvannur
                  </p>
                </Paper>
              </div>

              <div className="relative timeline-item">
                <div className="absolute -left-[37px] md:-left-[53px] top-8 w-[10px] h-[10px] rounded-full bg-[#c5a880] shadow-[0_0_12px_#c5a880]" />
                <Paper elevation={0} className="p-6 md:p-8" sx={{ border: '1px solid rgba(197, 168, 128, 0.2)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={16} className="text-[#a07848]" />
                    <span className="font-serif text-xl font-semibold text-[#2c2416]">Same Date (July 23, 2026)</span>
                  </div>
                  <h3 className="font-serif text-3xl text-[#a07848] italic mb-3">Reception & Engagement</h3>
                  <p className="font-sans text-[0.85rem] text-[#6b5a3e] leading-relaxed max-w-md">
                    <strong>Hall Alankar Auditorium</strong><br/>Under Flyover, Mathottam, Meenchanda
                  </p>
                </Paper>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 qr-container flex flex-col sm:flex-row lg:flex-col gap-6 justify-center items-center">
            <div className="w-full max-w-[320px]">
              <QRScannerCard 
                title="Nikkah Venue" subtitle="Vadakke Juma Masjid, Kolathara"
                link="https://maps.app.goo.gl/Pkt7myNwG7vmXrXZA"
              />
            </div>
            <div className="w-full max-w-[320px]">
              <QRScannerCard 
                title="Wedding Lunch" subtitle="We One Auditorium, Cheruvannur"
                link="https://www.google.com/maps/place/We+One+Auditorium,+Kolathara/@11.1951646,75.8283184,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba65a6d4345e907:0x83b4ad8930b4439f!8m2!3d11.1951593!4d75.8308933!16s%2Fg%2F11dxm7p71z?entry=ttu&g_ep=EgoyMDI2MDcwNS4wIKXMDSoASAFQAw%3D%3D"
              />
            </div>
            <div className="w-full max-w-[320px]">
              <QRScannerCard 
                title="Reception Venue" subtitle="Alankar Auditorium, Meenchanda"
                link="https://www.google.com/maps/place/ALANKAR+AUDITORIUM/@11.2116398,75.7945212,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba659c7768c9d71:0xe48bb7eddf6f3d27!8m2!3d11.2116398!4d75.7970961!16s%2Fg%2F11fm2n_ylt?entry=ttu&g_ep=EgoyMDI2MDcwNS4wIKXMDSoASAFQAw%3D%3D"
              />
            </div>
          </div>
        </div>

        {/* Family Tree Section */}
        <div className="family-section mt-24">
          <div className="text-center mb-10">
            <p className="font-sans text-[0.65rem] tracking-[0.35em] text-[#a07848] uppercase">With the Blessings of Our Families</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Paper elevation={0} className="family-card flex flex-col items-center text-center gap-2 p-8" sx={{ border: "1px solid rgba(197,168,128,0.3)" }}>
              <p className="font-sans text-[0.65rem] tracking-[0.3em] text-[#a07848] uppercase">Groom</p>
              <p className="font-script text-[2.2rem] text-[#2c2416]">Muhammed Nizamudheen C</p>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#c5a880] to-transparent my-1" />
              <p className="font-sans text-[0.8rem] text-[#6b5a3e] leading-relaxed">Son of<br/>Mr. Abdul Razak Chonari<br/>& Mrs. Naseema Melath</p>
            </Paper>
            <Paper elevation={0} className="family-card flex flex-col items-center text-center gap-2 p-8" sx={{ border: "1px solid rgba(197,168,128,0.3)" }}>
              <p className="font-sans text-[0.65rem] tracking-[0.3em] text-[#a07848] uppercase">Bride</p>
              <p className="font-script text-[2.2rem] text-[#2c2416]">Rumeeza V V</p>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#c5a880] to-transparent my-1" />
              <p className="font-sans text-[0.8rem] text-[#6b5a3e] leading-relaxed">Daughter of<br/>Mr. Sabeer VV<br/>& Mrs. Kamarunnisa T</p>
            </Paper>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Announcement & Footer Section ─────────────────────── */
function AnnouncementSection({ onRSVP }: { onRSVP: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(".announce-el", { opacity: 0, y: 55, stagger: { amount: 0.6, ease: "power2.out" }, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 72%", once: true } });
  }, { scope: ref });

  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nikkah+of+Nizamudheen+%26+Rumeeza&dates=20260723T060000Z/20260723T100000Z&details=Nikkah+at+Cheruvannur+Vadakke+Juma+Masjid%2C+Kolathara.+Lunch+at+We+One+Auditorium%2C+Cheruvannur.&location=Cheruvannur+Vadakke+Juma+Masjid%2C+Kolathara`;

  return (
    <section ref={ref} className="relative paper-texture overflow-hidden" style={{ paddingTop: "7rem", paddingBottom: "8rem" }}>
      <img src="/floral-border.png" alt="" aria-hidden className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ opacity: 0.4, zIndex: 1 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(197,168,128,0.12) 0%, transparent 70%)", zIndex: 2 }} />

      <div className="relative max-w-3xl mx-auto px-6 text-center" style={{ zIndex: 10 }}>
        <div className="announce-el">
          <p className="font-sans text-[0.65rem] tracking-[0.35em] text-[#a07848] uppercase mb-2">Alhamdulillah · With the blessings of Allah</p>
        </div>
        <div className="announce-el">
          <h2 className="font-script text-[clamp(3rem,8vw,5.5rem)] text-[#2c2416] leading-none">Nikkah Announcement!</h2>
        </div>
        <div className="announce-el gold-divider max-w-xs mx-auto my-8"><Heart size={14} color="#c5a880" fill="#c5a880" /></div>

        <Paper elevation={0} className="announce-el my-10 px-8 py-10 relative" sx={{ border: '1px solid rgba(197, 168, 128, 0.35)', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
          {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
            <span key={i} className={`absolute ${pos} text-[#c5a880] text-base`}>✦</span>
          ))}
          <p className="font-serif text-[clamp(1.1rem,2.5vw,1.6rem)] text-[#3a2e20] italic leading-relaxed mb-3">"And We created you in pairs."</p>
          <p className="font-sans text-[0.72rem] tracking-[0.25em] text-[#a07848] uppercase">— Qur&apos;an 78:8</p>
        </Paper>

        <div className="announce-el">
          <p className="font-serif text-[clamp(1rem,2vw,1.3rem)] text-[#6b5a3e] italic leading-relaxed mb-10">May Allah bless the couple with love, mercy and a blessed life together.</p>
        </div>

        <div className="announce-el flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={onRSVP} id="rsvp-button"
            variant="contained"
            color="primary"
            sx={{
              px: 5, py: 2,
              background: "linear-gradient(135deg,#c5a880,#a07848)",
              boxShadow: "0 8px 30px rgba(160,120,72,0.35)",
              transition: "all 0.3s ease",
              '&:hover': {
                transform: "scale(1.04)",
                boxShadow: "0 12px 40px rgba(160,120,72,0.5)"
              }
            }}>
            RSVP — Join Us
          </Button>

          <Button href={calUrl} target="_blank" rel="noopener noreferrer" id="add-to-calendar-button"
            variant="outlined"
            sx={{
              px: 4, py: 2,
              border: "1.5px solid rgba(197, 168, 128, 0.6)",
              color: "#a07848",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(4px)",
              transition: "all 0.3s ease",
              '&:hover': {
                transform: "scale(1.04)",
                backgroundColor: "rgba(255, 248, 238, 0.9)",
                borderColor: "rgba(197, 168, 128, 0.8)"
              }
            }}>
            <Calendar size={16} className="mr-2" /> Add to Calendar <ExternalLink size={13} className="ml-2" />
          </Button>
        </div>

        <div className="announce-el mt-16 pt-10 border-t border-[#c5a880]/25">
          <p className="font-serif text-base text-[#a07848] italic">23 · 07 · 2026</p>
          <p className="font-script text-[1.8rem] text-[#2c2416] mt-1">Nizamudheen &amp; Rumeeza</p>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function Page() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Initialize Lenis Smooth Scroll
  useSmoothScroll();

  return (
    <ThemeProvider theme={theme}>
      <main>
        <LoadingScreen onComplete={() => setPageLoaded(true)} />
        <AudioPlayer />
        <HeroSection isLoaded={pageLoaded} />
        {pageLoaded && (
          <>
            <AnimateMarriage />
            <DetailsSection />
            <AnnouncementSection onRSVP={() => setRsvpOpen(true)} />
            <RSVPModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
            
            {/* Floating RSVP Button */}
            <Fab 
              color="primary" 
              variant="extended" 
              onClick={() => setRsvpOpen(true)}
              sx={{ 
                position: 'fixed', 
                bottom: 24, 
                left: 24, 
                zIndex: 100,
                background: "linear-gradient(135deg,#c5a880,#a07848)",
                boxShadow: "0 8px 30px rgba(160,120,72,0.4)",
                fontFamily: "'Jost', sans-serif",
                letterSpacing: "0.2em",
                padding: "0 24px",
                transition: "transform 0.3s ease",
                '&:hover': {
                  transform: "scale(1.05)"
                }
              }}
            >
              RSVP
            </Fab>
          </>
        )}
      </main>
    </ThemeProvider>
  );
}

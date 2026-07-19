"use client";
import { ThemeProvider, createTheme, Paper, Button, Box } from "@mui/material";
import { Calendar, Clock, MapPin, ExternalLink, ArrowLeft, Heart } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { motion } from "framer-motion";

const theme = createTheme({
  palette: {
    primary: {
      main: "#a07848",
      light: "#c5a880",
      dark: "#6b5a3e",
      contrastText: "#fff8ee",
    },
    secondary: {
      main: "#2c2416",
    },
    background: {
      default: "#f9f6f0",
      paper: "#fff8ee",
    },
    text: {
      primary: "#2c2416",
      secondary: "#6b5a3e",
    },
  },
  typography: {
    fontFamily: "'Jost', sans-serif",
  },
});

export default function NikkahLocationPage() {
  const mapLink = "https://maps.app.goo.gl/qvWJoKtur7vSH8Dd9";

  return (
    <ThemeProvider theme={theme}>
      <main className="min-h-screen relative paper-texture overflow-hidden py-12 px-6 flex flex-col items-center justify-center">
        {/* Decorative Background Borders */}
        <img
          src="/floral-border.png"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ opacity: 0.3, zIndex: 1 }}
        />

        <div className="relative max-w-2xl w-full mx-auto" style={{ zIndex: 10 }}>
          {/* Back Navigation */}
          <div className="mb-8">
            <Link href="/" passHref legacyBehavior>
              <Button
                component="a"
                startIcon={<ArrowLeft size={16} />}
                sx={{
                  color: "#a07848",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.85rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  "&:hover": {
                    backgroundColor: "rgba(197, 168, 128, 0.15)",
                  },
                }}
              >
                Back to Invitation
              </Button>
            </Link>
          </div>

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <p className="font-sans text-[0.65rem] tracking-[0.35em] text-[#a07848] uppercase mb-2">
              Ceremony Location
            </p>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,3.5rem)] text-[#2c2416] italic leading-tight">
              Nikkah Venue
            </h1>
            <div className="gold-divider mt-4 max-w-xs mx-auto">
              <Heart size={14} color="#c5a880" fill="#c5a880" />
            </div>
          </motion.div>

          {/* Nikkah Venue Details & QR Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Paper
              elevation={0}
              className="p-8 md:p-10 flex flex-col justify-between"
              sx={{
                border: "1px solid rgba(197, 168, 128, 0.35)",
                backgroundColor: "rgba(255, 248, 238, 0.85)",
                backdropFilter: "blur(12px)",
                borderRadius: "28px",
                boxShadow: "0 16px 40px rgba(44, 36, 22, 0.06)",
              }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
                  <MapPin className="text-[#a07848]" size={20} />
                  <span className="font-sans text-[0.65rem] tracking-[0.25em] text-[#a07848] uppercase">
                    Venue Details
                  </span>
                </div>

                <h2 className="font-serif text-3xl md:text-4xl text-[#2c2416] italic mb-6 text-center sm:text-left">
                  Cheruvannur Vadakke Juma Masjid
                </h2>

                <div className="space-y-4 mb-8 max-w-md">
                  <div className="flex items-center gap-3 text-[#6b5a3e]">
                    <Clock size={18} className="shrink-0" />
                    <span className="font-sans text-[0.9rem] font-medium">11:30 AM (IST)</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#6b5a3e]">
                    <Calendar size={18} className="shrink-0" />
                    <span className="font-sans text-[0.9rem] font-medium">Thursday, July 23, 2026</span>
                  </div>
                  <div className="flex gap-3 text-[#6b5a3e]">
                    <MapPin size={18} className="shrink-0 mt-0.5" />
                    <p className="font-sans text-[0.9rem] leading-relaxed">
                      Kolathara, Cheruvannur,<br />Kozhikode, Kerala, India
                    </p>
                  </div>
                </div>
              </div>

              <Box className="flex flex-col sm:flex-row items-center gap-8 pt-6 border-t border-dashed border-[#c5a880]/30">
                {/* QR Code Container */}
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block text-center"
                >
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      p: 2,
                      width: 120,
                      height: 120,
                      display: "flex",
                      alignItems: "center",
                      justify: "center",
                      border: "1px solid rgba(197, 168, 128, 0.3)",
                      backgroundColor: "white",
                      transition: "box-shadow 0.3s ease, transform 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(160,120,72,0.15)",
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <QRCodeSVG
                      value={mapLink}
                      size={98}
                      fgColor="#2c2416"
                      bgColor="#ffffff"
                      level="M"
                    />
                  </Paper>
                </a>

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-serif text-lg text-[#2c2416] italic mb-1">Navigation Assistance</h4>
                  <p className="font-sans text-[0.78rem] text-[#6b5a3e] mb-5 leading-relaxed">
                    Scan the QR code with your mobile camera or click the button below to navigate directly to the mosque.
                  </p>
                  <Button
                    component="a"
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    startIcon={<ExternalLink size={14} />}
                    sx={{
                      backgroundColor: "#a07848",
                      color: "#fff8ee",
                      borderRadius: "12px",
                      py: 1.25,
                      px: 4,
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontFamily: "'Jost', sans-serif",
                      boxShadow: "0 4px 12px rgba(160,120,72,0.2)",
                      "&:hover": {
                        backgroundColor: "#8c663b",
                        boxShadow: "0 6px 16px rgba(160,120,72,0.3)",
                      },
                    }}
                  >
                    Open In Google Maps
                  </Button>
                </div>
              </Box>
            </Paper>
          </motion.div>
        </div>
      </main>
    </ThemeProvider>
  );
}

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

        <div className="relative max-w-4xl w-full mx-auto" style={{ zIndex: 10 }}>
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
            className="text-center mb-12"
          >
            <p className="font-sans text-[0.65rem] tracking-[0.35em] text-[#a07848] uppercase mb-2">
              The Blessed Union
            </p>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,4rem)] text-[#2c2416] italic leading-tight">
              Nikkah Location
            </h1>
            <div className="gold-divider mt-4 max-w-xs mx-auto">
              <Heart size={14} color="#c5a880" fill="#c5a880" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Left Column: Groom & Bride Portraits */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-between gap-6"
            >
              {/* Groom Card */}
              <Paper
                elevation={0}
                className="p-6 flex items-center gap-6"
                sx={{
                  border: "1px solid rgba(197, 168, 128, 0.35)",
                  backgroundColor: "rgba(255, 248, 238, 0.65)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "24px",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 30px rgba(160,120,72,0.1)",
                  },
                }}
              >
                <div className="relative shrink-0 w-24 h-24 rounded-full overflow-hidden border-2 border-[#c5a880]">
                  <img
                    src="/groom.jpg"
                    alt="Muhammed Nizamudheen C"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-sans text-[0.65rem] tracking-[0.25em] text-[#a07848] uppercase block mb-1">
                    Groom
                  </span>
                  <h3 className="font-serif text-2xl text-[#2c2416] font-medium leading-tight">
                    Muhammed Nizamudheen C
                  </h3>
                  <p className="font-sans text-[0.75rem] text-[#6b5a3e] mt-1">
                    Son of Mr. Abdul Razak Chonari & Mrs. Naseema Melath
                  </p>
                </div>
              </Paper>

              {/* Bride Card */}
              <Paper
                elevation={0}
                className="p-6 flex items-center gap-6"
                sx={{
                  border: "1px solid rgba(197, 168, 128, 0.35)",
                  backgroundColor: "rgba(255, 248, 238, 0.65)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "24px",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 30px rgba(160,120,72,0.1)",
                  },
                }}
              >
                <div className="relative shrink-0 w-24 h-24 rounded-full overflow-hidden border-2 border-[#c5a880]">
                  <img
                    src="/bride.jpg"
                    alt="Rumeeza V V"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-sans text-[0.65rem] tracking-[0.25em] text-[#a07848] uppercase block mb-1">
                    Bride
                  </span>
                  <h3 className="font-serif text-2xl text-[#2c2416] font-medium leading-tight">
                    Rumeeza V V
                  </h3>
                  <p className="font-sans text-[0.75rem] text-[#6b5a3e] mt-1">
                    Daughter of Mr. Sabeer VV & Mrs. Kamarunnisa T
                  </p>
                </div>
              </Paper>
            </motion.div>

            {/* Right Column: Nikkah Venue Details & QR */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full"
            >
              <Paper
                elevation={0}
                className="p-8 h-full flex flex-col justify-between"
                sx={{
                  border: "1px solid rgba(197, 168, 128, 0.35)",
                  backgroundColor: "rgba(255, 248, 238, 0.85)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "28px",
                }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="text-[#a07848]" size={20} />
                    <span className="font-sans text-[0.65rem] tracking-[0.25em] text-[#a07848] uppercase">
                      Nikkah Ceremony
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl text-[#2c2416] italic mb-4">
                    Cheruvannur Vadakke Juma Masjid
                  </h2>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-[#6b5a3e]">
                      <Clock size={16} />
                      <span className="font-sans text-[0.85rem]">11:30 AM (IST)</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#6b5a3e]">
                      <Calendar size={16} />
                      <span className="font-sans text-[0.85rem]">Thursday, July 23, 2026</span>
                    </div>
                    <p className="font-sans text-[0.85rem] text-[#6b5a3e] pl-7 leading-relaxed">
                      Kolathara, Cheruvannur,<br />Kozhikode, Kerala, India
                    </p>
                  </div>
                </div>

                <Box className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-dashed border-[#c5a880]/30">
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
                        borderRadius: 3,
                        p: 1.5,
                        width: 110,
                        height: 110,
                        display: "flex",
                        alignItems: "center",
                        justify: "center",
                        border: "1px solid rgba(197, 168, 128, 0.3)",
                        backgroundColor: "white",
                        transition: "box-shadow 0.3s ease, transform 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(160,120,72,0.15)",
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      <QRCodeSVG
                        value={mapLink}
                        size={90}
                        fgColor="#2c2416"
                        bgColor="#ffffff"
                        level="M"
                      />
                    </Paper>
                  </a>

                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-sans text-[0.75rem] text-[#6b5a3e] mb-4">
                      Scan or click the button below to navigate directly using Google Maps.
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
                        py: 1,
                        px: 3,
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
        </div>
      </main>
    </ThemeProvider>
  );
}

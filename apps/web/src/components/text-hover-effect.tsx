
"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

export const TextHoverEffect = ({
  text,
  duration = 0.3,
  glowIntensity = 0.8,
  sparkleCount = 15,
  lightBeamCount = 6,
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const [sparkles, setSparkles] = useState([]);
  const [lightBeams, setLightBeams] = useState([]);
  const glowControls = useAnimation();

  // Generate dynamic sparkles
  const generateSparkles = useCallback(() => {
    return Array.from({ length: sparkleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.8 + 0.4,
      delay: Math.random() * 2,
      duration: Math.random() * 1.5 + 1,
    }));
  }, [sparkleCount]);

  // Generate light beams
  const generateLightBeams = useCallback(() => {
    return Array.from({ length: lightBeamCount }, (_, i) => ({
      id: i,
      angle: (360 / lightBeamCount) * i,
      length: Math.random() * 30 + 20,
      width: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      delay: Math.random() * 0.5,
    }));
  }, [lightBeamCount]);

  useEffect(() => {
    setSparkles(generateSparkles());
    setLightBeams(generateLightBeams());
  }, [generateSparkles, generateLightBeams]);

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${Math.max(0, Math.min(100, cxPercentage))}%`,
        cy: `${Math.max(0, Math.min(100, cyPercentage))}%`,
      });
    }
  }, [cursor]);

  useEffect(() => {
    if (hovered) {
      glowControls.start({
        scale: [1, 1.05, 1],
        filter: [
          "brightness(1) saturate(1)",
          `brightness(${1 + glowIntensity * 0.3}) saturate(${1 + glowIntensity * 0.5})`,
          "brightness(1) saturate(1)"
        ],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      });
    } else {
      glowControls.stop();
      glowControls.set({ scale: 1, filter: "brightness(1) saturate(1)" });
    }
  }, [hovered, glowControls, glowIntensity]);

  const handleMouseMove = useCallback((e) => {
    setCursor({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ minHeight: "200px" }}
    >
      {/* Ambient background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 0.1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: hovered ?
            "radial-gradient(circle at center, rgba(255, 215, 0, 0.2) 0%, rgba(255, 140, 0, 0.1) 30%, transparent 70%)" :
            "transparent"
        }}
      />

      {/* Dynamic sparkles */}
      <AnimatePresence>
        {hovered && sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-full h-full"
              style={{
                background: "radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 140, 0, 0.7) 50%, transparent 100%)",
                borderRadius: "50%",
                boxShadow: "0 0 6px rgba(255, 215, 0, 0.8)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 400 120"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        className="select-none cursor-pointer"
        animate={glowControls}
      >
        <defs>
          {/* Enhanced lighting gradient */}
          <radialGradient id="lightingGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="20%" stopColor="#FFA500" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FF8C00" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FF6347" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#FF4500" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#DC143C" stopOpacity="0.5" />
          </radialGradient>

          {/* Dynamic reveal mask with smoother transitions */}
          <motion.radialGradient
            id="revealMask"
            gradientUnits="userSpaceOnUse"
            r="25%"
            animate={maskPosition}
            transition={{
              duration: duration,
              ease: "easeOut",
              type: "spring",
              stiffness: 200,
              damping: 25
            }}
          >
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="40%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </motion.radialGradient>

          {/* Glow filters for enhanced lighting effects */}
          <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feGaussianBlur stdDeviation="10" result="strongBlur" />
            <feMerge>
              <feMergeNode in="strongBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <mask id="textMask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
          </mask>

          {/* Light beam gradients */}
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 215, 0, 0)" />
            <stop offset="50%" stopColor="rgba(255, 215, 0, 0.6)" />
            <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
          </linearGradient>
        </defs>

        {/* Light beams emanating from center */}
        <g opacity={hovered ? 0.4 : 0} style={{ transition: "opacity 0.5s ease" }}>
          {lightBeams.map((beam) => (
            <motion.line
              key={beam.id}
              x1="50%"
              y1="50%"
              x2={`${50 + Math.cos((beam.angle * Math.PI) / 180) * beam.length}%`}
              y2={`${50 + Math.sin((beam.angle * Math.PI) / 180) * beam.length}%`}
              stroke="url(#beamGradient)"
              strokeWidth={beam.width}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{
                opacity: [0, beam.opacity, 0],
                pathLength: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: beam.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>

        {/* Base text with subtle stroke animation */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth="0.5"
          className="font-bold fill-transparent text-5xl"
          style={{
            fontFamily: "'Orbitron', 'Helvetica', sans-serif",
            stroke: hovered ? "rgba(255, 215, 0, 0.3)" : "rgba(156, 163, 175, 0.5)"
          }}
          initial={{ strokeDashoffset: 2000, strokeDasharray: 2000 }}
          animate={{
            strokeDashoffset: 0,
            strokeDasharray: 2000,
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>

        {/* Enhanced reveal text with dynamic lighting */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="url(#lightingGradient)"
          strokeWidth="0.8"
          mask="url(#textMask)"
          filter={hovered ? "url(#strongGlow)" : "url(#textGlow)"}
          className="font-bold fill-transparent text-5xl"
          style={{
            fontFamily: "'Orbitron', 'Helvetica', sans-serif",
          }}
          animate={{
            strokeWidth: hovered ? [0.8, 1.2, 0.8] : 0.8,
          }}
          transition={{
            duration: 1.5,
            repeat: hovered ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>

        {/* Filled text for extra glow effect */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="url(#lightingGradient)"
          mask="url(#textMask)"
          filter="url(#textGlow)"
          className="font-bold text-5xl"
          style={{
            fontFamily: "'Orbitron', 'Helvetica', sans-serif",
            opacity: hovered ? 0.7 : 0
          }}
          animate={{
            opacity: hovered ? [0.7, 0.9, 0.7] : 0,
          }}
          transition={{
            duration: 2,
            repeat: hovered ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>
      </motion.svg>

      {/* Corner accent lights */}
      <AnimatePresence>
        {hovered && (
          <>
            <motion.div
              className="absolute top-2 left-2 w-3 h-3 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)",
                boxShadow: "0 0 10px rgba(255, 215, 0, 0.6)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.5, 1],
                scale: [0, 1, 0.8, 1]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-2 right-2 w-3 h-3 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(255, 140, 0, 0.8) 0%, transparent 70%)",
                boxShadow: "0 0 10px rgba(255, 140, 0, 0.6)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.5, 1],
                scale: [0, 1, 0.8, 1]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

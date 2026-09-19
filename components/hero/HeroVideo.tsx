"use client";

/**
 * KS Digital Studio — hero showreel.
 *
 * The poster paints immediately; the video file is only fetched once the hero
 * is actually near the viewport, so it never competes with first paint. The
 * treatment (rounded frame, inner vignette, soft blue spill, slow reveal) is
 * what stops it reading as "a video embedded in a page" — the edges melt into
 * the background instead of sitting in a hard rectangle.
 *
 * Behaviour:
 *   prefers-reduced-motion → poster only, video never loads
 *   narrow viewport        → the 854×480 encode instead of 1280×720
 *   autoplay refused       → poster stays, silently (no broken play button)
 */

import { useEffect, useRef, useState } from "react";

const DESKTOP_SRC = "/video/ks-studio.mp4";
const MOBILE_SRC = "/video/ks-studio-mobile.mp4";
const POSTER = "/video/ks-studio-poster.webp";
const POSTER_MOBILE = "/video/ks-studio-poster-mobile.webp";

export default function HeroVideo({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [revealed, setRevealed] = useState(false); // play the reveal once, on mount
  const [playing, setPlaying] = useState(false); // first frame painted
  const [poster, setPoster] = useState(POSTER);

  useEffect(() => {
    const host = hostRef.current;
    const video = videoRef.current;
    if (!host) return;

    setRevealed(true);

    const mqSmall = window.matchMedia("(max-width: 767px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPoster(mqSmall.matches ? POSTER_MOBILE : POSTER);

    let loaded = false;
    let inView = false;
    const load = () => {
      if (loaded || !video || mqReduce.matches) return;
      loaded = true;
      // assign the source only now — nothing is fetched before this point
      video.src = mqSmall.matches ? MOBILE_SRC : DESKTOP_SRC;
      video.load();
      // muted autoplay can still be refused (low-power mode); that is fine,
      // the poster simply stays put
      video.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (entry.isIntersecting) load();
        else video?.pause();
        if (entry.isIntersecting && video && video.paused && loaded) {
          video.play().catch(() => {});
        }
      },
      // start fetching slightly before it scrolls in
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(host);

    const onVis = () => {
      if (!video || !loaded) return;
      if (document.visibilityState === "hidden") video.pause();
      else if (inView) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={hostRef}
      className={`group relative ${className}`}
      // decorative: the headline beside it carries the meaning
      aria-hidden
    >
      {/* soft blue spill behind the frame, so it sits in the page rather than on it */}
      <div
        className={`pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_45%,rgba(79,123,255,0.28),rgba(5,7,13,0)_70%)] blur-xl transition-opacity duration-[1400ms] ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#05070D] shadow-[0_40px_120px_-40px_rgba(79,123,255,0.55)] ${
          revealed ? "animate-hero-reveal" : ""
        }`}
      >
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          poster={poster}
          preload="none"
          muted
          loop
          playsInline
          // iOS Safari needs both of these to autoplay inline without controls
          autoPlay
          disablePictureInPicture
          onPlaying={() => setPlaying(true)}
        />

        {/* poster stand-in: shown until the first video frame is actually painted,
            and permanently for reduced-motion / refused-autoplay */}
        <img
          src={poster}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-0" : "opacity-100"
          }`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        {/* inner vignette — melts the edges into the page */}
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_28px_rgba(5,7,13,0.85)]" />
        {/* bottom scrim, so the frame hands off to the section background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-[#05070D]/70" />
        {/* one slow highlight sweep on reveal — the only effect over the footage */}
        <div
          className={`pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-[2200ms] ease-out ${
            playing ? "translate-x-[420%]" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}

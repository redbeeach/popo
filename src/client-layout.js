"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Menu from "./components/Menu/Menu";
import TransitionProvider from "./providers/TransitionProvider";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 1000;

// lenis scroll easing curve
const LENIS_EASING = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

// shared lenis config for mobile and desktop
const LENIS_SHARED = {
  easing: LENIS_EASING,
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  infinite: false,
  wheelMultiplier: 1,
  orientation: "vertical",
  smoothWheel: true,
  syncTouch: true,
  autoRaf: false,
};

// lenis settings tuned for mobile viewports
const LENIS_MOBILE = {
  ...LENIS_SHARED,
  duration: 0.8,
  smoothTouch: true,
  touchMultiplier: 1.5,
  lerp: 0.09,
};

// lenis settings tuned for desktop viewports
const LENIS_DESKTOP = {
  ...LENIS_SHARED,
  duration: 1.2,
  smoothTouch: false,
  touchMultiplier: 2,
  lerp: 0.1,
};

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const pageRef = useRef(null);
  const pageWrapperRef = useRef(null);
  const noiseRef = useRef(null);
  const lenisRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  // kill scroll triggers on route change before unmount
  useLayoutEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  // track mobile vs desktop breakpoint on resize
  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // sync lenis smooth scroll with gsap ticker and scrolltrigger
  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    let scrollCleanup;

    const connectLenis = () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;

      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);
      scrollCleanup = () => lenis.off("scroll", onScroll);
      ScrollTrigger.refresh();
    };

    connectLenis();
    const retryId = window.setTimeout(connectLenis, 0);

    return () => {
      window.clearTimeout(retryId);
      gsap.ticker.remove(update);
      scrollCleanup?.();
    };
  }, []);

  const lenisOptions = isMobile ? LENIS_MOBILE : LENIS_DESKTOP;

  useEffect(() => {
    const noise = noiseRef.current;
    if (!noise) return;

    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let rafId = 0;

    function animateNoise() {
      current.x += (target.x - current.x) * 0.075;
      current.y += (target.y - current.y) * 0.075;
      noise.style.setProperty("--noise-x", `${current.x.toFixed(2)}px`);
      noise.style.setProperty("--noise-y", `${current.y.toFixed(2)}px`);
      rafId = requestAnimationFrame(animateNoise);
    }

    function handlePointerMove(event) {
      const x = (event.clientX / window.innerWidth - 0.5) * 42;
      const y = (event.clientY / window.innerHeight - 0.5) * 42;
      target.x = x;
      target.y = y;
    }

    function handlePointerLeave() {
      target.x = 0;
      target.y = 0;
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);
    rafId = requestAnimationFrame(animateNoise);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  // app shell with smooth scroll, menu, and page transitions
  return (
    <ReactLenis root ref={lenisRef} options={lenisOptions}>
      <div className="page" ref={pageRef}>
        <div className="noise-overlay" ref={noiseRef} />
        <Menu />
        <TransitionProvider>
          <div className="page-wrapper" ref={pageWrapperRef}>
            {children}
          </div>
        </TransitionProvider>
      </div>
    </ReactLenis>
  );
}

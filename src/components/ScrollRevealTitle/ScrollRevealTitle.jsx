"use client";

import "./ScrollRevealTitle.css";

import { useRef } from "react";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function ScrollRevealTitle({
  children,
  className = "",
  trigger = null,
  start = "top 75%",
  end = "bottom 45%",
}) {
  const titleRef = useRef(null);

  useGSAP(
    () => {
      const title = titleRef.current;
      if (!title) return;

      const triggerElement =
        (trigger && document.querySelector(trigger)) || title;

      const split = SplitText.create(title, {
        type: "chars",
        mask: "chars",
        charsClass: "scroll-reveal-char",
      });

      gsap.set(split.chars, {
        yPercent: 115,
        opacity: 0,
        rotateX: -38,
        transformOrigin: "50% 100%",
      });

      const tween = gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        ease: "none",
        stagger: 0.035,
        scrollTrigger: {
          trigger: triggerElement,
          start,
          end,
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      };
    },
    { dependencies: [trigger, start, end] },
  );

  return (
    <h2 ref={titleRef} className={`scroll-reveal-title ${className}`}>
      {children}
    </h2>
  );
}

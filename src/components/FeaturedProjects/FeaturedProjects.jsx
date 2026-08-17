"use client";

import "./FeaturedProjects.css";

import { useLayoutEffect, useRef, useState } from "react";

import Fluorescent from "@/components/Fluorescent/Fluorescent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Copy from "../Copy/Copy";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "RARE Dermatology",
    type: "GB5 / PHP / MYSQL",
    year: "2026",
    image: "/featured-work/pr_img01.webp",
    url: "/brief",
  },
  {
    title: "forward Dermatology",
    type: "GB5 / PHP / MYSQL",
    year: "2025",
    image: "/featured-work/pr_img02.webp",
    url: "/brief",
  },
  {
    title: "HealHouse Community",
    type: "GB5 / PHP / MYSQL",
    year: "2025",
    image: "/featured-work/pr_img03.webp",
    url: "/brief",
  },
  {
    title: "AX SEO Manager",
    type: "NEXT.JS / SUPABASE",
    year: "2026",
    image: "/featured-work/featured-work-4.jpg",
    url: "/brief",
  },
  {
    title: "Clinic Booking System",
    type: "GB5 / PHP / MYSQL",
    year: "2025",
    image: "/featured-work/featured-work-2.jpg",
    url: "/brief",
  },
  {
    title: "Medical Landing Kit",
    type: "GB5 / PHP / MYSQL",
    year: "2024",
    image: "/featured-work/featured-work-3.jpg",
    url: "/brief",
  },
  {
    title: "SEO Automation Lab",
    type: "NEXT.JS / SUPABASE",
    year: "2026",
    image: "/featured-work/featured-work-4.jpg",
    url: "/brief",
  },
];

export default function FeaturedProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const previewRef = useRef(null);
  const imageRefs = useRef([]);
  const itemRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const preview = previewRef.current;
    if (!section || !preview) return;

    const kicker = section.querySelector(".fp-projects-kicker");
    const items = itemRefs.current.filter(Boolean);

    gsap.set(preview, {
      autoAlpha: 0,
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 72,
      scale: 0.96,
    });
    gsap.set(kicker, { autoAlpha: 0, y: 34 });
    gsap.set(items, { autoAlpha: 0, y: 70 });
    gsap.set(
      items.map((item) => item.querySelector(".fp-project-title")),
      { yPercent: 24 },
    );
    gsap.set(imageRefs.current, { autoAlpha: 0, scale: 1.08 });
    gsap.set(imageRefs.current[0], { autoAlpha: 1, scale: 1 });

    const entryTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 72%",
        once: true,
      },
    });

    entryTimeline
      .to(kicker, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
      })
      .to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.09,
        },
        0.08,
      )
      .to(
        items.map((item) => item.querySelector(".fp-project-title")),
        {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.09,
        },
        0.08,
      )
      .to(
        preview,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.05,
          ease: "power4.out",
        },
        0.28,
      );

    const handleMove = (event) => {
      const rect = preview.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(preview, {
        rotateY: x * 14,
        rotateX: y * -10,
        x: x * 24,
        y: y * 18,
        scale: 1.025,
        duration: 0.45,
        ease: "power3.out",
      });
    };

    const handleLeave = () => {
      gsap.to(preview, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    preview.addEventListener("mousemove", handleMove);
    preview.addEventListener("mouseleave", handleLeave);

    return () => {
      entryTimeline.scrollTrigger?.kill();
      entryTimeline.kill();
      preview.removeEventListener("mousemove", handleMove);
      preview.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  function activateProject(index) {
    if (index === activeIndex) return;

    setActiveIndex(index);

    imageRefs.current.forEach((image, imageIndex) => {
      if (!image) return;
      gsap.to(image, {
        autoAlpha: imageIndex === index ? 1 : 0,
        scale: imageIndex === index ? 1 : 1.08,
        duration: 0.55,
        ease: "power3.out",
      });
    });

    const item = itemRefs.current[index];
    if (item) {
      gsap.fromTo(
        item.querySelector(".fp-project-title"),
        { x: -16 },
        { x: 0, duration: 0.45, ease: "power3.out" },
      );
    }
  }

  const activeProject = projects[activeIndex];

  return (
    <section className="fp-projects" ref={sectionRef}>
      <Fluorescent className="fp-projects-glow" />

      <div className="fp-projects-inner">
        <div className="fp-projects-list" aria-label="Selected projects">
          <p className="mono fp-projects-kicker">Selected Works</p>

          {projects.map((project, index) => (
            <a
              className={`fp-project-item${activeIndex === index ? " is-active" : ""}`}
              href={project.url}
              key={project.title}
              onFocus={() => activateProject(index)}
              onMouseEnter={() => activateProject(index)}
              ref={(el) => (itemRefs.current[index] = el)}
            >
              <span className="mono fp-project-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="fp-project-title">{project.title}</span>
              <span className="mono fp-project-year">{project.year}</span>
            </a>
          ))}
        </div>

        <a className="fp-preview" href={activeProject.url} ref={previewRef}>
          <div className="fp-browser-bar">
            <span />
            <span />
            <span />
            <p className="mono">{activeProject.type}</p>
          </div>

          <div className="fp-preview-screen">
            {projects.map((project, index) => (
              <img
                alt={project.title}
                key={project.title}
                ref={(el) => (imageRefs.current[index] = el)}
                src={project.image}
              />
            ))}
          </div>
        </a>
      </div>

      <div className="fp-inline-footer">
        <div className="fp-inline-footer-content">
          <Copy trigger=".fp-inline-footer" start="top 82%" end="top 42%">
            <p className="mono">Establish Contact</p>
          </Copy>
          <Copy
            trigger=".fp-inline-footer"
            start="top 82%"
            end="top 36%"
            type="lines"
          >
            <h2 className="type-2">
              From First Page To Final Deploy,
              <br />
              I Build What Holds Up
            </h2>
          </Copy>
        </div>

        <div className="fp-inline-footer-bar">
          <Copy trigger=".fp-inline-footer" start="top 72%" end="top 38%">
            <p className="mono">2026 Yunhongbi Portfolio</p>
          </Copy>
          <Copy trigger=".fp-inline-footer" start="top 72%" end="top 38%">
            <p className="mono">Developed By Yunhongbi</p>
          </Copy>
        </div>
      </div>
    </section>
  );
}

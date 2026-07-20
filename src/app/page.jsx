"use client";

import "./home.css";

import BlindingLight from "@/components/BlindingLight/BlindingLight";
import Copy from "@/components/Copy/Copy";
import FeaturedProjects from "@/components/FeaturedProjects/FeaturedProjects";
import Fluorescent from "@/components/Fluorescent/Fluorescent";
import Footer from "@/components/Footer/Footer";
import Preloader, { isInitialLoad } from "@/components/Preloader/Preloader";
import Team from "@/components/Team/Team";

// home page — hero, manifesto, featured work, team, footer
export default function Home() {
  return (
    <>
      <Preloader />

      <section className="hero">
        <Fluorescent />

        <div className="hero-content">
          <Copy animateOnScroll={false} delay={isInitialLoad ? 4.85 : 0.75}>
            <div className="container">
              <p>INTERACTIVE</p>
              <p>WEB PUBLISHER</p>
            </div>
          </Copy>
        </div>

        <div className="hero-footer">
          <div className="container">
            <Copy animateOnScroll={false} delay={isInitialLoad ? 4.85 : 0.75}>
              <p>
                GNUBOARD5 • PHP • MYSQL • NEXT.JS • GSAP 

                Creating Interactive Web Experiences.
              </p>
            </Copy>
          </div>
        </div>

        <div className="hero-logo">
          <img src="/logo_ty.png" alt="" />
        </div>
      </section>

      <BlindingLight />

      <section className="about">
        <Copy variant="flicker">
          <p className="mono">The Manifesto</p>
        </Copy>
        <div className="about-copy">
          <Copy>
            <div className="container">
              <h6 className="type-2">
                Deadlock Studios was founded on a single conviction: games
                should leave marks. Not the kind you forget after credits roll,
                but the kind that sit in your chest days later. We design worlds
                rooted in tension, silence, and consequence.
              </h6>

              <h6 className="type-2">
                Our work draws from surveillance culture, brutalist
                architecture, and the quiet horror of systems you can't see but
                know are watching. We don't chase trends or comfort zones. We
                build experiences that operate on instinct and atmosphere, where
                the player is never fully in control and the environment is
                never fully understood.
              </h6>
            </div>
          </Copy>
        </div>
      </section>

      <FeaturedProjects />

      <Team />

      <Footer />
    </>
  );
}

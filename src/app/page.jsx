"use client";

import "./home.css";

import { useLayoutEffect, useRef } from "react";

import BlindingLight from "@/components/BlindingLight/BlindingLight";
import Copy from "@/components/Copy/Copy";
import FeaturedProjects from "@/components/FeaturedProjects/FeaturedProjects";
import Fluorescent from "@/components/Fluorescent/Fluorescent";
import Footer from "@/components/Footer/Footer";
import Preloader, { isInitialLoad } from "@/components/Preloader/Preloader";
import ScrollRevealTitle from "@/components/ScrollRevealTitle/ScrollRevealTitle";
import Team from "@/components/Team/Team";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const OLD_EXPERIENCE_ITEMS = [
  {
    period: "2021 - 2023",
    company: "Creative Agency",
    role: "Web Publisher",
    description: "HTML, CSS, JavaScript 기반 반응형 구축과 운영 페이지 제작",
  },
  {
    period: "2023 - 2025",
    company: "Gnuboard Studio",
    role: "PHP / Gnuboard Developer",
    description: "그누보드 커스터마이징, 예약 시스템, 관리자 기능 개발",
  },
  {
    period: "2025 - Now",
    company: "Freelance",
    role: "Interactive Web Builder",
    description: "Next.js, GSAP, SEO를 결합한 인터랙티브 웹사이트 제작",
  },
];

const BROKEN_EXPERIENCE_ITEMS = [
  {
    period: "2020.10 - 2023.04",
    company: "MODEUN SEVEN",
    role: "Web Agency / Development Team",
    description:
      "쇼핑몰, 회사, 학교 등 다양한 업종의 홈페이지를 GNUBoard 기반으로 퍼블리싱하고 PHP, MySQL, Ajax 기능을 개발했습니다.",
  },
  {
    period: "2023.04 - 2026.05",
    company: "PINEAPPLE PTL",
    role: "Medical Web Publisher",
    description:
      "병원/의료 분야 반응형 웹사이트 구축과 유지보수를 담당하며 GNUBoard 커스터마이징, 웹 접근성, SEO, 레거시 개선을 진행했습니다.",
  },
];

// home page — hero, manifesto, featured work, team, footer
const EXPERIENCE_ITEMS = [
  {
    period: "2020.10 - 2023.04",
    company: "모든세븐",
    role: "웹에이전시 / 개발팀 대리",
    description: [
      "쇼핑몰, 기업, 학교 등 다양한 업종 홈페이지 그누보드(CMS) 기반 기획~퍼블리싱 담당",
      "클라이언트 커뮤니케이션 및 요구사항 정리, 오픈 후 유지보수·신규 기능 개발 전담",
      "가비아, 카페24 등 호스팅 환경 서버 세팅~배포 진행, HTML/CSS/JS 퍼블리싱 및 PHP·MySQL 기반 백엔드 기능(게시판, 회원관리 등) 개발",
    ],
  },
  {
    period: "2024.04 - 2026.05",
    company: "파인애플피티엘",
    role: "웹에이전시 / 개발팀 주임(파트장)",
    description: [
      "병원 특화 도메인으로 전환, 그누보드5 기반 병원별 맞춤형 예약·상담 시스템 설계 및 반응형(PC/Tablet/Mobile) UI 아키텍처 총괄",
      "GSAP·Swiper.js 기반 인터랙티브 UI/애니메이션 구현으로 병원 브랜드별 차별화된 사용자 경험 설계 — GD Web Awards 다수 수상",
      "Open Graph, 웹 표준·접근성 가이드라인 도입해 검색 노출 및 SNS 공유 품질 개선 — 단순 퍼블리싱을 넘어 SEO 관점의 구조 개선 주도",
      "노후화된 레거시 홈페이지 다수의 코드 구조 리팩토링 및 유지보수 프로세스 체계화(문서화·히스토리 관리) 정립",
    ],
  },
];

export default function Home() {
  const aboutRef = useRef(null);
  const aboutPanelRef = useRef(null);
  const aboutMainRef = useRef(null);
  const aboutExperienceRef = useRef(null);

  useLayoutEffect(() => {
    const about = aboutRef.current;
    const panel = aboutPanelRef.current;
    const main = aboutMainRef.current;
    const experience = aboutExperienceRef.current;
    if (!about || !panel || !main || !experience) return;

    const experienceItems = experience.querySelectorAll(".about-experience-item");

    gsap.set(panel, {
      yPercent: -108,
      borderBottomLeftRadius: "8vw",
      borderBottomRightRadius: "8vw",
    });
    gsap.set(experience, { opacity: 0, y: 120 });
    gsap.set(experienceItems, { opacity: 0, y: 60 });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: about,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        refreshPriority: 4,
      },
    });

    timeline
      .to(main, { y: 0, opacity: 1, ease: "none" }, 0.12)
      .to(main, { y: 0, opacity: 1, ease: "none" }, 0.62)
      .to(main, { y: -110, opacity: 0.16, ease: "none" }, 0.74)
      .to(
        panel,
        {
          yPercent: 0,
          borderBottomLeftRadius: "0vw",
          borderBottomRightRadius: "0vw",
          ease: "power2.inOut",
        },
        0.8,
      )
      .to(experience, { opacity: 1, y: 0, ease: "none" }, 0.91)
      .to(
        experienceItems,
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: "none",
        },
        0.94,
      );

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, []);

  return (
    <main className="home-page">
      <Fluorescent />
      <Preloader />

      <section className="hero">
        <div className="hero-content">
          <Copy animateOnScroll={false} delay={isInitialLoad ? 4.85 : 0.75}>
            <div className="container">
              <p className="hero-p">INTERACTIVE <br />WEB PUBLISHER</p>
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
        </div>
      </section>

      <section className="blinding-intro">
        <div className="container">
          <ScrollRevealTitle
            className="blinding-intro-title type-2"
            trigger=".blinding-intro"
          >
            ABOUT ME
          </ScrollRevealTitle>
        </div>
      </section>

      <section className="about" ref={aboutRef}>
        <div className="about-sticky">
          <div className="about-content" ref={aboutMainRef}>
            <Copy trigger=".about" start="top 78%" end="top 45%">
              <p className="mono">The Manifesto</p>
            </Copy>
            <div className="about-copy">
              <Copy
                trigger=".about"
                start="top 80%"
                end="top -48%"
                stagger={0.018}
              >
                <div className="container">
                  <h6 className="type-2 about-intro-title">
                    GNUBOARD 기반 웹퍼블리싱부터 NEXT.JS·SUPABASE 기반 서비스
                    개발까지, 실제 운영 가능한 화면과 구조를 만듭니다
                  </h6>

                  <p className="about-intro-desc">
                    그누보드(GB5/GB7) 기반 PHP 커스터마이징과 반응형 퍼블리싱을
                    기본기로, 최근에는 Next.js·TypeScript·Supabase 스택으로 SEO
                    자동화 서비스(AX SEO Manager)를 직접 설계·개발하고 있습니다.
                    디자인을 정확한 화면으로 구현하는 것을 넘어, 실제 운영 가능한
                    구조를 만드는 데 집중합니다.
                  </p>
                </div>
              </Copy>
            </div>
          </div>

          <div className="about-panel" ref={aboutPanelRef}>
            <div className="about-panel-inner">
              <Copy trigger=".about" start="top -145%" end="bottom 68%">
                <p className="mono about-panel-kicker">Experience</p>
              </Copy>
              <div className="about-experience-list" ref={aboutExperienceRef}>
                {EXPERIENCE_ITEMS.map((item, index) => (
                  <div className="about-experience-item" key={item.company}>
                    <Copy
                      trigger={`.about-experience-item:nth-child(${index + 1})`}
                      start="top 94%"
                      end="top 50%"
                    >
                      <p className="mono about-experience-index">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                    </Copy>
                    <Copy
                      trigger={`.about-experience-item:nth-child(${index + 1})`}
                      start="top 94%"
                      end="top 50%"
                    >
                      <p className="mono about-experience-period">
                        {item.period}
                      </p>
                    </Copy>
                    <div>
                      <Copy
                        trigger={`.about-experience-item:nth-child(${index + 1})`}
                        start="top 92%"
                        end="top 44%"
                      >
                        <h5 className="type-2">{item.company}</h5>
                      </Copy>
                      <Copy
                        trigger={`.about-experience-item:nth-child(${index + 1})`}
                        start="top 88%"
                        end="top 42%"
                      >
                        <p className="about-experience-role">{item.role}</p>
                      </Copy>
                      <Copy
                        trigger={`.about-experience-item:nth-child(${index + 1})`}
                        start="top 84%"
                        end="top 38%"
                      >
                        <ul className="about-experience-desc">
                          {item.description.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </Copy>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Team />

      <section className="blinding-intro blinding-light-intro">
        <div className="container">
          <ScrollRevealTitle
            className="blinding-intro-title type-2"
            trigger=".blinding-light-intro"
          >
            SELECTED WORKS
          </ScrollRevealTitle>
        </div>
      </section>

      <BlindingLight />


      <FeaturedProjects />

      

      <Footer />
    </main>
  );
}

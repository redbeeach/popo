"use client";

import "./Team.css";

import { useLayoutEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Copy from "../Copy/Copy";

gsap.registerPlugin(ScrollTrigger);

const OLD_TEAM = [
  {
    index: "[001]",
    title: "GNUBOARD 5 / 7",
    description:
      "그누보드 기반 사이트를 5년 이상 다뤄온 만큼, PHP 커스터마이징부터 예약 시스템, 회원 관리까지 국내 호스팅 환경에 최적화된 풀스택 구축이 가능합니다.",
    stat: "40+",
    statLabel: "구축 및 커스터마이징 프로젝트",
  },
  {
    index: "[002]",
    title: "SEO OPTIMIZATION",
    description:
      "의료·클리닉 등 민감 산업군(YMYL) 사이트의 검색 노출을 다수 개선한 경험을 바탕으로, 구조화 데이터부터 리디렉션 설계까지 실질적인 검색 성과를 만듭니다.",
    stat: "E-E-A-T",
    statLabel: "기준 콘텐츠 설계",
  },
];

const LEGACY_TEAM = [
  {
    index: "[001]",
    title: "Design Check",
    description:
      "시안 구조, 컴포넌트 반복, 반응형 기준을 먼저 파악합니다.",
    stat: "01",
    statLabel: "Structure Review",
  },
  {
    index: "[002]",
    title: "Markup Build",
    description:
      "유지보수 가능한 HTML/CSS 구조로 화면을 구현합니다.",
    stat: "02",
    statLabel: "Semantic Layout",
  },
  {
    index: "[003]",
    title: "Interaction",
    description:
      "스크롤, hover, 메뉴, 슬라이드 등 필요한 UI 동작을 연결합니다.",
    stat: "03",
    statLabel: "Motion & UI",
  },
  {
    index: "[004]",
    title: "Backend Connect",
    description:
      "Gnuboard/Laravel/Supabase 등 데이터·API를 화면과 연동합니다.",
    stat: "04",
    statLabel: "Data Integration",
  },
];

const TEAM = [
  {
    index: "[001]",
    title: "CMS Build",
    description:
      "그누보드(GB5/GB7) 기반 테마·스킨을 처음부터 설계하고, 클라이언트별 요구사항에 맞게 구조를 짭니다. 가비아·카페24 등 실서버 환경까지 고려해 설계합니다.",
    stat: "01",
    statLabel: "CMS Build",
  },
  {
    index: "[002]",
    title: "Backend Logic",
    description:
      "PHP·MySQL 기반 게시판, 회원관리, 관리자 페이지 등 실제 동작하는 기능을 구현합니다. 운영 중 발생하는 오류와 예외 케이스까지 대응합니다.",
    stat: "02",
    statLabel: "Backend Logic",
  },
  {
    index: "[003]",
    title: "SEO Structure",
    description:
      "URL 리다이렉트, sitemap 자동화, 구조화 데이터(JSON-LD)까지 검색엔진이 읽는 방식으로 설계합니다. YMYL(의료) 사이트 기준의 E-E-A-T 신호까지 관리합니다.",
    stat: "03",
    statLabel: "SEO Structure",
  },
  {
    index: "[004]",
    title: "Interaction",
    description:
      "GSAP·Swiper.js 기반 스크롤, 호버, 슬라이드 등 사용자가 체감하는 디테일을 구현합니다. 디바이스별 반응 속도와 자연스러움까지 다듬습니다.",
    stat: "04",
    statLabel: "Interaction",
  },
];

export default function Team() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // pin section and slide cards in a straight horizontal line
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards.length) return;

    const stickyHeight = window.innerHeight * 5;

    function positionCards(progress = 0) {
      const isMobile = window.innerWidth < 900;
      const cardSpacing = isMobile ? 320 : 620;
      const cardStartProgress = 0.18;
      const cardProgress = gsap.utils.clamp(
        0,
        1,
        (progress - cardStartProgress) / (1 - cardStartProgress),
      );
      const cardOpacity = gsap.utils.clamp(0, 1, (progress - 0.1) / 0.12);
      const startX = window.innerWidth * (isMobile ? 1.02 : 1.18);
      const travel =
        window.innerWidth * (isMobile ? 1.05 : 1.22) +
        cardSpacing * (cards.length - 1);
      const topRowY = isMobile ? -150 : -180;
      const bottomRowY = isMobile ? 20 : 20;

      cards.forEach((card, i) => {
        if (!card) return;
        const x = startX + i * cardSpacing - cardProgress * travel;
        const y = i % 2 === 0 ? topRowY : bottomRowY;

        gsap.set(card, {
          x,
          y,
          opacity: cardOpacity,
          rotation: 0,
          transformOrigin: "center center",
        });
      });
    }

    positionCards(0);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      invalidateOnRefresh: true,
      refreshPriority: 3,
      onUpdate: (self) => {
        positionCards(self.progress);
      },
    });

    const handleResize = () => {
      positionCards(0);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="team" ref={sectionRef}>
      <div className="team-header">
        <Copy>
          <p className="mono">THE SKILLSET</p>
        </Copy>
        <Copy>
          <h5 className="type-2">EVERY LAYER COVERED</h5>
        </Copy>
      </div>

      <div className="cards">
        {TEAM.map((member, i) => (
          <div
            key={member.title}
            className="card"
            ref={(el) => (cardsRef.current[i] = el)}
          >
            <Copy trigger=".team" start="top 70%">
              <div className="card-content">
                <div className="card-heading">
                  <p className="mono card-index">{member.index}</p>
                  <h3>{member.title}</h3>
                </div>
                <p className="card-description">{member.description}</p>
                <div className="card-stat">
                  <span>{member.statLabel}</span>
                </div>
              </div>
            </Copy>
          </div>
        ))}
      </div>
    </section>
  );
}

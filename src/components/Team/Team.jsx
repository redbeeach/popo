"use client";

import "./Team.css";

import { useLayoutEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Copy from "../Copy/Copy";

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
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
      const cardSpacing = isMobile ? 320 : 560;
      const startX = window.innerWidth * 0.72;
      const travel = window.innerWidth + cardSpacing * cards.length;
      const topRowY = isMobile ? -120 : -170;
      const bottomRowY = isMobile ? 80 : 120;

      cards.forEach((card, i) => {
        if (!card) return;
        const x = startX + i * cardSpacing - progress * travel;
        const y = i % 2 === 0 ? topRowY : bottomRowY;

        gsap.set(card, {
          x,
          y,
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
      refreshPriority: 2,
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
        <Copy variant="flicker">
          <p className="mono">THE SKILLSET</p>
        </Copy>
        <Copy>
          <h5 className="type-2">EVERY LAYER COVERED</h5>
        </Copy>
      </div>

      <div className="team-footer">
        <div className="container">
          <p className="mono">Roster Verified</p>
          <p className="mono">Defectors: None</p>
        </div>
      </div>

      <div className="cards">
        {TEAM.map((member, i) => (
          <div
            key={member.title}
            className="card"
            ref={(el) => (cardsRef.current[i] = el)}
          >
            <div className="card-content">
              <div className="card-heading">
                <p className="mono card-index">{member.index}</p>
                <h3>{member.title}</h3>
              </div>
              <p className="card-description">{member.description}</p>
              <div className="card-stat">
                <p>{member.stat}</p>
                <span>{member.statLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const profile = {
  name: "권혁준",
  role: "Dev",
  avatar: "/11111.png",
  portrait: "/profile.jpg",
  intro: [
    "문제를 끝까지 해결하며 성장하는 개발자 권혁준입니다.",
    "단순히 기술을 다루는 사람이 아니라, 사용자가 신뢰할 수 있는 서비스를 만드는 개발자를 목표로 합니다.",
    "프로젝트 전 과정을 직접 수행하며 구조를 이해하고 원인을 분석해 근본적인 해결을 만들어 왔습니다.",
    "앞으로도 현장에서 검증받는 개발자로 성장하며 서비스의 안정성과 완성도를 끝까지 책임지겠습니다.",
  ],
  contacts: {
    email: "gurwns9035@naver.com",
    github: "https://github.com/hyeokjun9035",
  },
};

export const pageLinks = [
  { label: "About", href: "/about" },
  { label: "TroubleShooting", href: "/troubleshooting" },
  { label: "Skill", href: "/skill" },
];

export const skills = ["Java", "Spring", "React", "Next.js", "TypeScript", "Vue.js", "Oracle"];

export const troubleshootingTopics = ["Front-End", "Back-End", "DB"];

export const aboutSections = [
  { label: "Main", href: "#main" },
  { label: "Education", href: "#education" },
  { label: "Project", href: "#project" },
];

export const education = [
  {
    school: "인천재능대학교",
    period: "2015.03 ~ 2021.02",
    major: "전자과",
  },
  {
    school: "인천재능대학교",
    period: "2021.03 ~ 2023.02",
    major: "인공지능전자공학과",
  },
  {
    school: "더조은컴퓨터아카데미",
    period: "2025.07.16 ~ 2026.01.26",
    major: "MSA기반 클러터(Dart) 활용 자바(JAVA) 프론트엔드 백엔드 풀스택웹(앱) 개발 과정",
  },
];

export const projects = [
  "프로젝트 1: AGRICOLA",
  "프로젝트 2: 오늘 어때",
  "프로젝트 3: Thlog",
  "프로젝트 4: 요양원 사이트",
];

export const latestPosts = [
  {
    title: "Vue.js 개발 스타일 (Options vs Composition)",
    date: "2026-05-10",
    slug: "vue-study", // content/post/공부.md 파일명과 일치해야 함
    category: "Vue.js"
  }
];

export const troubleshootingPosts = [
  {
    title: "Oracle ORA-28001 비밀번호 만료 오류 해결 방법 (password has expired)",
    date: "2026-05-18",
    slug: "Oracle_ORA-28001",
    category: "DB",
  },
];
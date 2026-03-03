"use client";

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const DEV_SINCE = new Date("2025-01-01T00:00:00");

const EXPERIENCES = [
  {
    role: "Fullstack Developer",
    company: "Resolva AI",
    period: "Nov 2025 - present",
    description:
      "Building AI-powered solutions for customer service and sales. Developing AI agents and APIs with Python, FastAPI, NestJS, and LangChain. Frontend work with React and Next.js, focused on scalable, production-ready integrations.",
  },
  {
    role: "Fullstack Developer",
    company: "BNF Tec",
    period: "Oct 2025 - present",
    description:
      "Developing web applications and intelligent automations with Python (FastAPI) and Node.js on the backend, React and Next.js on the frontend. Integrating generative AI solutions to optimize business flows. Contributing to architecture decisions, code standards, and CI/CD pipelines.",
  },
  {
    role: "Freelance Developer",
    company: "Self-employed",
    period: "Jan 2025 - present",
    description:
      "Building custom web solutions for clients: APIs, frontend and backend development, database integration, authentication, and security. Delivering functional, well-documented projects aligned with business goals.",
  },
  {
    role: "Teacher",
    company: "Escola Municipal Cecilia Meireles",
    period: "May 2025 - Oct 2025",
    description:
      "Taught arts classes for middle school students. Planned content aligned with educational guidelines, promoting critical thinking and active student participation.",
  },
];

const TECH_CATEGORIES: Record<string, string[]> = {
  languages: ["TypeScript", "JavaScript", "Python", "SQL"],
  frontend: ["React", "Next.js", "Tailwind CSS"],
  backend: ["Node.js", "NestJS", "FastAPI", "SQLAlchemy", "Alembic"],
  auth: ["JWT", "OAuth"],
  databases: ["PostgreSQL", "SQLite", "MongoDB"],
  infra: ["Docker", "Linux", "Git", "GCP", "Cloudflare"],
  ai: ["OpenAI", "Gemini", "Claude", "LangChain"],
};

const PROJECTS = [
  {
    name: "kneresz.com",
    description:
      "Personal blog and portfolio. Next.js + FastAPI + PostgreSQL + Cloudflare R2. Monospace aesthetics, ASCII art, zen writing mode.",
    links: [
      { label: "client", url: "https://github.com/KNereSouza/client-kneresz" },
      { label: "server", url: "https://github.com/KNereSouza/server-kneresz" },
    ],
  },
  {
    name: "NewsHub API",
    description:
      "Backend service for a news management system. User authentication, role-based access control, and full CRUD for news operations.",
    tech: "Node.js, Express, Sequelize, PostgreSQL, JWT",
    links: [
      { label: "source", url: "https://github.com/KNereSouza/news-hub-api" },
    ],
  },
  {
    name: "Transcrybe.AI",
    description:
      "REST API that orchestrates transcription and summarization of YouTube videos via AI. Supports OpenAI Whisper/GPT and Google Gemini.",
    tech: "Node.js, Express, OpenAI, Google Gemini, ytdl-core",
    links: [
      { label: "source", url: "https://github.com/KNereSouza/transcrybe.ai" },
    ],
  },
  {
    name: "kneres.com.br",
    description:
      "Previous personal portfolio and professional presence. Clean design showcasing software development and design work.",
    tech: "React, TypeScript, Vite, Tailwind CSS",
    links: [
      { label: "source", url: "https://github.com/KNereSouza/kneres.com.br" },
    ],
  },
];

const ASCII_HEADER = `
    ___    __                __     __  ___
   /   |  / /_  ____  __  __/ /_   /  |/  /__
  / /| | / __ \\/ __ \\/ / / / __/  / /|_/ / _ \\
 / ___ |/ /_/ / /_/ / /_/ / /_   / /  / /  __/
/_/  |_/_.___/\\____/\\__,_/\\__/  /_/  /_/\\___/
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getUptime() {
  const now = Date.now();
  const diff = now - DEV_SINCE.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function Uptime() {
  const [uptime, setUptime] = useState(getUptime);

  useEffect(() => {
    const id = setInterval(() => setUptime(getUptime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border border-border p-4 text-xs sm:text-sm">
      <span className="text-muted">$ uptime</span>
      <div className="mt-2 text-fg">
        <span className="text-muted">up </span>
        <span>{uptime.days}</span>
        <span className="text-muted">d </span>
        <span>{uptime.hours}</span>
        <span className="text-muted">h </span>
        <span>{uptime.minutes}</span>
        <span className="text-muted">m </span>
        <span>{uptime.seconds}</span>
        <span className="text-muted">s</span>
      </div>
      <div className="text-muted mt-1">
        since {DEV_SINCE.toISOString().split("T")[0]}
      </div>
    </div>
  );
}

function ExperienceItem({ exp }: { exp: (typeof EXPERIENCES)[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-l-2 border-border pl-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left cursor-pointer group"
      >
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-fg font-bold group-hover:text-accent transition-colors">
            {exp.role}
            <span className="text-muted font-normal"> @ {exp.company}</span>
          </p>
          <span className="text-muted text-xs shrink-0">
            [{open ? "-" : "+"}]
          </span>
        </div>
        <p className="text-muted text-xs">{exp.period}</p>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-muted text-xs sm:text-sm leading-relaxed">
          {exp.description}
        </p>
      </div>
    </div>
  );
}

function TechStack() {
  const [active, setActive] = useState<string | null>(null);
  const categories = Object.keys(TECH_CATEGORIES);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
        <button
          onClick={() => setActive(null)}
          className={`px-2 py-0.5 border text-xs transition-colors cursor-pointer ${
            active === null
              ? "border-fg text-fg"
              : "border-border text-muted hover:text-fg hover:border-fg"
          }`}
        >
          /all
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(active === cat ? null : cat)}
            className={`px-2 py-0.5 border text-xs transition-colors cursor-pointer ${
              active === cat
                ? "border-fg text-fg"
                : "border-border text-muted hover:text-fg hover:border-fg"
            }`}
          >
            /{cat}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {Object.entries(
          active ? { [active]: TECH_CATEGORIES[active] } : TECH_CATEGORIES,
        ).map(([cat, techs]) => (
          <div key={cat} className="flex items-baseline gap-3">
            <span className="text-fg text-xs font-bold shrink-0 w-20 sm:w-24 text-right">
              {cat}
            </span>
            <span className="text-muted text-xs">
              {techs.join(", ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function AboutContent() {
  return (
    <>
      <pre className="text-fg text-[10px] leading-3 sm:text-xs sm:leading-4 select-none mb-6 sm:mb-8">
        {ASCII_HEADER}
      </pre>

      <div className="space-y-10 sm:space-y-12">
        {/* Intro */}
        <section>
          <h2 className="text-fg text-sm sm:text-base font-bold mb-3">
            ## who
          </h2>
          <div className="text-muted text-xs sm:text-sm space-y-3 leading-relaxed">
            <p>
              Hi. I&apos;m <span className="text-fg font-bold">Kauã Neres</span>
              , a fullstack developer and Computer Science student at UNINTER. I
              live in Jucurucu, a small town in rural Bahia, Brazil, where until
              recently most people didn&apos;t even have internet access.
            </p>
            <p>
              I was always the &quot;nerd&quot; growing up. Finding others who
              shared my interest in tech was rare, so I taught myself everything
              I could. Alura courses, Filipe Deschamps, and Fabio Akita were the
              mentors I never had in person.
            </p>
            <p>
              Before landing my first dev role, 2025 took me through a few
              detours: e-commerce delivery driver, motorcycle parts store clerk,
              and art teacher for middle schoolers. Each one taught me
              something, but code is where I belong.
            </p>
          </div>
        </section>

        {/* Uptime */}
        <section>
          <h2 className="text-fg text-sm sm:text-base font-bold mb-3">
            ## uptime
          </h2>
          <Uptime />
        </section>

        {/* Experiences */}
        <section>
          <h2 className="text-fg text-sm sm:text-base font-bold mb-3">
            ## experience
          </h2>
          <div className="space-y-4">
            {EXPERIENCES.map((exp) => (
              <ExperienceItem key={exp.company} exp={exp} />
            ))}
          </div>
        </section>

        {/* Technologies */}
        <section>
          <h2 className="text-fg text-sm sm:text-base font-bold mb-3">
            ## stack
          </h2>
          <TechStack />
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-fg text-sm sm:text-base font-bold mb-3">
            ## projects
          </h2>
          <div className="space-y-4">
            {PROJECTS.map((project) => (
              <div key={project.name} className="border border-border p-4">
                <p className="text-fg font-bold text-xs sm:text-sm">
                  {project.name}
                </p>
                <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed">
                  {project.description}
                </p>
                {project.tech && (
                  <p className="text-muted/50 text-xs mt-2">{project.tech}</p>
                )}
                <div className="flex gap-3 mt-2">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-fg hover:text-accent transition-colors"
                    >
                      [{link.label}]
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-fg text-sm sm:text-base font-bold mb-3">
            ## contact
          </h2>
          <div className="text-muted text-xs sm:text-sm space-y-1">
            <p>
              <span className="text-fg">github:</span>{" "}
              <a
                href="https://github.com/KNereSouza"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg transition-colors"
              >
                KNereSouza
              </a>
            </p>
            <p>
              <span className="text-fg">linkedin:</span>{" "}
              <a
                href="https://www.linkedin.com/in/kneresouza"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg transition-colors"
              >
                kneresouza
              </a>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

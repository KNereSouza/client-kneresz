import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "about",
  description: "About Kaua Neres de Souza - fullstack developer and cs student.",
};

const ASCII_HEADER = `
    ___    __                __     __  ___
   /   |  / /_  ____  __  __/ /_   /  |/  /__
  / /| | / __ \\/ __ \\/ / / / __/  / /|_/ / _ \\
 / ___ |/ /_/ / /_/ / /_/ / /_   / /  / /  __/
/_/  |_/_.___/\\____/\\__,_/\\__/  /_/  /_/\\___/
`;

export default function AboutPage() {
  return (
    <>
      <pre className="text-fg text-[10px] leading-[12px] sm:text-xs sm:leading-4 select-none mb-6 sm:mb-8">
        {ASCII_HEADER}
      </pre>

      <div className="space-y-10 sm:space-y-12">
        {/* My History */}
        <section>
          <h2 className="text-fg text-sm sm:text-base font-bold mb-3">
            ## my history
          </h2>
          <div className="text-muted text-xs sm:text-sm space-y-3 leading-relaxed">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>
        </section>

        {/* Experiences */}
        <section>
          <h2 className="text-fg text-sm sm:text-base font-bold mb-3">
            ## experiences
          </h2>
          <div className="text-muted text-xs sm:text-sm space-y-4">
            <div className="border-l-2 border-border pl-4">
              <p className="text-fg font-bold">Fullstack Developer @ Acme Corp</p>
              <p className="text-muted text-xs">2024 - present</p>
              <p className="mt-1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum. Cras vehicula, mi eget
                laoreet varius, augue eros dapibus ipsum.
              </p>
            </div>
            <div className="border-l-2 border-border pl-4">
              <p className="text-fg font-bold">Backend Intern @ Startup Inc</p>
              <p className="text-muted text-xs">2023 - 2024</p>
              <p className="mt-1">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore.
              </p>
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section>
          <h2 className="text-fg text-sm sm:text-base font-bold mb-3">
            ## technologies
          </h2>
          <div className="text-muted text-xs sm:text-sm space-y-2">
            <p>
              <span className="text-fg">languages:</span>{" "}
              TypeScript, Python, Rust, Go, SQL
            </p>
            <p>
              <span className="text-fg">frameworks:</span>{" "}
              Next.js, React, FastAPI, Tailwind CSS
            </p>
            <p>
              <span className="text-fg">databases:</span>{" "}
              PostgreSQL, Redis, SQLite
            </p>
            <p>
              <span className="text-fg">tools:</span>{" "}
              Docker, Git, Linux, Neovim, Cloudflare
            </p>
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-fg text-sm sm:text-base font-bold mb-3">
            ## projects
          </h2>
          <div className="text-muted text-xs sm:text-sm space-y-4">
            <div className="border border-border p-4">
              <p className="text-fg font-bold">kneresz.com</p>
              <p className="mt-1">
                Personal blog and portfolio. Built with Next.js, FastAPI,
                PostgreSQL, and Cloudflare R2. Monospace aesthetics with ASCII
                art throughout.
              </p>
              <a
                href="https://github.com/KNereSouza"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg hover:text-accent transition-colors mt-2 inline-block"
              >
                [source]
              </a>
            </div>
            <div className="border border-border p-4">
              <p className="text-fg font-bold">lorem-cli</p>
              <p className="mt-1">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam eaque ipsa
                quae ab illo inventore veritatis.
              </p>
              <a
                href="https://github.com/KNereSouza"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg hover:text-accent transition-colors mt-2 inline-block"
              >
                [source]
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

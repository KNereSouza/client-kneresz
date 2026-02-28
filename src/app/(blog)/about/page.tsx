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
              todo: write your history here.
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
              <p className="text-fg font-bold">Job Title @ Company</p>
              <p className="text-muted text-xs">2024 - present</p>
              <p className="mt-1">todo: describe your role and responsibilities.</p>
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
              todo
            </p>
            <p>
              <span className="text-fg">frameworks:</span>{" "}
              todo
            </p>
            <p>
              <span className="text-fg">databases:</span>{" "}
              todo
            </p>
            <p>
              <span className="text-fg">tools:</span>{" "}
              todo
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
                personal blog and portfolio. built with next.js, fastapi,
                postgresql, and cloudflare r2.
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

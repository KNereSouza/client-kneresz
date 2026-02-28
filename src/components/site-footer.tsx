export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 sm:px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-muted">
        <span>&copy; {new Date().getFullYear()} kneresz</span>
        <a
          href="https://github.com/KNereSouza"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg transition-colors"
        >
          github
        </a>
      </div>
    </footer>
  );
}

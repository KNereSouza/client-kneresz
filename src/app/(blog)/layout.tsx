import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 px-6 sm:px-8 py-8">
        <div className="max-w-3xl mx-auto">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

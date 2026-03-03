import type { Metadata } from "next";
import { AboutContent } from "@/components/about-content";

export const metadata: Metadata = {
  title: "about",
  description: "About Kaua Neres - fullstack developer and CS student from Bahia, Brazil.",
};

export default function AboutPage() {
  return <AboutContent />;
}

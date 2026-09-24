import Hero from "@/src/components/layout/Homepage/Hero";
import Features from "@/src/components/layout/Homepage/Features";
import Workflow from "@/src/components/layout/Homepage/Workflow";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Workflow/>
      {/* Features, Workflow, FAQ, About next */}
    </>
  );
}
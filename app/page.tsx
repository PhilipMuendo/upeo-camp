import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Camp from "@/components/Camp";
import Tents from "@/components/Tents";
import Migration from "@/components/Migration";
import Journal from "@/components/Journal";
import Days from "@/components/Days";
import Conservation from "@/components/Conservation";
import Rates from "@/components/Rates";
import GettingThere from "@/components/GettingThere";
import Planner from "@/components/Planner";
import Finale from "@/components/Finale";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import { PlanProvider } from "@/lib/plan";

export default function Home() {
  return (
    <PlanProvider>
      <Navigation />
      <main>
        <Hero />
        <Camp />
        <Tents />
        <Migration />
        <Journal />
        <Days />
        <Conservation />
        <Rates />
        <GettingThere />
        <Planner />
        <Finale />
      </main>
      <Footer />
      <MobileBar />
    </PlanProvider>
  );
}

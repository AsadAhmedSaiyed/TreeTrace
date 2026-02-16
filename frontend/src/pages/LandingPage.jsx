
import CTA from "../components/CTA";
import Contact from "../components/Contact";
import AboutUs from "../components/AboutUs";
import Works from "../components/Works";
import Features from "../components/Features";
import Hero from "../components/Hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50 font-sans text-slate-900">
      <Hero></Hero>

      <Works></Works>

      <Features></Features>
      <AboutUs></AboutUs>
      <Contact></Contact>
      <CTA></CTA>
    </div>
  );
}

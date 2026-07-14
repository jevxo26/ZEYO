import Image from "next/image";
import SocialLogin from "../components/SocialLogin";
import { Footer } from "../components/Footer";
import  Navbar  from "../components/Navbar";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { FeaturedPackages } from "@/components/Featuredpackages";
import ServiceAreasSection from "@/components/Serviceareassection";
import CustomBudgetBanner from "@/components/CustomBudgetBanner";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-sans overflow-hidden">
      {/* Background decoration for glassy effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100/40 via-white to-purple-50/40"></div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <Navbar />
<Hero></Hero>
<Process></Process>
<FeaturedPackages></FeaturedPackages>
<ServiceAreasSection></ServiceAreasSection>
<CustomBudgetBanner></CustomBudgetBanner>
      <main >
       
      </main>

      <Footer />
    </div>
  );
}
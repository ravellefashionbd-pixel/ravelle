import BrandStory from "../components/layout/HomePage/BrandStory";
import FAQSection from "../components/layout/HomePage/FAQ";
import Footer from "../components/layout/HomePage/Footer";
import Hero from "../components/layout/HomePage/Hero";
import Navbar from "../components/layout/HomePage/navbar/Navbar";
import FloatingContact from "../components/ui/FloatingContact";
import { CATEGORIES, CategoryNode } from "@/constants/categories";
export default async function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar categories={CATEGORIES} />
      <Hero />

      <BrandStory />

      <FAQSection />
      <FloatingContact />
      <Footer />
    </main>
  );
}

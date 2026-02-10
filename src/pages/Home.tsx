import HeroSection from "../components/home/HeroSection";
import PartnerSection from "../components/home/PartnerSection";
import ProductsSection from "../components/home/ProductSection";
import SloganSection from "../components/home/SloganSection";
import FeaturesSection from "../components/home/FeaturesSection";
import BestSellersSection from "../components/home/BestSellersSection";
import StatsSection from "../components/home/StatsSection";
import StorySection from "../components/home/StorySection";
import ContactSection from "../components/home/ContactSection";

const Home = () => {
  return (
    <div className="m-0">
      <HeroSection />
      <PartnerSection />
      <ProductsSection />
      <SloganSection />
      <FeaturesSection />
      <BestSellersSection />
      {/* <StatsSection />
      <StorySection />
      <ContactSection /> */}
    </div>
  );
};

export default Home;

import HeroSection from "./ui/HeroSection";
import PartnerSection from "./ui/PartnerSection";
import ProductsSection from "./ui/ProductSection";
import SloganSection from "./ui/SloganSection";
import FeaturesSection from "./ui/FeaturesSection";
import BestSellersSection from "./ui/BestSellersSection";
import StatsSection from "./ui/StatsSection";
import StorySection from "./ui/StorySection";
import ContactSection from "./ui/ContactSection";

const Home = () => {
  return (
    <div className="m-0">
      <HeroSection />
      <PartnerSection />
      <ProductsSection />
      <SloganSection />
      <FeaturesSection />
      {/* <BestSellersSection /> */}
      <StatsSection />
      <StorySection />
      <ContactSection />
    </div>
  );
};

export default Home;

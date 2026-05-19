import TopBar from "../components/TopBar";
import Header from "../components/Header";
import HeroVideo from "../components/HeroVideo";
import HotelIntro from "../components/HotelIntro";
import FeatureGrid from "../components/FeatureGrid";
import RoomsPreview from "../components/RoomsPreview";
import Surroundings from "../components/Surroundings";
import SectionTransition from "../components/SectionTransition";
import GalleryGrid from "../components/GalleryGrid";
import MapSection from "../components/MapSection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <HeroVideo />
      <HotelIntro />
      <FeatureGrid />
      <Surroundings />
      <SectionTransition />
      <RoomsPreview />
      <GalleryGrid />
      <MapSection />
      <Footer />
    </>
  );
}

export default Home;
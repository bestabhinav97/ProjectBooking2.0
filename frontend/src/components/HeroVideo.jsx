import video from "../assets/hero-video.mp4";
import BookingBox from "./BookingBox";

function HeroVideo() {
  return (
    <section className="hero-video">
      <div className="hero-video-media">
        <video autoPlay loop muted playsInline>
          <source src={video} type="video/mp4" />
        </video>
        <div className="overlay"></div>
      </div>

      <BookingBox />
    </section>
  );
}

export default HeroVideo;
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import wellnessSlide1 from "../assets/wellness-slide-1.jpg";
import wellnessSlide2 from "../assets/wellness-slide-2.jpg";
import wellnessSlide3 from "../assets/wellness-slide-3.jpg";
import wellnessSlide4 from "../assets/wellness-slide-4.jpg";

function Wellness() {
  return (
    <>
      <TopBar />
      <Header />

      <main className="wellness-page">
        <section className="wellness-slideshow">
          <img src={wellnessSlide1} alt="Spa relaxation" />
          <img src={wellnessSlide2} alt="Sauna" />
          <img src={wellnessSlide3} alt="Jacuzzi" />
          <img src={wellnessSlide4} alt="Wellness area" />
        </section>

        <section className="wellness-intro-section">
          <div className="wellness-intro-content">
            <h1>Spa Aurora</h1>

            <p>
              Welcome to our spacious spa, offering a calm and cozy atmosphere
              where you can relax and unwind. Enjoy Beauté Pacifique’s exclusive
              6-step ritual, included in your experience.
            </p>

            <p>
              Soak in our warm Japanese pool and make use of the sauna, cold
              plunge, foot bath, and jacuzzi. Complete your visit under the
              soothing warmth of our sun lamps.
            </p>

            <p className="wellness-price">
              Price: 375 SEK per person
            </p>

            <p>
              Children aged 10–17 are welcome from 08:00–11:00 and 15:00–17:00
              when accompanied by an adult.
            </p>
          </div>
        </section>

        <section className="wellness-request-section">
          <div className="wellness-request-content">
            <h2>Visit Spa Aurora</h2>

            <p>
              Would you like to visit Spa Aurora without staying at the hotel?
              Send your request below and we’ll get back to you.
            </p>

            <a href="mailto:spa@hotelaurora.se">
              Send request
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Wellness;
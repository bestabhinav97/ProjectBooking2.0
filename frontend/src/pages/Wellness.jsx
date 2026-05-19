import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import gymImage from "../assets/Hotel Gym.png";
import saunaImage from "../assets/Hotel Sauna.png";
import massageImage from "../assets/Hotel Massage.png";
import "../styles/wellness.css";

function Wellness() {
  return (
    <div className="wellness-page">
      <TopBar />
      <Header />

      <main>
        <section className="wellness-hero">
          <div className="wellness-hero-content">
            <p className="wellness-kicker">Relax & recharge</p>
            <h1>Wellness</h1>
            <p>
              Discover a calm hotel experience designed for rest, recovery and
              comfort during your stay.
            </p>
          </div>
        </section>

        <section className="wellness-main-section">
          <div className="wellness-intro">
            <p className="wellness-cursive">A peaceful escape</p>
            <h2>Take time for yourself</h2>
            <p>
              Our wellness area gives guests a quiet place to slow down. Enjoy
              relaxing treatments, calm surroundings and spaces made for both
              body and mind.
            </p>
          </div>

          <div className="wellness-card-grid">
            <article className="wellness-card">
              <img
                src={massageImage}
                alt="Relaxing hotel spa massage treatment"
                className="wellness-card-image"
              />

              <div className="wellness-card-content">
                <h3>Spa treatments</h3>
                <p>
                  Choose from relaxing treatments designed to help you unwind
                  after travel, work or a long day in the city.
                </p>
              </div>
            </article>

            <article className="wellness-card">
              <img
                src={saunaImage}
                alt="Warm hotel sauna and relaxation area"
                className="wellness-card-image"
              />

              <div className="wellness-card-content">
                <h3>Sauna & relaxation</h3>
                <p>
                  Enjoy warm, quiet spaces where you can reset and recover at
                  your own pace.
                </p>
              </div>
            </article>

            <article className="wellness-card">
              <img
                src={gymImage}
                alt="Hotel fitness and wellness area"
                className="wellness-card-image"
              />

              <div className="wellness-card-content">
                <h3>Fitness area</h3>
                <p>
                  Stay active during your visit with access to simple training
                  equipment and wellness facilities.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Wellness;
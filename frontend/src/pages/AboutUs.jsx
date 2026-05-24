import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/aboutUs.css";

function AboutUs() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);

      if (target) {
        setTimeout(() => {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="about-page">
      <TopBar />
      <Header />

      <main>
        <section className="about-hero">
          <div className="about-hero-content">
            <p className="about-kicker">Our story</p>
            <h1>About Us</h1>
            <p>
              A modern hotel experience focused on comfort, service and
              memorable stays.
            </p>
          </div>
        </section>

        <section className="about-main-section">
          <div className="about-intro">
            <p className="about-cursive">Welcome to Hotel</p>
            <h2>Designed for guests who value comfort</h2>
            <p>
              Our hotel brings together relaxing rooms, welcoming service and
              useful facilities for leisure travellers, business guests and
              families. We want every stay to feel simple, comfortable and well
              cared for.
            </p>
          </div>

          <div className="about-card-grid">
            <article id="contact" className="about-card">
              <h3>Contact Us</h3>
              <p>
                Reach our hotel team for questions about bookings, rooms,
                services and guest support.
              </p>
            </article>

            <article id="find" className="about-card">
              <h3>Find Us</h3>
              <p>
                Find our hotel close to local transport, attractions,
                restaurants and places to explore.
              </p>
            </article>

            <article id="company" className="about-card">
              <h3>Company Information</h3>
              <p>
                Learn more about our hotel, our service values and our approach
                to creating a comfortable guest experience.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;
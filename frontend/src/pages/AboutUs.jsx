import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import hotelImage from "../assets/about-hotel.png";
import lobbyImage from "../assets/about-lobby.png";
import locationImage from "../assets/about-location.png";
import serviceImage from "../assets/about-service.png";

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
    <>
      <TopBar />
      <Header />

      <main className="about-us-page">
        <section className="about-slideshow">
          <img src={hotelImage} alt="Hotel exterior" />
          <img src={lobbyImage} alt="Hotel lobby" />
          <img src={locationImage} alt="Hotel location" />
          <img src={serviceImage} alt="Hotel guest service" />
        </section>

        <div className="about-line-break"></div>

        <section className="about-intro-section">
          <div className="about-intro-content">
            <h1>About Us</h1>

            <p>
              Hotel Aurora is designed for guests who value comfort, calm spaces
              and thoughtful service. Our goal is to make every stay feel simple,
              welcoming and carefully handled from arrival to departure.
            </p>

            <p>
              Whether you are travelling for work, visiting with family or
              planning a relaxing weekend, our hotel brings together modern
              rooms, useful facilities and a warm guest experience.
            </p>
          </div>
        </section>

        <section className="about-info-section">
          <h2>Our Hotel</h2>

          <div className="about-info-grid">
            <article id="contact" className="about-info-card">
              <img src={serviceImage} alt="Hotel reception and guest service" />

              <h3>Contact Us</h3>

              <p>
                Our team is ready to help with bookings, room questions, special
                requests and general hotel information.
              </p>

              <a href="mailto:info@hotelaurora.se">Send email</a>
            </article>

            <article id="find" className="about-info-card">
              <img src={locationImage} alt="Hotel location and city area" />

              <h3>Find Us</h3>

              <p>
                Find our hotel close to local transport, restaurants, city
                attractions and places to explore during your stay.
              </p>

              <a href="https://maps.google.com" target="_blank" rel="noreferrer">
                Open map
              </a>
            </article>

            <article id="company" className="about-info-card">
              <img src={hotelImage} alt="Hotel building and company profile" />

              <h3>Company Information</h3>

              <p>
                Learn more about our hotel, our service values and our approach
                to creating comfortable and memorable guest experiences.
              </p>

              <a href="mailto:info@hotelaurora.se">Contact hotel</a>
            </article>
          </div>
        </section>

        <section className="about-values-section">
          <div className="about-values-content">
            <p className="about-small-title">What we stand for</p>

            <h2>Comfort, service and attention to detail</h2>

            <p>
              We focus on clean design, helpful communication and a hotel
              environment where guests can rest, work and enjoy their time with
              fewer complications.
            </p>
          </div>
        </section>

        {/*<section className="about-gallery-section">
          <div className="about-gallery-grid">
            <img src={hotelImage} alt="Hotel exterior view" />
            <img src={lobbyImage} alt="Hotel lobby interior" />
            <img src={serviceImage} alt="Hotel service area" />
            <img src={locationImage} alt="Hotel location view" />
          </div>
        </section>*/}

        <section className="about-transition">
          <div className="about-transition-line"></div>

          <p>
            From your first arrival to your final checkout, our hotel is built
            around comfort, clarity and a better guest experience.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AboutUs;
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import breakfastImage from "../assets/Hotel Breakfast.png";
import lunchImage from "../assets/Hotel Lunch.png";
import dinnerImage from "../assets/Hotel Dinner.png";
import barImage from "../assets/Hotel Bar.png";

import RBImage from "../assets/Restaurant.png";
import RBImage2 from "../assets/Bar 1.png";
import RBImage3 from "../assets/Bar 2.png";

import "../styles/restaurantBar.css";

function RestaurantBar() {
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

      <main className="restaurant-bar-page">
        <section className="restaurant-slideshow">
          <img src={breakfastImage} alt="Hotel breakfast buffet" />
          <img src={lunchImage} alt="Hotel lunch dining" />
          <img src={dinnerImage} alt="Hotel dinner restaurant" />
          <img src={barImage} alt="Hotel bar and after work drinks" />
          <img src={RBImage2} alt="Hotel bar and after work drinks" />
          <img src={RBImage3} alt="Hotel bar and after work drinks" />
        </section>

        <div className="restaurant-line-break"></div>

        <section className="restaurant-intro-section">
          <div className="restaurant-intro-content">
            <h1>Restaurant & Bar</h1>

            <p>
              Enjoy a complete dining experience from early breakfast to evening
              drinks. Our restaurant and bar offer warm service, fresh dishes and
              a calm hotel atmosphere throughout the day.
            </p>

            <p>
              Whether you are staying with us, visiting for a meeting, or meeting
              friends after work, our food and drink spaces are designed for
              comfort, taste and easy moments together.
            </p>
          </div>
        </section>

        <section className="restaurant-options-section">
          <h2>Food & Drinks</h2>

          <div className="restaurant-options-grid">
            <article id="breakfast" className="restaurant-option-card">
              <img src={breakfastImage} alt="Breakfast buffet at the hotel" />

              <h3>Breakfast</h3>

              <p>
                Start the day with a generous hotel breakfast including warm
                dishes, fresh bread, coffee, fruit and lighter morning options.
              </p>

              
            </article>

            <article id="lunch" className="restaurant-option-card">
              <img src={lunchImage} alt="Lunch buffet at the hotel" />

              <h3>Lunch</h3>

              <p>
                Enjoy a relaxed lunch with seasonal meals, salads and fresh
                options suitable for guests, meetings and everyday visitors.
              </p>

              
            </article>

            <article id="dinner" className="restaurant-option-card">
              <img src={dinnerImage} alt="Dinner service at the hotel" />

              <h3>Dinner</h3>

              <p>
                Sit down for dinner in a comfortable restaurant setting with
                carefully prepared dishes and a calm evening atmosphere.
              </p>

              
            </article>

            <article id="party" className="restaurant-option-card">
              <img src={barImage} alt="Hotel bar after work party" />

              <h3>After Work Party</h3>

              <p>
                Meet friends or colleagues after work for drinks, snacks and a
                more social evening in our hotel bar.
              </p>

              
            </article>
          </div>
        </section>

        {/* <section className="restaurant-gallery-section">
          <div className="restaurant-gallery-grid">
            <img src={breakfastImage} alt="Breakfast selection" />
            <img src={lunchImage} alt="Lunch selection" />
            <img src={dinnerImage} alt="Dinner selection" />
            <img src={barImage} alt="Bar drinks selection" />
          </div>
        </section>*/}

        <section className="restaurant-transition">
          <div className="restaurant-transition-line"></div>

          <p>
            From breakfast to after work, our restaurant and bar are made for
            relaxed meals, good conversations and memorable hotel moments.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default RestaurantBar;

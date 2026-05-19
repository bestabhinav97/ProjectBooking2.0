import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import breakfastImage from "../assets/Hotel Breakfast.png";
import lunchImage from "../assets/Hotel Lunch.png";
import dinnerImage from "../assets/Hotel Dinner.png";
import barImage from "../assets/Hotel Bar.png";

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
    <div className="restaurant-page">
      <TopBar />
      <Header />

      <main>
        <section className="restaurant-hero">
          <div className="restaurant-hero-content">
            <p className="restaurant-kicker">Taste & atmosphere</p>
            <h1>Restaurant & Bar</h1>
            <p>
              Enjoy breakfast, lunch, dinner and after work moments in a warm
              hotel atmosphere.
            </p>
          </div>
        </section>

        <section className="restaurant-main-section">
          <div className="restaurant-intro">
            <p className="restaurant-cursive">Food made for the moment</p>
            <h2>Restaurant & Bar</h2>
            <p>
              Choose the moment that fits your stay. Start the morning with
              breakfast, enjoy lunch, sit down for dinner or meet friends after
              work.
            </p>
          </div>

          <div className="restaurant-section-list">
            <article id="breakfast" className="restaurant-detail-section">
              <img
                src={breakfastImage}
                alt="Hotel breakfast buffet with bread, fruit, eggs and warm dishes"
                className="restaurant-section-image"
              />

              <div className="restaurant-section-content">
                <p className="restaurant-cursive">Morning comfort</p>
                <h2>Breakfast</h2>
                <p>
                  Begin the day with a fresh hotel breakfast including warm
                  dishes, coffee, fruit, bread and lighter options.
                </p>
              </div>
            </article>

            <article id="lunch" className="restaurant-detail-section">
              <img
                src={lunchImage}
                alt="Hotel lunch buffet with salads, wraps, pasta and fresh dishes"
                className="restaurant-section-image"
              />

              <div className="restaurant-section-content">
                <p className="restaurant-cursive">Midday dining</p>
                <h2>Lunch</h2>
                <p>
                  Enjoy a relaxed lunch with seasonal dishes, lighter meals and
                  fresh options for guests, meetings and visitors.
                </p>
              </div>
            </article>

            <article id="dinner" className="restaurant-detail-section">
              <img
                src={dinnerImage}
                alt="Hotel dinner buffet with warm dishes, salmon, potatoes and salads"
                className="restaurant-section-image"
              />

              <div className="restaurant-section-content">
                <p className="restaurant-cursive">Evening taste</p>
                <h2>Dinner</h2>
                <p>
                  Sit down for dinner in a comfortable setting with carefully
                  prepared dishes and a calm hotel atmosphere.
                </p>
              </div>
            </article>

            <article id="party" className="restaurant-detail-section">
              <img
                src={barImage}
                alt="Hotel bar after work party with drinks and snacks"
                className="restaurant-section-image"
              />

              <div className="restaurant-section-content">
                <p className="restaurant-cursive">After work</p>
                <h2>After Work Party</h2>
                <p>
                  Meet friends or colleagues after work for drinks, snacks and a
                  more social evening in the bar.
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

export default RestaurantBar;
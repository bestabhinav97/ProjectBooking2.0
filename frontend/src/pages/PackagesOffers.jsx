import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import brunch from "../assets/brunch.jpg";
import spaOffer from "../assets/spa-offer.jpg";
import mothersDay from "../assets/mothers-day.jpg";

function PackagesOffers() {
  return (
    <>
      <TopBar />
      <Header />

      <main className="offers-page">

        <section className="offers-hero">

          <h1>
            Experiences designed
            for relaxation and comfort
          </h1>

        </section>

        <section className="offers-grid">

          {/* Card 1 */}
          <article className="offer-card">

            <h2>Sunday Brunch</h2>

            <img
              src={brunch}
              alt="Sunday brunch"
            />

            <p>
              When luxury hotel breakfast meets lunch!
            </p>

            <p>
              Perfect for a cozy moment with family and friends.
            </p>

           

            <p className="offer-book">
              Book by phone: 0431 57 33 44
            </p>

          </article>

          {/* Card 2 */}
          <article className="offer-card">

            <h2>Spa Offer</h2>

            <img
              src={spaOffer}
              alt="Spa treatment"
            />

            <p>
              <strong>
                Classic facial treatment 50 min 695 SEK
                {" "}
                (regular price 895 SEK)
              </strong>
            </p>

            <p>
              The treatment includes cleansing, peeling and pore cleansing.
              Massage of the face, décolletage and neck.
              Finished with a mask and cream.
              Your brows can also be shaped if desired.
            </p>

            <p>
              Access to our relaxation area is also included.
            </p>

            <p>
              The offer is valid every day in May and June 2026.
              Cannot be combined with other offers or discounts.
            </p>

            <p className="offer-book">
              Book by phone: 0431 57 33 44
            </p>

          </article>

          {/* Card 3 */}
          <article className="offer-card">

            <h2>Mother’s Day Brunch</h2>

            <img
              src={mothersDay}
              alt="Mother's Day brunch"
            />

            <p>
              Celebrate Mother’s Day with a luxury brunch
              and give mum a truly cozy moment together
              with the family!
            </p>

            <p>
              We serve a generous buffet filled with delicacies
              for every taste.
            </p>

            <p>
              Available on 31 May 2026.
            </p>

            <p className="offer-book">
              Book by phone: 0431 57 33 44
            </p>

          </article>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default PackagesOffers;
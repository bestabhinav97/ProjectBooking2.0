import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import meetingSlide1 from "../assets/meeting-slide-1.jpg";
import meetingSlide2 from "../assets/meeting-slide-2.jpg";
import meetingSlide3 from "../assets/meeting-slide-3.jpg";
import meetingSlide4 from "../assets/meeting-slide-4.jpg";

import meetingRoom1 from "../assets/meeting-room-1.jpg";
import meetingRoom2 from "../assets/meeting-room-2.jpg";
import meetingRoom3 from "../assets/meeting-room-3.jpg";
import meetingLounge from "../assets/meeting-lounge.jpg";

import meetingGallery1 from "../assets/meeting-gallery-1.jpg";
import meetingGallery2 from "../assets/meeting-gallery-2.jpg";
import meetingGallery3 from "../assets/meeting-gallery-3.jpg";
import meetingGallery4 from "../assets/meeting-gallery-4.jpg";
import meetingGallery5 from "../assets/meeting-gallery-5.jpg";
import meetingGallery6 from "../assets/meeting-gallery-6.jpg";
import meetingGallery7 from "../assets/meeting-gallery-7.jpg";
import meetingGallery8 from "../assets/meeting-gallery-8.jpg";

function MeetingsEvents() {
  return (
    <>
      <TopBar />
      <Header />

      <main className="meetings-events-page">
        <section className="meetings-slideshow">
          <img src={meetingSlide1} alt="Conference room" />
          <img src={meetingSlide2} alt="Meeting room" />
          <img src={meetingSlide3} alt="Business meeting" />
          <img src={meetingSlide4} alt="Event setup" />
        </section>

        <div className="meetings-line-break"></div>

        <section className="meetings-intro-section">
          <div className="meetings-intro-content">
            <h1>Meetings</h1>

            <p>
              Plan your next business meeting, conference or special event with
              us and choose from our dedicated and flexible meeting spaces which
              are accompanied by various dining options to match your
              requirements. 
            </p>

            <p>
              Our centrally located conference and meeting venue offers catering
              for groups of all sizes and our versatile spaces can seamlessly
              transition from elegant conference-style facilities into stunning
              settings for product launches, receptions and parties.
            </p>

            <p>
              Contact our Meetings & Events Team at{" "}
              <a href="mailto:conference@hotelaurora.se">
                conference@hotelaurora.se
              </a>
            </p>
          </div>
        </section>

        <section className="meeting-rooms-section">
          <h2>Meeting Rooms</h2>

          <div className="meeting-rooms-grid">
            <article className="meeting-room-card">
              <img src={meetingRoom1} alt="Esther meeting room" />

              <h3>Esther</h3>

              <p>
                Esther is our largest room, situated at lobby level. Esther can
                accommodate up to 300 people in cinema seating. The room is
                equipped for conferences, presentations, receptions and larger
                business events.
              </p>

              <a href="mailto:conference@hotelaurora.se">Send request</a>
            </article>

            <article className="meeting-room-card">
              <img src={meetingRoom2} alt="Wega meeting room" />

              <h3>Wega</h3>

              <p>
                Wega is perfect for smaller conferences or board meetings with
                capacity for up to 16 people in a calm and focused environment.
                Ideal for management groups and private business meetings.
              </p>

              <a href="mailto:conference@hotelaurora.se">Send request</a>
            </article>

            <article className="meeting-room-card">
              <img src={meetingRoom3} alt="Thor meeting room" />

              <h3>Thor</h3>

              <p>
                Thor is our fully equipped medium-sized room with capacity for
                up to 36 people in cinema seating. Perfect for workshops, team
                sessions and professional business meetings.
              </p>

              <a href="mailto:conference@hotelaurora.se">Send request</a>
            </article>

            <article className="meeting-room-card">
              <img src={meetingLounge} alt="Elsa lounge area" />

              <h3>Elsa</h3>

              <p>
                Elsa is our flexible lounge area designed for networking, coffee
                breaks, mingling and informal gatherings. The perfect space for
                relaxed conversations between sessions and team activities.
              </p>

              <a href="mailto:conference@hotelaurora.se">Send request</a>
            </article>
          </div>
        </section>

        <section className="meetings-transition">
            <div className="meetings-transition-line"></div>

            <p>
                Designed for productive meetings, memorable events and comfortable
                experiences in the heart of the city.
            </p>
        </section>

        <section className="meetings-gallery-section">
          <div className="meetings-gallery-grid">
            <img src={meetingGallery1} alt="Meeting gallery 1" />
            <img src={meetingGallery2} alt="Meeting gallery 2" />
            <img src={meetingGallery3} alt="Meeting gallery 3" />
            <img src={meetingGallery4} alt="Meeting gallery 4" />
            <img src={meetingGallery5} alt="Meeting gallery 5" />
            <img src={meetingGallery6} alt="Meeting gallery 6" />
            <img src={meetingGallery7} alt="Meeting gallery 7" />
            <img src={meetingGallery8} alt="Meeting gallery 8" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MeetingsEvents;
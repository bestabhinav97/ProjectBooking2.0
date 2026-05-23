import grid1 from "../assets/grid1.jpg";
import grid2 from "../assets/grid2.jpg";
import grid3 from "../assets/grid3.jpg";
import grid4 from "../assets/grid4.jpg";
import grid5 from "../assets/grid5.jpg";
import grid6 from "../assets/grid6.jpg";
import grid7 from "../assets/grid7.jpg";
import grid8 from "../assets/grid8.jpg";
import grid9 from "../assets/grid9.jpg";

function GalleryGrid() {

  const images = [
    grid1,
    grid2,
    grid3,
    grid4,
    grid5,
    grid6,
    grid7,
    grid8,
    grid9,
  ];

  return (
    <section className="gallery-grid-section">

      <div className="gallery-header">
        <p>Let’s stay friends!</p>

        <h2>
          Follow us on Instagram:
          <span> @HotelAurora</span>
        </h2>
      </div>

      <div className="gallery-grid">

        {images.map((image, index) => (
          <div
            className="gallery-item"
            key={index}
          >
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
            />
          </div>
        ))}

      </div>

    </section>
  );
}

export default GalleryGrid;
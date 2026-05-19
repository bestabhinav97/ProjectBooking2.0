function MapSection() {
  return (
    <section className="map-section">

      <div className="map-content">

        <p>Location</p>

        <h2>
          In the heart of the city,
          close to everything
        </h2>

        <span>
          Aurora Hotel <br />
          Central Stockholm <br />
          5 minutes from Central Station
        </span>

      </div>

      <div className="map-wrapper">

        <iframe
          title="Aurora Hotel Location"
          src="https://maps.google.com/maps?q=59.32849,18.0782391&t=&z=15&ie=UTF8&iwloc=&output=embed"
          allowFullScreen=""
          loading="lazy"
        ></iframe>

      </div>

    </section>
  );
}

export default MapSection;
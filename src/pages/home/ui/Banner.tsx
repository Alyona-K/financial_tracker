import banner from "@/assets/images/home-banner.png";
import "./Banner.scss";

function Banner() {
  return (
    <section className="home__banner">
      <div className="home__content-top">
        <h2 className="home__heading-top">Welcome to FinTrack!</h2>
        <p className="home__text-top">
          Your personal finance dashboard is ready. Explore your finances with
          ease.
        </p>
      </div>

      <div className="home__content-bottom-wrap">
        <img
          className="home__banner-img"
          src={banner}
          alt="Home banner"
          width={1520}
          height={676}
        />
        <div className="home__content-bottom">
          <div className="home__heading-bottom-wrap">
            <span className="home__heading-bottom home__heading-bottom--1">
              Track.
            </span>
            <span className="home__heading-bottom home__heading-bottom--2">
              Manage.
            </span>
            <span className="home__heading-bottom home__heading-bottom--3">
              Relax.
            </span>
          </div>
          <p className="home__text-bottom">
            Stay on top of your money with FinTrack.
          </p>
          <p className="home__text-bottom">
            Manage your finances simply, clearly, and all in one spot.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Banner;

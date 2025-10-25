import "./Welcome.css";

function Welcome() {
  return (
    <div className="overview__welcome">
      <h2 className="overview__title">Welcome back, Julia!</h2>
      <p className="overview__text">
        This dashboard provides a personalized overview of your financial
        well-being and allows you to easily access key features of FinTrack.
      </p>
    </div>
  );
}

export default Welcome;

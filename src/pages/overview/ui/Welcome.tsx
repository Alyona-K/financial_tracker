import { useUserStore } from "@/entities/user/model/user.store"; 
import "./Welcome.css";

function Welcome() {
  const user = useUserStore((s) => s.user);
  return (
    <div className="overview__welcome">
      <h2 className="overview__title">Welcome back, {user?.firstName ?? "Guest"}!</h2>
      <p className="overview__text">
        This dashboard provides a personalized overview of your financial
        well-being and allows you to easily access key features of FinTrack.
      </p>
    </div>
  );
}

export default Welcome;

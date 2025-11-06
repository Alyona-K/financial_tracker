import notFoundImg from "@/assets/images/404.png";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <img
        className="not-found-page__img"
        src={notFoundImg}
        alt="Page not found"
      />
    </div>
  );
};

export default NotFound;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    const section = location.state?.scrollTo;
    if (!section) return;

    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);
}

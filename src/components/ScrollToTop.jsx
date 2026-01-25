import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sayfa yolu (pathname) değiştiğinde ekranı en tepeye (0, 0) kaydır
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
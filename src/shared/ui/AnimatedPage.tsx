import { motion } from "framer-motion";
import React from "react";

type AnimatedPageProps = {
  children: React.ReactNode;
};

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}     // старт: прозрачность 0 и смещение вниз
      animate={{ opacity: 1, y: 0 }}      // вход: появляется и поднимается
      exit={{ opacity: 0, y: -20 }}       // выход: исчезает и уходит вверх
      transition={{ duration: 0.3 }}      // длительность анимации
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
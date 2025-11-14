import { motion } from "framer-motion";
import React from "react";

type AnimatedPageProps = {
  children: React.ReactNode;
};

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}   
      animate={{ opacity: 1, y: 0 }}      
      exit={{ opacity: 0, y: -20 }}       
      transition={{ duration: 0.3 }}      
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
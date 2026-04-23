"use client";

import { useEffect } from "react";
import AOS from "aos";

const AOSInitializer = () => {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: false, 
      mirror: false,
    });
    AOS.refresh(); 
  }, []);

  return null;
};

export default AOSInitializer;

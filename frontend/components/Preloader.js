"use client";
import { useEffect, useState } from "react";

const Preloader = () => {
  const [load, setLoad] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);
  return (
    <div className="preloader21" style={{ display: load ? "flex" : "none" }}>
      <div className="custom-loader2" />
    </div>
  );
};
export default Preloader;

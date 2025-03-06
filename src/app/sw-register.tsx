"use client";

import { useEffect } from "react";

const SWRegister = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered: ", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed: ", error);
        });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("New service worker activated. Refreshing the page...");
        window.location.reload();
      });
    }
  }, []);

  return null;
};

export default SWRegister;

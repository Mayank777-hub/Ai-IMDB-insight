'use client'
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
  
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId = "session_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      localStorage.setItem("session_id", sessionId);
    }

    
    const sendEvent = async (eventType, extraData = {}) => {
      const eventPayload = {
        session_id: sessionId,
        event_type: eventType,
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
        ...extraData
      };

      try {
        await fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
      } catch (error) {
        console.error("Failed to send event to backend port:", error);
      }
    };

   
    sendEvent("page_view");

    const handleGlobalClick = (e) => {
      sendEvent("click", { x: e.clientX, y: e.clientY });
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [pathname]);

  return null;
}
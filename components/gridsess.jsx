"use client";

import { useEffect, useState } from "react";
import { Users, Route, Clock, MousePointer ,ChartNoAxesCombined,IdCard} from "lucide-react";
import "./sessions.css"; 

export default function SessionsView() {
  const [sessions, setSessions] = useState([]);
  const [sessid, setsessid] = useState(null);
  const [trackpath, settrackpath] = useState([]);
  const [loadJ, setloadJ] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  const handleSessionClick = (sessionId) => {
    setsessid(sessionId);
    setloadJ(true);
    
    fetch(`http://localhost:5000/api/sessions/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        settrackpath(data);
        setloadJ(false);
      })
      .catch((err) => {
        console.error("Error fetching session journey:", err);
        setloadJ(false);
      });
  };

  return (
    <div className="sessions-container">
      <h2 className="sessions-title">
        <Users size={22} style={{ color: "#2563eb" }} /> User Sessions & Journeys
      </h2>
      <p className="sessions-subtitle">
        Select an active user session ID to trace their historical navigation timeline.
      </p>

      <div className="sessions-layout-split">
        
       
        <div className="sessions-left-panel">
          <h3 className="sessions-panel-title">Active Sessions ({sessions.length})</h3>
          <div className="sessions-list-scroll">
            {sessions.length === 0 ? (
              <p className="session-empty-text">No active sessions found.</p>
            ) : (
              sessions.map((sess) => {
                const isSelected = sess._id === sessid;
                return (
                  <div
                    key={sess._id}
                    onClick={() => handleSessionClick(sess._id)}
                    className={`session-item-row ${isSelected ? "selected" : ""}`}
                  >
                    <div className="session-id-text"><IdCard/> ID: {sess._id}</div>
                    <div className="session-count-text">
                       Total Actions: <strong>{sess.eventCount}</strong>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        
        <div className="sessions-right-panel">
          <h3 className="sessions-panel-title">User Journey Timeline</h3>
          <div className="journey-terminal-box">
            {!sessid ? (
              <div className="journey-placeholder">
                <Route size={24} style={{ marginBottom: "8px", display: "block" }} />
                Select a session row on the left to unpack the event stream traces
              </div>
            ) : loadJ ? (
              <div className="journey-placeholder">Loading user event log traces...</div>
            ) : (
              <div className="journey-stream-container">
                {trackpath.map((event, index) => (
                  <div key={event._id || index} className="timeline-step-node">
                    <div className={`timeline-bullet-pin ${event.event_type}`} />

                    <div className="step-meta-header">
                      <span className={`badge-event-type ${event.event_type}`}>
                        {event.event_type === "click" ? (
                          <MousePointer size={10} style={{ marginRight: "3px", inlineSize: "auto" }} />
                        ) : (
                          <Clock size={10} style={{ marginRight: "3px", inlineSize: "auto" }} />
                        )}
                        {event.event_type}
                      </span>
                      <span className="step-timestamp">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="step-url-details">
                       <strong>URL:</strong> {event.page_url}
                    </div>

                    {event.event_type === "click" && (
                      <div className="step-coords-details">
                         <strong>Coordinates:</strong> X: {event.x}px | Y: {event.y}px
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
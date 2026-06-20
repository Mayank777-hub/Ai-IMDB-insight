"use client";

import { useEffect, useState } from "react";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
export default function HeatmapView() {
  const [selectedUrl, setSelectedUrl] = useState("http://localhost:3000/");
  const [gridData, setGridData] = useState({});
  const [maxClicks, setMaxClicks] = useState(1);
  
  
  const [gridDimensions, setGridDimensions] = useState({ rows: 12, cols: 26 });

  const CELL_SIZE = 55; 

  useEffect(() => {
    fetch(`http://localhost:5000/api/heatmap?pageUrl=${encodeURIComponent(selectedUrl)}`)
      .then((res) => res.json())
      .then((clicks) => {
        const matrix = {};
        let highestCount = 1;
        let maxColFound = 14;
        let maxRowFound = 10;

        clicks.forEach((click) => {
          const col = Math.floor(click.x / CELL_SIZE);
          const row = Math.floor(click.y / CELL_SIZE);
          const cellKey = `${row}-${col}`;

          
          if (col > maxColFound) maxColFound = col;
          if (row > maxRowFound) maxRowFound = row;

          matrix[cellKey] = (matrix[cellKey] || 0) + 1;
          if (matrix[cellKey] > highestCount) {
            highestCount = matrix[cellKey];
          }
        });

        
        setGridDimensions({ rows: maxRowFound + 2, cols: maxColFound + 2 });
        setGridData(matrix);
        setMaxClicks(highestCount);
      })
      .catch((err) => console.error("Error loading grid analytics:", err));
  }, [selectedUrl]);

  const rows = Array.from({ length: gridDimensions.rows });
  const cols = Array.from({ length: gridDimensions.cols });

  return (
    <div style={{
      padding: "24px",
      margin: "24px auto",
      backgroundColor: "white",
      borderRadius: "12px",
      border: "1px solid rgb(229, 231, 235)",
      color: "black",
      fontFamily: "sans-serif"
    }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "4px",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"row", gap:"5px",width:"100vw",height:"50px"}}>
        <ChartNoAxesColumnIncreasing size={20}/> Row & Column Grid Heatmap
      </h2>
      <p style={{ fontSize: "0.875rem", color: "rgb(107, 114, 128)", marginBottom: "16px" }}>
        Click concentrations mapped into responsive grid matrix zones.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <select 
          value={selectedUrl} 
          onChange={(e) => setSelectedUrl(e.target.value)}
          style={{
            border: "1px solid rgb(209, 213, 219)",
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: "rgb(249, 250, 251)",
            color: "black",
            fontSize: "0.875rem"
          }}
        >
          <option value="http://localhost:3000/">Home Page (`/`)</option>
  <option value="http://localhost:3000/movie">Movie Details (`/movie` updates)</option>
        </select>
      </div>

      
      <div style={{ width: "100%", overflowX: "auto", whiteSpace: "nowrap" }}>
        <div style={{ 
          display: "inline-block",
          border: "2px solid rgb(51, 65, 85)", 
          backgroundColor: "rgb(15, 23, 42)", 
          padding: "4px",
          borderRadius: "8px" 
        }}>
          {rows.map((_, rowIndex) => (
            <div key={rowIndex} style={{ display: "flex" }}>
              {cols.map((_, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const clickCount = gridData[cellKey] || 0;
                
                const ratio = clickCount / maxClicks;
                const cellColor = clickCount > 0 
                  ? `rgba(220, 38, 38, ${0.3 + ratio * 0.7})` 
                  : "transparent";

                return (
                  <div
                    key={colIndex}
                    title={`Cell [R:${rowIndex}, C:${colIndex}] - Clicks: ${clickCount}`}
                    style={{
                      width: `${CELL_SIZE}px`,
                      height: `${CELL_SIZE}px`,
                      border: "1px solid rgba(51, 65, 85, 0.2)",
                      backgroundColor: cellColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: clickCount > 0 ? "white" : "#475569",
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      flexShrink: 0
                    }}
                  >
                    {clickCount > 0 ? clickCount : `${rowIndex},${colIndex}`}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
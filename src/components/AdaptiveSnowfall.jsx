import React from "react";
import Snowfall from "react-snowfall";
import { useLocation } from "react-router-dom";

// 🎨 Snow colors (realistic tones)
const getSnowColors = (themeMode) => {
  return themeMode === "dark"
    ? ["#ffffff", "#cfd8dc", "#b0bec5"]
    : ["#ffffff", "#e3f2fd", "#f1f8ff"];
};

// ❄️ REAL SNOWFLAKE (SVG)
const Snowflake = ({ size, color }) => {
  return (
    <div
      style={{
        transform: `rotate(${Math.random() * 360}deg)`,
        opacity: Math.random() * 0.4 + 0.6,
        filter: `drop-shadow(0 0 ${size * 2}px ${color})`,
      }}
    >
      <svg
        width={size * 4}
        height={size * 4}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07L19.07 4.93" />
      </svg>
    </div>
  );
};

// ❄️ Snow layer component (for depth)
const SnowLayer = ({ count, speed, wind, radius, themeMode }) => {
  const colors = getSnowColors(themeMode);

  return (
    <Snowfall
      snowflakeCount={count}
      speed={speed}
      wind={wind}
      radius={radius}
      snowflakeComponent={() => {
        const size = Math.random() * (radius[1] - radius[0]) + radius[0];
        const color = colors[Math.floor(Math.random() * colors.length)];

        return <Snowflake size={size} color={color} />;
      }}
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 100,
        pointerEvents: "none",
      }}
    />
  );
};

export default function AdaptiveSnowfall({ themeMode = "light" }) {
  const location = useLocation();
  const path = location.pathname;

  const isAuthPage =
    path === "/login" ||
    path === "/register" ||
    path === "/verify-otp" ||
    path === "/forgot-password";

  return (
    <>
      {isAuthPage ? (
        // 🌸 LOGIN → soft snowfall
        <>
          <SnowLayer
            count={60}
            speed={[0.1, 0.4]}
            wind={[-0.1, 0.1]}
            radius={[1, 2]}
            themeMode={themeMode}
          />
          <SnowLayer
            count={40}
            speed={[0.2, 0.6]}
            wind={[-0.2, 0.2]}
            radius={[1.5, 2.5]}
            themeMode={themeMode}
          />
        </>
      ) : (
        // 🌨️ DASHBOARD → realistic snowfall
        <>
          {/* 🌌 Far (small, slow) */}
          <SnowLayer
            count={150}
            speed={[0.1, 0.5]}
            wind={[-0.2, 0.2]}
            radius={[0.5, 1.5]}
            themeMode={themeMode}
          />

          {/* 🌫️ Mid */}
          <SnowLayer
            count={150}
            speed={[0.3, 1]}
            wind={[-0.4, 0.4]}
            radius={[1, 3]}
            themeMode={themeMode}
          />

          {/* ❄️ Front (big, fast) */}
          <SnowLayer
            count={150}
            speed={[0.8, 2]}
            wind={[-0.6, 0.6]}
            radius={[2, 4]}
            themeMode={themeMode}
          />
        </>
      )}
    </>
  );
}

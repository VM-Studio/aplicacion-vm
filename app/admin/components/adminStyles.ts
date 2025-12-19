import { CSSProperties } from "react";

export const navStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 100,
  background: "#fcfdfc",
  borderBottom: "1px solid #e5e5e5",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 1000,
};

export const sidebarStyle: CSSProperties = {
  position: "fixed",
  top: 100,
  left: 0,
  height: "calc(100vh - 100px)",
  background: "#f6f7fa",
  borderRight: "1.5px solid #e6eaf0",
  display: "flex",
  flexDirection: "column",
  zIndex: 120,
};

export const selectedSidebarButton: CSSProperties = {
  background: "#0049ff",
  color: "#fff",
  fontWeight: 700,
};

export const secondarySidebarButton: CSSProperties = {
  background: "#0049ff",
  color: "#fff",
  fontWeight: 500,
};

# 🌍 GeoGame (Offline Mode)

A simple **GeoGuessr-like game** built with **React + Material UI + Leaflet**.
Instead of Mapillary or Google Street View, this version uses **local panorama images** stored in `public/panos`.

---

## ✨ Features
- 🔹 **Offline panoramas**: 5 fixed locations with real coordinates
  - `1.jpg` → Tokyo (Shibuya Crossing)
  - `2.jpg` → Venice (Rialto Bridge)
  - `3.jpg` → Alter do Chão (Brazil)
  - `4.jpg` → Vancouver Downtown
  - `5.jpg` → Paris (France)
- 🔹 Interactive **guess map** (Leaflet + OpenStreetMap)
- 🔹 **Timer** per round (90 seconds)
- 🔹 **Scoring system** based on haversine distance
- 🔹 **Round summary** + **Final summary**

---

## 🛠 Tech Stack
- [React](https://react.dev/)
- [Material UI](https://mui.com/)
- [Leaflet](https://leafletjs.com/) via [React-Leaflet](https://react-leaflet.js.org/)
- Custom offline panorama loader

---

## 📂 Project Structure

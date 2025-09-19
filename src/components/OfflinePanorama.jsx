import { useEffect, useRef } from "react";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

export default function OfflinePanorama({ src, onReady }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !src) return;

    const viewer = new Viewer({
      container: ref.current,
      panorama: src,
      touchmoveTwoFingers: true,
      navbar: ["zoom", "fullscreen"],
      mousemove: true,
    });

    const onReadyCb = () => onReady?.();
    viewer.on("ready", onReadyCb);

    const resizeId = setTimeout(() => viewer.resize({}), 0);

    return () => {
      clearTimeout(resizeId);
      viewer.off("ready", onReadyCb);
      viewer.destroy();
    };
  }, [src, onReady]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

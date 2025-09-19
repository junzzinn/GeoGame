export default function PlainImage({ src }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt="scene"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

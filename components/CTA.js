export default function CTA({ text = "Prueba gratis", href = "/checkout", size = "medium" }) {
  return (
    <a href={href} className={`btn ${size === "large" ? "large" : ""}`}>
      {text}
    </a>
  );
}
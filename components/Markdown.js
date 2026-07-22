// Renderizador de Markdown mínimo y sin dependencias.
// Soporta: # / ## / ### encabezados, listas con "-", párrafos, imágenes
// ![alt](src) (en su propia línea = bloque), **negritas** y [links](url).

// Convierte texto en línea con **negrita**, [link](url) e imágenes en nodos React.
function inline(text) {
  const re = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  const out = [];
  let last = 0;
  let m;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      out.push(
        <img
          key={`i${k++}`}
          src={m[2]}
          alt={m[1] || ""}
          style={{ maxWidth: "100%", borderRadius: "10px", verticalAlign: "middle" }}
        />
      );
    } else if (m[4] !== undefined) {
      out.push(
        <a key={`a${k++}`} href={m[4]} style={{ color: "#2EC4B6", fontWeight: 600 }}>
          {m[3]}
        </a>
      );
    } else if (m[5] !== undefined) {
      out.push(<strong key={`b${k++}`}>{m[5]}</strong>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const IMG_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

export default function Markdown({ source }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let list = null;

  const flushList = () => {
    if (list) {
      blocks.push({ type: "ul", items: list });
      list = null;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushList();
      continue;
    }
    if (IMG_LINE.test(trimmed)) {
      flushList();
      const mm = trimmed.match(IMG_LINE);
      blocks.push({ type: "img", alt: mm[1], src: mm[2] });
    } else if (trimmed.startsWith("### ")) {
      flushList();
      blocks.push({ type: "h3", text: trimmed.slice(4) });
    } else if (trimmed.startsWith("## ")) {
      flushList();
      blocks.push({ type: "h2", text: trimmed.slice(3) });
    } else if (trimmed.startsWith("# ")) {
      flushList();
      blocks.push({ type: "h1", text: trimmed.slice(2) });
    } else if (trimmed.startsWith("- ")) {
      if (!list) list = [];
      list.push(trimmed.slice(2));
    } else {
      flushList();
      blocks.push({ type: "p", text: trimmed });
    }
  }
  flushList();

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h1":
            return (
              <h1 key={i} style={{ color: "#0E3A39", marginBottom: "24px" }}>
                {inline(block.text)}
              </h1>
            );
          case "h2":
            return (
              <h2 key={i} style={{ color: "#2EC4B6", marginTop: "40px", marginBottom: "16px" }}>
                {inline(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} style={{ marginTop: "32px", marginBottom: "12px" }}>
                {inline(block.text)}
              </h3>
            );
          case "img":
            return (
              <img
                key={i}
                src={block.src}
                alt={block.alt || ""}
                style={{
                  display: "block",
                  width: "100%",
                  borderRadius: "16px",
                  margin: "32px 0",
                }}
              />
            );
          case "ul":
            return (
              <ul key={i} style={{ paddingLeft: "24px", marginBottom: "24px" }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: "8px" }}>
                    {inline(item)}
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={i} style={{ marginBottom: "20px" }}>
                {inline(block.text)}
              </p>
            );
        }
      })}
    </>
  );
}

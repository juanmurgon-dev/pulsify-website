// Renderizador de Markdown mínimo y sin dependencias.
// Soporta: # / ## / ### encabezados, listas con "-" y párrafos.
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
    if (trimmed.startsWith("### ")) {
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
                {block.text}
              </h1>
            );
          case "h2":
            return (
              <h2
                key={i}
                style={{ color: "#2EC4B6", marginTop: "40px", marginBottom: "16px" }}
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} style={{ marginTop: "32px", marginBottom: "12px" }}>
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} style={{ paddingLeft: "24px", marginBottom: "24px" }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: "8px" }}>
                    {item}
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={i} style={{ marginBottom: "20px" }}>
                {block.text}
              </p>
            );
        }
      })}
    </>
  );
}

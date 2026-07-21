import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main>
      <section className="section" style={{ paddingTop: "120px" }}>
        <div className="container" style={{ maxWidth: "600px" }}>
          <h1>Checkout</h1>
          <Link href="/">← Volver</Link>
        </div>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f8fc",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: "0 0 12px 0",
            fontSize: "32px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          Payment Successful
        </h1>

        <p
          style={{
            margin: "0 0 18px 0",
            color: "#6b7280",
            fontSize: "16px",
            lineHeight: 1.6,
          }}
        >
          Your payment was submitted successfully through Stripe.
        </p>

        <a
          href="/dashboard"
          style={{
            display: "inline-block",
            padding: "12px 18px",
            borderRadius: "12px",
            background: "#111827",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
    color: "#111827",
    fontFamily: "Arial, sans-serif",
  } as const,
  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "28px 20px 60px",
  } as const,
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  } as const,
  brandWrap: {
    display: "flex",
    flexDirection: "column" as const,
  },
  brand: {
    fontSize: "15px",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "#4f46e5",
  } as const,
  brandSub: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
  } as const,
  navButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
  },
  navButton: {
    padding: "10px 14px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "14px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
  } as const,
  navButtonPrimary: {
    padding: "10px 14px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "14px",
    border: "none",
    background: "#111827",
    color: "#ffffff",
  } as const,
  hero: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    alignItems: "center",
    background: "linear-gradient(135deg, #111827, #1f2937)",
    color: "white",
    borderRadius: "24px",
    padding: "34px",
    boxShadow: "0 22px 50px rgba(15, 23, 42, 0.18)",
    marginBottom: "26px",
  } as const,
  heroTitle: {
    fontSize: "44px",
    lineHeight: 1.05,
    fontWeight: 800,
    margin: "0 0 14px 0",
  } as const,
  heroText: {
    fontSize: "16px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.88)",
    margin: "0 0 20px 0",
    maxWidth: "620px",
  } as const,
  heroActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
  },
  heroButtonPrimary: {
    padding: "13px 18px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: 800,
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
  } as const,
  heroButtonSecondary: {
    padding: "13px 18px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: 800,
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#ffffff",
    fontSize: "14px",
  } as const,
  heroCard: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "20px",
    padding: "20px",
    backdropFilter: "blur(8px)",
  } as const,
  statLabel: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.72)",
    marginBottom: "6px",
  } as const,
  statValue: {
    fontSize: "24px",
    fontWeight: 800,
    marginBottom: "14px",
  } as const,
  section: {
    marginTop: "30px",
  } as const,
  sectionTitle: {
    fontSize: "28px",
    fontWeight: 800,
    margin: "0 0 10px 0",
    color: "#111827",
  } as const,
  sectionText: {
    color: "#6b7280",
    margin: "0 0 18px 0",
    lineHeight: 1.6,
  } as const,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  } as const,
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  } as const,
  cardTitle: {
    fontSize: "18px",
    fontWeight: 800,
    margin: "0 0 10px 0",
  } as const,
  cardText: {
    margin: 0,
    color: "#6b7280",
    lineHeight: 1.6,
    fontSize: "14px",
  } as const,
  cta: {
    marginTop: "34px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap" as const,
  } as const,
  ctaTitle: {
    fontSize: "24px",
    fontWeight: 800,
    margin: "0 0 8px 0",
  } as const,
  ctaText: {
    margin: 0,
    color: "#6b7280",
    lineHeight: 1.6,
  } as const,
  ctaButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
  },
  ctaPrimary: {
    padding: "12px 16px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 800,
    background: "#111827",
    color: "#ffffff",
  } as const,
  ctaSecondary: {
    padding: "12px 16px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 800,
    background: "#eef2ff",
    color: "#3730a3",
  } as const,
};

export default function HomePage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.brandWrap}>
            <span style={styles.brand}>STAMPLE</span>
            <span style={styles.brandSub}>Mobile notary booking platform</span>
          </div>

          <div style={styles.navButtons}>
            <Link href="/login" style={styles.navButton}>
              Login
            </Link>
            <Link href="/signup" style={styles.navButtonPrimary}>
              Sign Up
            </Link>
          </div>
        </nav>

        <section style={styles.hero}>
          <div>
            <h1 style={styles.heroTitle}>
              Book trusted mobile notaries without the stress.
            </h1>
            <p style={styles.heroText}>
              STAMPLE connects customers with notaries for fast, simple, and
              professional service. Customers can request appointments, and
              notaries can manage jobs, pricing, verification, and completion
              from one dashboard.
            </p>

            <div style={styles.heroActions}>
              <Link href="/signup" style={styles.heroButtonPrimary}>
                Get Started
              </Link>
              <Link href="/login" style={styles.heroButtonSecondary}>
                Log In
              </Link>
            </div>
          </div>
<Link href="/notaries" style={styles.heroButtonSecondary}>
  Browse Notaries
</Link>
          <div style={styles.heroCard}>
            <div style={styles.statLabel}>Built for</div>
            <div style={styles.statValue}>Customers & Notaries</div>

            <div style={styles.statLabel}>Core workflow</div>
            <div style={styles.statValue}>Request → Accept → Complete</div>

            <div style={styles.statLabel}>Platform focus</div>
            <div style={styles.statValue}>Speed, trust, and flexibility</div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>How STAMPLE works</h2>
          <p style={styles.sectionText}>
            The platform is built to keep booking simple for customers while
            giving notaries the control they need to manage jobs professionally.
          </p>

          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>1. Request a Notary</h3>
              <p style={styles.cardText}>
                Customers submit an address, date, and time to request a mobile
                notary appointment directly from their dashboard.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>2. Accept the Job</h3>
              <p style={styles.cardText}>
                Notaries can view open jobs, accept the right booking, and take
                control of that appointment inside the platform.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>3. Set Pricing</h3>
              <p style={styles.cardText}>
                Use standard pricing or choose a custom amount when a discount,
                deal, or special case makes more sense.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>4. Complete the Job</h3>
              <p style={styles.cardText}>
                Once the signing is done, the notary marks the booking complete
                and keeps everything organized in one place.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why it stands out</h2>
          <p style={styles.sectionText}>
            STAMPLE is more than a basic form. It is being shaped into a real
            service platform with verification, ratings, location matching, and
            business-ready workflows.
          </p>

          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Verification Ready</h3>
              <p style={styles.cardText}>
                Notaries can upload commission, license, and insurance details
                so the platform can build trust with customers.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Flexible Pricing</h3>
              <p style={styles.cardText}>
                Notaries can keep standard pricing or create custom deals for
                repeat clients, special jobs, or quick local appointments.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Built to Scale</h3>
              <p style={styles.cardText}>
                The foundation is already there for ratings, reviews, location
                matching, notifications, and payments.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.cta}>
          <div>
            <h2 style={styles.ctaTitle}>Ready to start using STAMPLE?</h2>
            <p style={styles.ctaText}>
              Create an account, log in, and start building your customer or
              notary experience right now.
            </p>
          </div>

          <div style={styles.ctaButtons}>
            <Link href="/signup" style={styles.ctaPrimary}>
              Create Account
            </Link>
            <Link href="/login" style={styles.ctaSecondary}>
              Login
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
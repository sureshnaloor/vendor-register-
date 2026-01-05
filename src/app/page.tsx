import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div className="container" style={{ textAlign: 'center', zIndex: 1 }}>
        <h1 className="title">Vendor Portal</h1>
        <p className="subtitle">Streamlined registration and management for our valued partners.</p>

        <div className="flex justify-center flex-col md:flex-row" style={{ gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>

          <Link href="/register" className="card" style={{ width: '100%', maxWidth: '400px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              {/* Icon or Graphic */}
              <div style={{ width: '60px', height: '60px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#60a5fa' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem', color: '#fff' }}>New Vendor?</h2>
              <p style={{ color: '#94a3b8' }}>Register your company to become an approved vendor. Submit your documents securely.</p>
            </div>
            <button className="btn btn-primary w-full">Start Registration &rarr;</button>
          </Link>

          <Link href="/login" className="card" style={{ width: '100%', maxWidth: '400px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(139,92,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#a78bfa' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem', color: '#fff' }}>Already Registered?</h2>
              <p style={{ color: '#94a3b8' }}>Login with your Vendor Code to update your profile or upload new documents.</p>
            </div>
            <button className="btn btn-secondary w-full">Vendor Login &rarr;</button>
          </Link>

        </div>
      </div>
    </main>
  );
}

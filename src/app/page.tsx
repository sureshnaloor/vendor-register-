import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1000px', width: '100%', textAlign: 'center', zIndex: 1 }}>

        {/* Logo Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Image
            src="/logo.jpg"
            alt="JAL International Logo"
            width={220}
            height={80}
            style={{ objectFit: 'contain', borderRadius: '8px' }}
            priority
          />
        </div>

        <h1 className="title" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '1rem' }}>Vendor Registration Portal- JAL</h1>
        <p className="subtitle" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>
          Streamlined registration portal for new suppliers to JAL International.
        </p>

        <div className="flex flex-col md-flex-row md-items-stretch" style={{ gap: '1.5rem', marginTop: '3.5rem', justifyContent: 'center' }}>

          <Link href="/register" className="card" style={{ flex: '1', maxWidth: '450px', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(245, 65, 65, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#f54141' }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.75rem', color: 'var(--foreground)' }}>New Vendor?</h2>
              <p style={{ color: 'var(--secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>Register your company to qualify as an approved vendor. Submit your documents securely and gain access to our procurement network.</p>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <button className="btn btn-primary w-full" style={{ padding: '1rem' }}>Start Registration &rarr;</button>
            </div>
          </Link>

          <Link href="/login" className="card" style={{ flex: '1', maxWidth: '450px', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transform: 'translateY(0)', transition: 'transform 0.3s ease' }}>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#3b82f6' }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.75rem', color: 'var(--foreground)' }}>Already Registered?</h2>
              <p style={{ color: 'var(--secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>Login with your Vendor Registration Code to update your profile, check status, or upload new documents.</p>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <button className="btn btn-secondary w-full" style={{ padding: '1rem' }}>Vendor Login &rarr;</button>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Vendor {
    vendorCode: string;
    companyName: string;
    email: string;
    registrationNumber: string;
    vatNumber: string;
    createdAt: string;
    [key: string]: any;
}

export default function AdminDashboardClient() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchVendors();
    }, []);

    async function fetchVendors() {
        try {
            const res = await fetch('/api/admin/vendors');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch vendors');
            setVendors(data.vendors);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--secondary)' }}>Loading vendors...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Image src="/logo.jpg" alt="JAL Logo" width={100} height={40} style={{ objectFit: 'contain' }} />
                    <h1 className="title" style={{ fontSize: '1.5rem', margin: 0 }}>Admin Management</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>Public Home</Link>
                    <button onClick={() => window.location.href = '/admin/login'} className="btn btn-secondary" style={{ fontSize: '0.875rem', color: '#f87171' }}>Logout</button>
                </div>
            </div>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: selectedVendor ? '350px 1fr' : '1fr', gap: '2rem' }}>
                {/* Vendor List */}
                <div className="card" style={{ padding: '1.5rem', height: 'fit-content', maxHeight: '80vh', overflowY: 'auto' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        Registered Vendors
                        <span style={{ fontSize: '0.75rem', fontWeight: 400, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 8px', borderRadius: '12px' }}>
                            {vendors.length} Total
                        </span>
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {vendors.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: '2rem 0' }}>No vendors found.</p>
                        ) : (
                            vendors.map(vendor => (
                                <div
                                    key={vendor.vendorCode}
                                    onClick={() => setSelectedVendor(vendor)}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        background: selectedVendor?.vendorCode === vendor.vendorCode ? 'rgba(59, 130, 246, 0.1)' : 'var(--input-bg)',
                                        border: `1px solid ${selectedVendor?.vendorCode === vendor.vendorCode ? '#3b82f6' : 'transparent'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: selectedVendor?.vendorCode === vendor.vendorCode ? '#3b82f6' : 'var(--foreground)' }}>
                                        {vendor.companyName}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--secondary)' }}>
                                        <span>Code: {vendorCodeDisplay(vendor.vendorCode)}</span>
                                        <span>{new Date(vendor.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Details Panel */}
                {selectedVendor ? (
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{selectedVendor.companyName}</h2>
                                <p style={{ color: 'var(--secondary)', margin: '0.5rem 0 0' }}>Registered on {new Date(selectedVendor.createdAt).toLocaleString()}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={async () => {
                                        const btn = document.activeElement as HTMLButtonElement;
                                        const originalText = btn?.innerText || 'Download Full Package';
                                        try {
                                            if (btn) {
                                                btn.innerText = 'Preparing...';
                                                btn.disabled = true;
                                            }
                                            const res = await fetch(`/api/admin/vendors/${selectedVendor.vendorCode}/download`);
                                            if (!res.ok) throw new Error('Download failed');

                                            const blob = await res.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `vendor_package_${selectedVendor.vendorCode}.zip`;
                                            document.body.appendChild(a);
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                            document.body.removeChild(a);
                                        } catch (err) {
                                            alert('Failed to download package');
                                        } finally {
                                            if (btn) {
                                                btn.innerText = originalText;
                                                btn.disabled = false;
                                            }
                                        }
                                    }}
                                    className="btn btn-primary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                >
                                    Download Full Package
                                </button>
                                <button onClick={() => setSelectedVendor(null)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Close Details</button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                            {/* Info Section */}
                            <div>
                                <SectionHeader title="Account Details" />
                                <InfoRow label="Vendor Code" value={selectedVendor.vendorCode} code />
                                <InfoRow label="Official Email" value={selectedVendor.email} />
                                <InfoRow label="Accounts Email" value={selectedVendor.accountsEmail} />
                                <InfoRow label="Registration (CR)" value={selectedVendor.registrationNumber} />
                                <InfoRow label="VAT Number" value={selectedVendor.vatNumber} />
                                <InfoRow label="Company Type" value={selectedVendor.companyType} />
                                <InfoRow label="Year Registered" value={selectedVendor.yearRegistered} />

                                <SectionHeader title="Contact" style={{ marginTop: '2rem' }} />
                                <InfoRow label="Telephone" value={selectedVendor.telephone} />
                                <InfoRow label="Sales Mobile" value={selectedVendor.salesMobile} />
                                <InfoRow label="Full Address" value={selectedVendor.address} multiline />

                                <SectionHeader title="Quality Standards" style={{ marginTop: '2rem' }} />
                                <InfoRow label="In-house Policy" value={selectedVendor.hasInHousePolicy?.toUpperCase()} />
                                <InfoRow label="ISO 9001" value={selectedVendor.hasIso9001?.toUpperCase()} />
                                <InfoRow label="ISO 14001" value={selectedVendor.hasIso14001?.toUpperCase()} />
                                <InfoRow label="ISO 45001" value={selectedVendor.hasIso45001?.toUpperCase()} />
                            </div>

                            {/* Experience & Documents Section */}
                            <div>
                                <SectionHeader title="Business & Experience" />
                                <InfoRow label="Employees" value={selectedVendor.employeeCount} />
                                <InfoRow label="Annual Turnover" value={selectedVendor.annualTurnover} />
                                <InfoRow label="OEM Status" value={selectedVendor.oemStatus} />
                                <InfoRow label="Materials/Services" value={selectedVendor.materialsServices} multiline />
                                <InfoRow label="Past Works" value={selectedVendor.pastWorks} multiline />
                                <InfoRow label="Major Clients" value={selectedVendor.majorClients} multiline />
                                <InfoRow label="Client Vendor IDs" value={selectedVendor.clientVendorIDs} multiline />

                                <SectionHeader title="Uploaded Documents" style={{ marginTop: '2rem' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                    <DocItem label="Commercial Registration" path={selectedVendor.documents?.crFile} />
                                    <DocItem label="VAT Certificate" path={selectedVendor.documents?.vatFile} />
                                    <DocItem label="National Address" path={selectedVendor.documents?.nationalAddressFile} />
                                    <DocItem label="Company Profile" path={selectedVendor.documents?.profileFile} />
                                    <DocItem label="ISO 9001 Certificate" path={selectedVendor.documents?.iso9001File} />
                                    <DocItem label="ISO 14001 Certificate" path={selectedVendor.documents?.iso14001File} />
                                    <DocItem label="ISO 45001 Certificate" path={selectedVendor.documents?.iso45001File} />
                                    <DocItem label="Brochure" path={selectedVendor.documents?.brochureFile} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', textAlign: 'center', background: 'rgba(59, 130, 246, 0.02)' }}>
                        <div>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>👥</div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Select a Vendor</h2>
                            <p style={{ color: 'var(--secondary)' }}>Choose a vendor from the list to view their complete profile and downloaded documents.</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

function SectionHeader({ title, style }: { title: string, style?: any }) {
    return (
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#3b82f6', marginBottom: '1rem', borderBottom: '1px solid rgba(59,130,246,0.2)', paddingBottom: '0.4rem', ...style }}>
            {title}
        </h3>
    )
}

function InfoRow({ label, value, code, multiline }: { label: string, value: any, code?: boolean, multiline?: boolean }) {
    return (
        <div style={{ marginBottom: multiline ? '1.25rem' : '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginBottom: '0.2rem' }}>{label}</div>
            <div style={{
                fontSize: '0.95rem',
                fontWeight: code ? 600 : 400,
                fontFamily: code ? 'monospace' : 'inherit',
                color: 'var(--foreground)',
                background: code ? 'rgba(59,130,246,0.05)' : 'transparent',
                padding: code ? '2px 6px' : '0',
                borderRadius: '4px',
                lineHeight: '1.4'
            }}>
                {value || <span style={{ fontStyle: 'italic', color: 'var(--secondary)', opacity: 0.5 }}>Not provided</span>}
            </div>
        </div>
    )
}

function DocItem({ label, path }: { label: string, path?: string }) {
    if (!path) return (
        <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--card-border)', opacity: 0.5, fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>{label}</span>
            <span style={{ fontSize: '0.75rem' }}>None</span>
        </div>
    );

    return (
        <a
            href={`/api/file/${path}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.05)',
                fontSize: '0.875rem',
                display: 'flex',
                justifyContent: 'space-between',
                textDecoration: 'none',
                color: 'var(--foreground)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
        >
            <span>📄 {label}</span>
            <span style={{ color: '#3b82f6', fontWeight: 600 }}>Download &rarr;</span>
        </a>
    )
}

function vendorCodeDisplay(code: string) {
    if (!code) return '';
    return code;
}

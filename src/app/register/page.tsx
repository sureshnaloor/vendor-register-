"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData(e.currentTarget);
            const res = await fetch('/api/register', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <main className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card text-center" style={{ maxWidth: '600px' }}>
                    <div style={{ color: '#10b981', fontSize: '4rem', marginBottom: '1rem' }}>✓</div>
                    <h1 className="title" style={{ fontSize: '2rem' }}>Registration Successful!</h1>
                    <p className="subtitle">
                        Thank you for registering. We have sent a <strong>Vendor Code</strong> to your email address.
                        <br /><br />
                        Please check your inbox (and spam folder). You will need this code to log in and manage your profile.
                    </p>
                    <Link href="/login" className="btn btn-primary">Go to Login</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="container" style={{ padding: '2rem 1rem' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '2rem', color: '#94a3b8' }}>
                &larr; Back to Home
            </Link>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="title">Vendor Registration</h1>
                <p className="subtitle">Please fill in all mandatory fields and upload required documents.</p>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Section 1: Basic Info */}
                    <h3 style={{ color: '#fff', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Company Information</h3>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Company Name *</label>
                            <input name="companyName" className="input" required placeholder="Acme Corp" />
                        </div>
                        <div className="form-group">
                            <label className="label">Type of Company</label>
                            <select name="companyType" className="select">
                                <option value="LLC">LLC</option>
                                <option value="Corporation">Corporation</option>
                                <option value="Sole Proprietorship">Sole Proprietorship</option>
                                <option value="Partnership">Partnership</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Registration Number (CR) *</label>
                            <input name="registrationNumber" className="input" required placeholder="CR-123456" />
                        </div>
                        <div className="form-group">
                            <label className="label">VAT Number *</label>
                            <input name="vatNumber" className="input" required placeholder="VAT-123456" />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Year Registered</label>
                            <input type="number" name="yearRegistered" className="input" placeholder="2000" />
                        </div>
                        <div className="form-group">
                            <label className="label">Number of Employees</label>
                            <input type="number" name="employeeCount" className="input" placeholder="50" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Annual Turnover</label>
                        <input name="annualTurnover" className="input" placeholder="$1,000,000" />
                    </div>

                    {/* Section 2: Contact */}
                    <h3 style={{ color: '#fff', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>Contact Details</h3>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Official Email (for Vendor Code) *</label>
                            <input type="email" name="email" className="input" required placeholder="info@acme.com" />
                        </div>
                        <div className="form-group">
                            <label className="label">Accounts Manager Email</label>
                            <input type="email" name="accountsEmail" className="input" placeholder="accounts@acme.com" />
                        </div>
                    </div>

                    {/* Section 3: Experience */}
                    <h3 style={{ color: '#fff', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>Experience & Clients</h3>

                    <div className="form-group">
                        <label className="label">Past Works / Major Projects</label>
                        <textarea name="pastWorks" className="textarea" rows={3} placeholder="List major projects..." />
                    </div>
                    <div className="form-group">
                        <label className="label">Vendor IDs of Reputed Clients</label>
                        <textarea name="clientVendorIDs" className="textarea" rows={2} placeholder="e.g. Aramco: 12345, SABIC: 67890" />
                    </div>

                    {/* Section 4: Documents */}
                    <h3 style={{ color: '#fff', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>Documents Upload</h3>
                    <p className="text-sm text-gray-400 mb-4" style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Supported formats: PDF, JPG, PNG. Max 5MB per file.</p>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Commercial Registration (CR) *</label>
                            <input type="file" name="crFile" className="input" required accept=".pdf,.jpg,.png" />
                        </div>
                        <div className="form-group">
                            <label className="label">VAT Certificate *</label>
                            <input type="file" name="vatFile" className="input" required accept=".pdf,.jpg,.png" />
                        </div>
                        <div className="form-group">
                            <label className="label">Company Profile</label>
                            <input type="file" name="profileFile" className="input" accept=".pdf" />
                        </div>
                        <div className="form-group">
                            <label className="label">Brochure</label>
                            <input type="file" name="brochureFile" className="input" accept=".pdf" />
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '200px' }}>
                            {loading ? 'Processing...' : 'Submit Registration'}
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}

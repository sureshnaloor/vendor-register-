"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [companyType, setCompanyType] = useState('Proprietorship/Establishment');

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
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '2rem', color: 'var(--secondary)' }}>
                &larr; Back to Home
            </Link>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Image
                    src="/logo.jpg"
                    alt="JAL International Logo"
                    width={180}
                    height={60}
                    style={{ objectFit: 'contain', marginBottom: '1rem' }}
                />
                <h1 className="title">Vendor Registration</h1>
                <p className="subtitle">Please fill in all mandatory fields marked with <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span> completely to receive your registration code.</p>
            </div>

            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Section 1: Company Information */}
                    <h3 style={{ color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Company Information</h3>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Company Name <span style={{ color: '#ef4444' }}>*</span></label>
                            <input name="companyName" className="input" required placeholder="Acme Corp" />
                        </div>
                        <div className="form-group">
                            <label className="label">Type of Company</label>
                            <select
                                name="companyType"
                                className="select"
                                value={companyType}
                                onChange={(e) => setCompanyType(e.target.value)}
                            >
                                <option value="Proprietorship/Establishment">Proprietorship/Establishment</option>
                                <option value="LLC">LLC</option>
                                <option value="Joint stock company">Joint stock company</option>
                                <option value="Public listed company">Public listed company</option>
                                <option value="JV">JV</option>
                                <option value="Holding company">Holding company</option>
                                <option value="Others">Others</option>
                            </select>
                            {companyType === 'Others' && (
                                <input
                                    name="companyTypeOther"
                                    className="input"
                                    placeholder="Specify company type..."
                                    style={{ marginTop: '0.5rem' }}
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Registration Number (CR) <span style={{ color: '#ef4444' }}>*</span></label>
                            <input name="registrationNumber" className="input" required placeholder="CR-123456" />
                        </div>
                        <div className="form-group">
                            <label className="label">VAT Number <span style={{ color: '#ef4444' }}>*</span></label>
                            <input name="vatNumber" className="input" required placeholder="VAT-123456" />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Year Registered</label>
                            <input type="number" name="yearRegistered" className="input" placeholder="2000" />
                        </div>
                        <div className="form-group">
                            <label className="label">Telephone Number</label>
                            <input type="tel" name="telephone" className="input" placeholder="+966 12 345 6789" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Full Address <span style={{ color: '#ef4444' }}>*</span></label>
                        <textarea name="address" className="textarea" rows={3} required placeholder="Building No, Street, District, City, Country" />
                    </div>

                    <div className="form-group">
                        <label className="label">OEM Status (Stockist/Dealer/Exclusive Agent)</label>
                        <input name="oemStatus" className="input" placeholder="e.g. Authorized Dealer for Samsung" />
                    </div>

                    {/* Section 2: Business Details */}
                    <h3 style={{ color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>Business Details</h3>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Number of Employees</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                    <input type="radio" name="employeeCount" value="upto20" /> Upto 20 employees
                                </label>
                                <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                    <input type="radio" name="employeeCount" value="20-200" /> 20-200 employees
                                </label>
                                <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                    <input type="radio" name="employeeCount" value="200-1000" /> 200-1000 employees
                                </label>
                                <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                    <input type="radio" name="employeeCount" value="over1000" /> More than 1000
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label">Annual Turnover</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                    <input type="radio" name="annualTurnover" value="upto1M" /> Upto 1 Million SAR
                                </label>
                                <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                    <input type="radio" name="annualTurnover" value="1-10M" /> 1 to 10 Million SAR
                                </label>
                                <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                    <input type="radio" name="annualTurnover" value="10-100M" /> 10-100 Million SAR
                                </label>
                                <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                    <input type="radio" name="annualTurnover" value="over100M" /> &gt; 100 Million
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Materials and Services Rendered <span style={{ color: '#ef4444' }}>*</span></label>
                        <textarea name="materialsServices" className="textarea" rows={3} required placeholder="Describe the materials you supply or services you offer..." />
                    </div>


                    {/* Section 3: Contact */}
                    <h3 style={{ color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>Contact Details</h3>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Official Email (for Vendor Code) <span style={{ color: '#ef4444' }}>*</span></label>
                            <input type="email" name="email" className="input" required placeholder="info@acme.com" />
                        </div>
                        <div className="form-group">
                            <label className="label">Mobile Number (Sales)</label>
                            <input type="tel" name="salesMobile" className="input" placeholder="+966 50 123 4567" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="label">Accounts Manager Email</label>
                        <input type="email" name="accountsEmail" className="input" placeholder="accounts@acme.com" />
                    </div>

                    {/* Section 4: Experience */}
                    <h3 style={{ color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>Experience & Clients</h3>

                    <div className="form-group">
                        <label className="label">Past Works / Major Projects</label>
                        <textarea name="pastWorks" className="textarea" rows={3} placeholder="List major projects..." />
                    </div>
                    <div className="form-group">
                        <label className="label">Major Client List (Past 5 Years)</label>
                        <textarea name="majorClients" className="textarea" rows={3} placeholder="List of major clients..." />
                    </div>
                    <div className="form-group">
                        <label className="label">Vendor IDs of Reputed Clients</label>
                        <textarea name="clientVendorIDs" className="textarea" rows={2} placeholder="e.g. Aramco: 12345, SABIC: 67890" />
                    </div>

                    {/* Section 5: Documents */}
                    <h3 style={{ color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>Documents Upload</h3>
                    <p className="text-sm text-gray-400 mb-4" style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Optional during registration. You can upload these later.</p>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Commercial Registration (CR)</label>
                            <input type="file" name="crFile" className="input" accept=".pdf,.jpg,.png" />
                        </div>
                        <div className="form-group">
                            <label className="label">VAT Certificate</label>
                            <input type="file" name="vatFile" className="input" accept=".pdf,.jpg,.png" />
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
        </main >
    );
}


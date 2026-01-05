"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ initialData, vendorCode }: { initialData: any, vendorCode: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Helper to handle form submission
    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const res = await fetch('/api/update-profile', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Failed to update profile');
            }

            setIsEditing(false);
            router.refresh(); // Refresh Server Components to fetch new data
        } catch (error) {
            console.error(error);
            alert('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 0', borderBottom: '1px solid var(--card-border)', marginBottom: '2rem' }}>
                <div>
                    <h1 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Vendor Dashboard</h1>
                    {!isEditing && <p className="subtitle" style={{ margin: 0 }}>Welcome, {initialData.companyName}</p>}
                    {isEditing && <p className="subtitle" style={{ margin: 0, color: '#f59e0b' }}>Editing Mode</p>}
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <div style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        Vendor Code: <strong>{vendorCode}</strong>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn btn-primary"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </header>

            <form onSubmit={handleSave}>
                <div className="grid-2">
                    {/* Profile Info */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Company Profile</h2>
                        </div>

                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <EditField label="Company Name" name="companyName" defaultValue={initialData.companyName} required />
                                <EditField label="Registration No." name="registrationNumber" defaultValue={initialData.registrationNumber} required />
                                <EditField label="VAT Number" name="vatNumber" defaultValue={initialData.vatNumber} required />
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="label">Company Type</label>
                                    <select name="companyType" className="select" defaultValue={initialData.companyType}>
                                        <option value="LLC">LLC</option>
                                        <option value="Corporation">Corporation</option>
                                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                    </select>
                                </div>
                                <EditField label="Email" name="email" defaultValue={initialData.email} required type="email" />
                                <EditField label="Accounts Email" name="accountsEmail" defaultValue={initialData.accountsEmail} type="email" />
                            </div>
                        ) : (
                            <>
                                <ProfileRow label="Company Name" value={initialData.companyName} />
                                <ProfileRow label="Registration No." value={initialData.registrationNumber} />
                                <ProfileRow label="VAT Number" value={initialData.vatNumber} />
                                <ProfileRow label="Company Type" value={initialData.companyType} />
                                <ProfileRow label="Email" value={initialData.email} />
                                <ProfileRow label="Accounts Email" value={initialData.accountsEmail} />
                            </>
                        )}
                    </div>

                    {/* Documents */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Documents</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <DocRow label="Commercial Registration" fileKey="crFile" path={initialData.documents?.crFile} isEditing={isEditing} />
                            <DocRow label="VAT Certificate" fileKey="vatFile" path={initialData.documents?.vatFile} isEditing={isEditing} />
                            <DocRow label="Company Profile" fileKey="profileFile" path={initialData.documents?.profileFile} isEditing={isEditing} />
                            <DocRow label="Brochure" fileKey="brochureFile" path={initialData.documents?.brochureFile} isEditing={isEditing} />
                        </div>
                    </div>
                </div>

                {/* Experience Section */}
                <div className="card" style={{ marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Experience & Stats</h2>
                    <div className="grid-2">
                        <div>
                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <EditField label="Year Registered" name="yearRegistered" defaultValue={initialData.yearRegistered} />
                                    <EditField label="Employees" name="employeeCount" defaultValue={initialData.employeeCount} />
                                    <EditField label="Annual Turnover" name="annualTurnover" defaultValue={initialData.annualTurnover} />
                                </div>
                            ) : (
                                <>
                                    <ProfileRow label="Year Registered" value={initialData.yearRegistered} />
                                    <ProfileRow label="Employees" value={initialData.employeeCount} />
                                    <ProfileRow label="Annual Turnover" value={initialData.annualTurnover} />
                                </>
                            )}
                        </div>
                        <div>
                            {isEditing ? (
                                <>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label className="label">Past Works</label>
                                        <textarea name="pastWorks" className="textarea" rows={3} defaultValue={initialData.pastWorks} />
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label className="label">Client Vendor IDs</label>
                                        <textarea name="clientVendorIDs" className="textarea" rows={2} defaultValue={initialData.clientVendorIDs} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="label">Past Works</div>
                                        <div style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{initialData.pastWorks || '-'}</div>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="label">Client Vendor IDs</div>
                                        <div style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{initialData.clientVendorIDs || '-'}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsEditing(false)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                )}

            </form>
        </main>
    );
}

function ProfileRow({ label, value }: { label: string, value: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: '#94a3b8' }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{value || '-'}</span>
        </div>
    )
}

function EditField({ label, name, defaultValue, required, type = 'text' }: { label: string, name: string, defaultValue: string, required?: boolean, type?: string }) {
    return (
        <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">{label}</label>
            <input name={name} className="input" defaultValue={defaultValue} required={required} type={type} />
        </div>
    )
}

function DocRow({ label, fileKey, path, isEditing }: { label: string, fileKey: string, path: string | undefined, isEditing: boolean }) {
    return (
        <div style={{ padding: '0.75rem', background: 'var(--input-bg)', borderRadius: '8px' }}>
            <div style={{ marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>{label}</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                {path ? (
                    <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                        <span style={{ marginRight: '0.5rem' }}>📄</span>
                        <span style={{ fontSize: '0.875rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {String(path).split('/').pop()}
                        </span>
                    </div>
                ) : (
                    <span style={{ fontSize: '0.875rem', color: '#64748b', fontStyle: 'italic' }}>No file uploaded</span>
                )}

                {isEditing && (
                    <div className="file-input-wrapper">
                        {/* We use a simple label overlay or just the input. Standard file input is fine. */}
                        <input type="file" name={fileKey} style={{ fontSize: '0.75rem', width: '200px' }} accept=".pdf,.jpg,.png" />
                    </div>
                )}
            </div>

            {/* If we strictly wanted a "Replace" button UI we could hide the input, but standard input is clearer for "Selecting a new file" */}
        </div>
    )
}

"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ initialData, vendorCode }: { initialData: any, vendorCode: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [companyType, setCompanyType] = useState(initialData.companyType || 'Proprietorship/Establishment');
    const [otherType, setOtherType] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (initialData.companyType && initialData.companyType.startsWith('Others - ')) {
            setCompanyType('Others');
            setOtherType(initialData.companyType.replace('Others - ', ''));
        } else {
            setCompanyType(initialData.companyType || 'Proprietorship/Establishment');
            setOtherType('');
        }
    }, [initialData.companyType]);

    // Handle File Deletion
    async function handleDeleteFile(path: string) {
        if (!confirm('Are you sure you want to delete this document?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/file/${path}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete file');
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error deleting file');
        } finally {
            setLoading(false);
        }
    }

    // Helper to handle form submission
    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            // Handle Company Type Combination for Backend Consistency
            // If the backend expects the same logic as register, we can leave it to backend if we updated it.
            // But 'update-profile' route is currently generic. 
            // We should ensure the backend handles this, OR we modify formData here.
            // Let's modify formData here to simplify backend changes or keep them consistent.
            // Actually, best to let backend handle "Others" logic if we update backend.
            // But for now, let's just make sure formData has what we need. 

            const res = await fetch('/api/update-profile', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Failed to update profile');
            }

            const result = await res.json();

            // Update local state if needed or just toggle editing
            if (result.data) {
                // If we want to reflect "Others - Value" immediately without refresh issues:
                // But router.refresh() should handle it.
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
                                            defaultValue={otherType}
                                            placeholder="Specify company type..."
                                            style={{ marginTop: '0.5rem' }}
                                            required
                                        />
                                    )}
                                </div>

                                <EditField label="Email" name="email" defaultValue={initialData.email} required type="email" />
                                <EditField label="Accounts Email" name="accountsEmail" defaultValue={initialData.accountsEmail} type="email" />
                                <EditField label="Sales Mobile" name="salesMobile" defaultValue={initialData.salesMobile} type="tel" />
                                <EditField label="Telephone" name="telephone" defaultValue={initialData.telephone} type="tel" />

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="label">Full Address</label>
                                    <textarea name="address" className="textarea" rows={3} defaultValue={initialData.address} required />
                                </div>
                            </div>
                        ) : (
                            <>
                                <ProfileRow label="Company Name" value={initialData.companyName} />
                                <ProfileRow label="Registration No." value={initialData.registrationNumber} />
                                <ProfileRow label="VAT Number" value={initialData.vatNumber} />
                                <ProfileRow label="Company Type" value={initialData.companyType} />
                                <ProfileRow label="Email" value={initialData.email} />
                                <ProfileRow label="Accounts Email" value={initialData.accountsEmail} />
                                <ProfileRow label="Sales Mobile" value={initialData.salesMobile} />
                                <ProfileRow label="Telephone" value={initialData.telephone} />
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                                    <label className="label" style={{ marginBottom: '0.25rem' }}>Full Address</label>
                                    <div style={{ color: 'var(--foreground)', fontSize: '0.95rem' }}>{initialData.address || '-'}</div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Documents */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Documents</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <DocRow label="Commercial Registration" fileKey="crFile" path={initialData.documents?.crFile} isEditing={isEditing} onDelete={handleDeleteFile} />
                            <DocRow label="VAT Certificate" fileKey="vatFile" path={initialData.documents?.vatFile} isEditing={isEditing} onDelete={handleDeleteFile} />
                            <DocRow label="National Address" fileKey="nationalAddressFile" path={initialData.documents?.nationalAddressFile} isEditing={isEditing} onDelete={handleDeleteFile} />
                            <DocRow label="Company Profile" fileKey="profileFile" path={initialData.documents?.profileFile} isEditing={isEditing} onDelete={handleDeleteFile} />
                            <DocRow label="ISO 9001 Certificate" fileKey="iso9001File" path={initialData.documents?.iso9001File} isEditing={isEditing} onDelete={handleDeleteFile} />
                            <DocRow label="ISO 14001 Certificate" fileKey="iso14001File" path={initialData.documents?.iso14001File} isEditing={isEditing} onDelete={handleDeleteFile} />
                            <DocRow label="ISO 45001 Certificate" fileKey="iso45001File" path={initialData.documents?.iso45001File} isEditing={isEditing} onDelete={handleDeleteFile} />
                            <DocRow label="Brochure" fileKey="brochureFile" path={initialData.documents?.brochureFile} isEditing={isEditing} onDelete={handleDeleteFile} />
                        </div>
                    </div>
                </div>

                {/* Experience & Business Details Section */}
                <div className="card" style={{ marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Business Details & Experience</h2>
                    <div className="grid-2">
                        <div>
                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <EditField label="Year Registered" name="yearRegistered" defaultValue={initialData.yearRegistered} />
                                    <EditField label="OEM Status" name="oemStatus" defaultValue={initialData.oemStatus} />

                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="label">Number of Employees</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {['upto20', '20-200', '200-1000', 'over1000'].map(val => (
                                                <label key={val} className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                                    <input type="radio" name="employeeCount" value={val} defaultChecked={initialData.employeeCount === val} />
                                                    {val === 'upto20' ? 'Upto 20' : val === '20-200' ? '20-200' : val === '200-1000' ? '200-1000' : 'More than 1000'}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="label">Annual Turnover</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {['upto1M', '1-10M', '10-100M', 'over100M'].map(val => (
                                                <label key={val} className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                                    <input type="radio" name="annualTurnover" value={val} defaultChecked={initialData.annualTurnover === val} />
                                                    {val === 'upto1M' ? 'Upto 1M' : val === '1-10M' ? '1-10M' : val === '10-100M' ? '10-100M' : '> 100M'}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ProfileRow label="Year Registered" value={initialData.yearRegistered} />
                                    <ProfileRow label="OEM Status" value={initialData.oemStatus} />
                                    <ProfileRow label="Employees" value={initialData.employeeCount} />
                                    <ProfileRow label="Annual Turnover" value={initialData.annualTurnover} />
                                </>
                            )}
                        </div>
                        <div>
                            {isEditing ? (
                                <>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label className="label">Materials and Services *</label>
                                        <textarea name="materialsServices" className="textarea" rows={3} defaultValue={initialData.materialsServices} required />
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label className="label">Past Works</label>
                                        <textarea name="pastWorks" className="textarea" rows={3} defaultValue={initialData.pastWorks} />
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label className="label">Major Clients (Last 5 Years)</label>
                                        <textarea name="majorClients" className="textarea" rows={3} defaultValue={initialData.majorClients} />
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label className="label">Client Vendor IDs</label>
                                        <textarea name="clientVendorIDs" className="textarea" rows={2} defaultValue={initialData.clientVendorIDs} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="label">Materials and Services</div>
                                        <div style={{ color: 'var(--foreground)', fontSize: '0.95rem' }}>{initialData.materialsServices || '-'}</div>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="label">Past Works</div>
                                        <div style={{ color: 'var(--foreground)', fontSize: '0.95rem' }}>{initialData.pastWorks || '-'}</div>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="label">Major Clients</div>
                                        <div style={{ color: 'var(--foreground)', fontSize: '0.95rem' }}>{initialData.majorClients || '-'}</div>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="label">Client Vendor IDs</div>
                                        <div style={{ color: 'var(--foreground)', fontSize: '0.95rem' }}>{initialData.clientVendorIDs || '-'}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quality Standards Section */}
                <div className="card" style={{ marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quality Standards</h2>
                    <div className="grid-2">
                        {isEditing ? (
                            <>
                                <div className="form-group">
                                    <label className="label">In-house Quality Policy exists?</label>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                                        <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                            <input type="radio" name="hasInHousePolicy" value="yes" defaultChecked={initialData.hasInHousePolicy === 'yes'} /> Yes
                                        </label>
                                        <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                            <input type="radio" name="hasInHousePolicy" value="no" defaultChecked={initialData.hasInHousePolicy === 'no' || !initialData.hasInHousePolicy} /> No
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="label">ISO 9001 Certified?</label>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                                        <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                            <input type="radio" name="hasIso9001" value="yes" defaultChecked={initialData.hasIso9001 === 'yes'} /> Yes
                                        </label>
                                        <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                            <input type="radio" name="hasIso9001" value="no" defaultChecked={initialData.hasIso9001 === 'no' || !initialData.hasIso9001} /> No
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="label">ISO 14001 Certified?</label>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                                        <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                            <input type="radio" name="hasIso14001" value="yes" defaultChecked={initialData.hasIso14001 === 'yes'} /> Yes
                                        </label>
                                        <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                            <input type="radio" name="hasIso14001" value="no" defaultChecked={initialData.hasIso14001 === 'no' || !initialData.hasIso14001} /> No
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="label">ISO 45001 Certified?</label>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                                        <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                            <input type="radio" name="hasIso45001" value="yes" defaultChecked={initialData.hasIso45001 === 'yes'} /> Yes
                                        </label>
                                        <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--foreground)' }}>
                                            <input type="radio" name="hasIso45001" value="no" defaultChecked={initialData.hasIso45001 === 'no' || !initialData.hasIso45001} /> No
                                        </label>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <ProfileRow label="In-house Policy" value={initialData.hasInHousePolicy === 'yes' ? 'Yes' : 'No'} />
                                <ProfileRow label="ISO 9001 Certified" value={initialData.hasIso9001 === 'yes' ? 'Yes' : 'No'} />
                                <ProfileRow label="ISO 14001 Certified" value={initialData.hasIso14001 === 'yes' ? 'Yes' : 'No'} />
                                <ProfileRow label="ISO 45001 Certified" value={initialData.hasIso45001 === 'yes' ? 'Yes' : 'No'} />
                            </>
                        )}
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
        </main >
    );
}

function ProfileRow({ label, value }: { label: string, value: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--card-border)' }}>
            <span style={{ color: 'var(--secondary)' }}>{label}</span>
            <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{value || '-'}</span>
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

function DocRow({ label, fileKey, path, isEditing, onDelete }: { label: string, fileKey: string, path: string | undefined, isEditing: boolean, onDelete: (path: string) => void }) {
    return (
        <div style={{ padding: '0.75rem', background: 'var(--input-bg)', borderRadius: '8px' }}>
            <div style={{ marginBottom: '0.5rem', color: 'var(--secondary)', fontSize: '0.875rem' }}>{label}</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                {path ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                            <span style={{ marginRight: '0.5rem' }}>📄</span>
                            <a href={`/api/file/${path}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: 'var(--primary)', textDecoration: 'underline' }}>
                                View Document
                            </a>
                        </div>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => onDelete(path)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                                🗑️ Delete
                            </button>
                        )}
                    </div>
                ) : (
                    <span style={{ fontSize: '0.875rem', color: 'var(--secondary)', fontStyle: 'italic' }}>No file uploaded</span>
                )}

                {isEditing && !path && (
                    <div className="file-input-wrapper">
                        <input type="file" name={fileKey} style={{ fontSize: '0.75rem', width: '200px' }} accept=".pdf,.jpg,.png" />
                    </div>
                )}
                {isEditing && path && (
                    <div className="file-input-wrapper" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                        {/* Disabled/Hidden input if file exists, force delete first */}
                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Delete existing to upload new</span>
                    </div>
                )}
            </div>
        </div>
    )
}

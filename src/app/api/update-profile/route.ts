import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getVendorData, saveVendorData, uploadFile } from '@/lib/b2';

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const vendorCode = cookieStore.get('vendor_session')?.value;

        if (!vendorCode) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch current data to preserve unedited fields (and existing file paths)
        const currentData = await getVendorData(vendorCode);
        if (!currentData) {
            return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
        }

        const formData = await req.formData();

        // 2. Update Text Fields
        // We only update fields that are allowed to be edited. 
        // Usually Company Name/CR might be locked, but user asked for "edit functionality for the fields".
        // I'll allow editing most fields.
        const textFields = [
            'companyName', 'registrationNumber', 'vatNumber', 'email', 'accountsEmail',
            'companyType', 'yearRegistered', 'employeeCount', 'annualTurnover',
            'pastWorks', 'clientVendorIDs'
        ];

        const updatedData = { ...currentData };

        textFields.forEach(field => {
            const value = formData.get(field);
            if (value !== null) {
                updatedData[field] = value as string;
            }
        });

        // 3. Handle File Uploads
        const fileKeys = ['crFile', 'vatFile', 'profileFile', 'brochureFile'];
        // Ensure documents object exists
        updatedData.documents = updatedData.documents || {};

        for (const key of fileKeys) {
            const file = formData.get(key) as File;
            // Check if a *new* file was uploaded
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const fileName = `vendors/${vendorCode}/documents/${key}_${Date.now()}_${cleanName}`;

                await uploadFile(buffer, fileName, file.type);

                // Update reference
                updatedData.documents[key] = fileName;
            }
        }

        updatedData.updatedAt = new Date().toISOString();

        // 4. Save back to B2
        await saveVendorData(vendorCode, updatedData);

        return NextResponse.json({ success: true, data: updatedData });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

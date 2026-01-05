import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, saveVendorData } from '@/lib/b2';
import { sendVendorCode } from '@/lib/email';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        // Extract Fields
        const companyName = formData.get('companyName') as string;
        const registrationNumber = formData.get('registrationNumber') as string;
        const vatNumber = formData.get('vatNumber') as string;
        const email = formData.get('email') as string; // Main contact email
        const accountsEmail = formData.get('accountsEmail') as string;
        let companyType = formData.get('companyType') as string;
        const companyTypeOther = formData.get('companyTypeOther') as string;
        const yearRegistered = formData.get('yearRegistered') as string;
        const employeeCount = formData.get('employeeCount') as string;
        const annualTurnover = formData.get('annualTurnover') as string;
        const pastWorks = formData.get('pastWorks') as string;
        const clientVendorIDs = formData.get('clientVendorIDs') as string;

        // New Fields
        const address = formData.get('address') as string;
        const telephone = formData.get('telephone') as string;
        const salesMobile = formData.get('salesMobile') as string;
        const oemStatus = formData.get('oemStatus') as string;
        const materialsServices = formData.get('materialsServices') as string;
        const majorClients = formData.get('majorClients') as string;

        // Validations
        // 1. Mandatory Text Fields
        if (!companyName || !email || !registrationNumber || !vatNumber || !address || !materialsServices) {
            return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
        }

        // 2. Handle "Others" Company Type
        if (companyType === 'Others' && companyTypeOther) {
            companyType = `Others - ${companyTypeOther}`;
        }

        // Generate Vendor Code
        const vendorCode = nanoid(10).toUpperCase();

        // Upload Files (Optional)
        const fileUrls: Record<string, string> = {};
        const fileKeys = ['crFile', 'vatFile', 'profileFile', 'brochureFile'];

        for (const key of fileKeys) {
            const file = formData.get(key) as File;
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                // Clean filename to avoid issues
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const fileName = `vendors/${vendorCode}/documents/${key}_${cleanName}`;
                await uploadFile(buffer, fileName, file.type);
                fileUrls[key] = fileName;
            }
        }

        // Prepare Data Object
        const vendorData = {
            vendorCode,
            companyName,
            registrationNumber,
            vatNumber,
            email,
            accountsEmail,
            companyType,
            yearRegistered,
            employeeCount,
            annualTurnover,
            pastWorks,
            clientVendorIDs,
            // New Fields
            address,
            telephone,
            salesMobile,
            oemStatus,
            materialsServices,
            majorClients,
            documents: fileUrls,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Save Data to B2
        await saveVendorData(vendorCode, vendorData);

        console.log('================================================');
        console.log('✅ NEW VENDOR REGISTERED');
        console.log('🏢 Company:', companyName);
        console.log('🔑 CREDENTIALS (VENDOR CODE):', vendorCode);
        console.log('================================================');

        // Send Email
        await sendVendorCode(email, vendorCode, companyName);

        return NextResponse.json({ success: true, message: 'Vendor registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

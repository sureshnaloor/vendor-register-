import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getVendorData, getFile, uploadFile } from '@/lib/b2';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ vendorCode: string }> }
) {
    try {
        const { vendorCode } = await params;
        const cookieStore = await cookies();
        const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated';

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const vendorData = await getVendorData(vendorCode);
        if (!vendorData) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        // 1. Generate Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Vendor Details');

        worksheet.columns = [
            { header: 'Field', key: 'field', width: 30 },
            { header: 'Value', key: 'value', width: 50 },
        ];

        // Add Data Rows
        const dataRows = [
            ['Vendor Code', vendorData.vendorCode],
            ['Company Name', vendorData.companyName],
            ['Registration Number (CR)', vendorData.registrationNumber],
            ['VAT Number', vendorData.vatNumber],
            ['Official Email', vendorData.email],
            ['Accounts Email', vendorData.accountsEmail],
            ['Company Type', vendorData.companyType],
            ['Year Registered', vendorData.yearRegistered],
            ['Telephone', vendorData.telephone],
            ['Sales Mobile', vendorData.salesMobile],
            ['Address', vendorData.address],
            ['OEM Status', vendorData.oemStatus],
            ['Materials/Services', vendorData.materialsServices],
            ['Employee Count', vendorData.employeeCount],
            ['Annual Turnover', vendorData.annualTurnover],
            ['Past Works', vendorData.pastWorks],
            ['Major Clients', vendorData.majorClients],
            ['Client Vendor IDs', vendorData.clientVendorIDs],
            ['In-house Quality Policy', vendorData.hasInHousePolicy],
            ['ISO 9001', vendorData.hasIso9001],
            ['ISO 14001', vendorData.hasIso14001],
            ['ISO 45001', vendorData.hasIso45001],
            ['Created At', vendorData.createdAt],
            ['Updated At', vendorData.updatedAt],
        ];

        dataRows.forEach(row => worksheet.addRow({ field: row[0], value: row[1] }));

        // Styling
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        const excelBuffer = await workbook.xlsx.writeBuffer();

        // 2. Store Excel in B2
        const excelFileName = `vendors/${vendorCode}/vendor_details_${vendorCode}.xlsx`;
        await uploadFile(Buffer.from(excelBuffer), excelFileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // 3. Create ZIP
        const zip = new JSZip();
        zip.file(`vendor_details_${vendorCode}.xlsx`, excelBuffer);

        // Add Documents
        if (vendorData.documents) {
            for (const [key, filePath] of Object.entries(vendorData.documents)) {
                if (filePath) {
                    try {
                        const fileData = await getFile(filePath as string);
                        const fileName = (filePath as string).split('/').pop() || `${key}.file`;
                        zip.file(fileName, fileData.data);
                    } catch (e) {
                        console.error(`Failed to add file ${filePath} to zip:`, e);
                    }
                }
            }
        }

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        return new NextResponse(zipBuffer as any, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename=vendor_package_${vendorCode}.zip`,
            },
        });

    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

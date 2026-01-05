import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFile, deleteFile, getVendorData, saveVendorData } from '@/lib/b2';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const fileName = path.join('/');

        // Optional: Add Auth Check
        // const cookieStore = await cookies();
        // const vendorCode = cookieStore.get('vendor_session')?.value;
        // if (!fileName.includes(vendorCode!)) { ... }
        // For now, allowing access to view files (signed URLs would be better in prod).

        const file = await getFile(fileName);

        return new NextResponse(file.data, {
            headers: {
                'Content-Type': file.contentType,
                'Content-Length': file.contentLength,
            },
        });
    } catch (error) {
        console.error('File download error:', error);
        return NextResponse.json({ error: 'File not found or error downloading' }, { status: 404 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const cookieStore = await cookies();
        const vendorCode = cookieStore.get('vendor_session')?.value;

        if (!vendorCode) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { path } = await params;
        const fileName = path.join('/');

        // Security Check: Ensure file belongs to the logged-in vendor
        if (!fileName.includes(`vendors/${vendorCode}/`)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 1. Delete from B2
        try {
            await deleteFile(fileName);
        } catch (e) {
            console.error("B2 Delete Error", e);
            // Continue to remove reference even if B2 fails (maybe already gone)
        }

        // 2. Remove reference from Vendor Profile
        const vendorData = await getVendorData(vendorCode);
        if (vendorData && vendorData.documents) {
            // Find key that matches this filename
            let keyToRemove = null;
            for (const key in vendorData.documents) {
                if (vendorData.documents[key] === fileName) {
                    keyToRemove = key;
                    break;
                }
            }

            if (keyToRemove) {
                delete vendorData.documents[keyToRemove];
                await saveVendorData(vendorCode, vendorData);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('File delete error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

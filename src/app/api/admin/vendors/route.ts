import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { listAllVendors } from '@/lib/b2';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated';

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const vendors = await listAllVendors();

        // Sort by date (newest first)
        const sortedVendors = vendors.sort((a: any, b: any) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return NextResponse.json({ success: true, vendors: sortedVendors });
    } catch (error) {
        console.error('List vendors error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

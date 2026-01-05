import { NextRequest, NextResponse } from 'next/server';
import { getVendorData } from '@/lib/b2';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { vendorCode } = body;

        if (!vendorCode) {
            return NextResponse.json({ error: 'Vendor Code is required' }, { status: 400 });
        }

        // specific validation for format if needed

        // Verify code exists by trying to fetch profile
        const data = await getVendorData(vendorCode);

        if (!data) {
            return NextResponse.json({ error: 'Invalid Vendor Code' }, { status: 401 });
        }

        // Create response with cookie
        const response = NextResponse.json({ success: true, companyName: data.companyName });

        // Set a simple session cookie
        response.cookies.set('vendor_session', vendorCode, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

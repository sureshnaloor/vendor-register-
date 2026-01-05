import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getVendorData } from '@/lib/b2';
import DashboardClient from './DashboardClient';

export default async function Dashboard() {
    const cookieStore = await cookies();
    const vendorCode = cookieStore.get('vendor_session')?.value;

    if (!vendorCode) {
        redirect('/login');
    }

    const data = await getVendorData(vendorCode);

    if (!data) {
        redirect('/login');
    }

    return <DashboardClient initialData={data} vendorCode={vendorCode} />;
}

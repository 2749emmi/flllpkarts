import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
            {/* Top Navbar */}
            <nav className="bg-[#2874f0] text-white px-6 py-4 flex items-center justify-between shadow-md z-10 sticky top-0">
                <div className="flex items-center space-x-8">
                    <Link href="/admin" className="text-2xl font-bold italic tracking-wide flex items-center">
                        Flipkart <span className="text-[#ffe500] ml-1.5 text-base not-italic font-medium -mt-1">Admin</span>
                    </Link>
                    <div className="hidden md:flex space-x-6 text-sm font-medium">
                        <Link href="/admin" className="hover:text-gray-200 transition-colors">Manage Products</Link>
                        <Link href="/admin/add" className="hover:text-gray-200 transition-colors">Add New Product</Link>
                        <Link href="/" className="text-blue-200 hover:text-white transition-colors" target="_blank">View Storefront</Link>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="bg-white/10 px-3 py-1.5 rounded text-xs font-semibold tracking-wider uppercase border border-white/20">
                        Catalog Manager
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex-grow p-4 md:p-8 max-w-[1400px] mx-auto w-full">
                {children}
            </div>
        </div>
    );
}

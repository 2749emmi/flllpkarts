import { getProducts } from './actions';
import DeleteButton from './DeleteButton';
import Image from 'next/image';
import Link from 'next/link';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Product List</h1>
          <p className="text-sm text-gray-500 mt-1">Manage exactly what customers see on the storefront.</p>
        </div>
        <Link
          href="/admin/add"
          className="bg-[#2874f0] hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded shadow-sm transition-colors text-sm whitespace-nowrap"
        >
          + Add New Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-100/50 text-gray-600 text-sm tracking-wider border-b border-gray-200">
              <th className="px-6 py-4 font-semibold uppercase text-xs">Product Details</th>
              <th className="px-6 py-4 font-semibold uppercase text-xs">Selling Price</th>
              <th className="px-6 py-4 font-semibold uppercase text-xs">Original Price</th>
              <th className="px-6 py-4 font-semibold uppercase text-xs">Discount</th>
              <th className="px-6 py-4 font-semibold uppercase text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4 max-w-sm">
                    <div className="w-14 h-14 relative flex-shrink-0 bg-white border border-gray-100 rounded shadow-sm p-1">
                      <Image
                        src={p.image || p.images?.[0] || '/images/placeholder.png'}
                        alt={p.title}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 pr-4">
                      <span className="font-semibold text-gray-800 truncate" title={p.title}>{p.title}</span>
                      <span className="text-xs text-gray-500 mt-1 tracking-wide">ID: {p.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900 font-bold whitespace-nowrap">
                  ₹{p.price?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 text-gray-400 font-medium line-through whitespace-nowrap">
                  ₹{(p.originalPrice || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-[#388e3c]/10 text-[#388e3c] text-xs font-bold px-2 py-1 rounded inline-block">
                    {p.discount || 0}% OFF
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <DeleteButton id={p.id} />
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center bg-gray-50/50">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="text-4xl text-gray-300">📦</span>
                    <span className="font-medium text-gray-600">Your catalogue is empty</span>
                    <span className="text-sm text-gray-400">Click the Add New Product button to populate your store.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

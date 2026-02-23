'use client'

import { useState } from 'react';
import { deleteProduct } from './actions';

export default function DeleteButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this product?')) {
            setLoading(true);
            try {
                await deleteProduct(id);
            } catch (e) {
                alert('Failed to delete product');
            }
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 border border-red-200 rounded bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
        >
            {loading ? 'Deleting...' : 'Delete'}
        </button>
    );
}

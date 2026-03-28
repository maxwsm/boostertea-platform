'use client';
import { useState, useEffect } from 'react';

type Product = {
  id: string;
  brandId: string;
  slug: string;
  nameUk: string;
  descriptionUk: string;
  price: number;
  image: string | null;
  category: string;
  stockStatus: boolean;
  stockQuantity: number;
  brand: { name: string; slug: string; id: string };
};

export default function CatalogClient({ brands, categories }: { brands: any[], categories: string[] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [brandFilter, setBrandFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  // Bulk Ops
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (brandFilter !== 'all') params.set('brandId', brandFilter);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/catalog?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filters change (debounced effectively by fast API)
  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [brandFilter, categoryFilter, search]);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === products.length) setSelectedIds(newSet => new Set());
    else setSelectedIds(new Set(products.map(p => p.id)));
  };

  const handleBulkStatusUpdate = async (inStock: boolean) => {
    if (selectedIds.size === 0) return;
    try {
      const idsArray = Array.from(selectedIds);
      await fetch('/api/catalog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: idsArray, action: 'updateStatus', value: inStock })
      });
      setSelectedIds(new Set());
      fetchProducts();
    } catch (e) {
      alert('Bulk update failed');
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!editingProduct?.id;
      const url = isEdit ? `/api/catalog/${editingProduct.id}` : '/api/catalog';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(editingProduct)
      });
      
      if (res.ok) {
        setModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert('Failed to save product. Check required fields or duplicate slug.');
      }
    } catch(e) {
      alert('Error saving product');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await fetch(`/api/catalog/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch(e) {
      alert('Error deleting');
    }
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-white/10 bg-[#0A0A0A]/50 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="bg-[#050505] border border-white/10 rounded px-3 py-1.5 text-sm min-w-[200px] focus:outline-none focus:border-blue-500"
          />
          <select 
            value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
            className="bg-[#050505] border border-white/10 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Brands</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select 
            value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="bg-[#050505] border border-white/10 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <div className="flex gap-2 mr-4 border-r border-white/10 pr-4">
              <span className="text-xs text-gray-400 self-center">{selectedIds.size} selected</span>
              <button onClick={() => handleBulkStatusUpdate(true)} className="px-3 py-1.5 bg-[#050505] border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 rounded text-xs transition-colors">Set In Stock</button>
              <button onClick={() => handleBulkStatusUpdate(false)} className="px-3 py-1.5 bg-[#050505] border border-white/10 hover:border-red-500/50 hover:text-red-400 rounded text-xs transition-colors">Set Out of Stock</button>
            </div>
          )}
          <button 
            onClick={() => { setEditingProduct({ stockStatus: true, stockQuantity: 100 }); setModalOpen(true); }}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs text-gray-500 uppercase bg-[#050505] border-b border-white/5 sticky top-0">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={selectedIds.size > 0 && selectedIds.size === products.length} onChange={toggleAll} className="rounded border-gray-600 bg-transparent" />
              </th>
              <th className="px-4 py-3">Product Info</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500">Loading catalog...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500">No products found.</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selectedIds.has(product.id)} onChange={() => toggleSelection(product.id)} className="rounded border-gray-600 bg-transparent" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-white">{product.nameUk}</div>
                    <div className="text-xs text-gray-500 mt-1">{product.category} • /{product.slug}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded text-xs border border-white/10 bg-white/5">
                      {product.brand.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-emerald-400">{product.price.toString()} ₴</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${product.stockStatus ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${product.stockStatus ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                      {product.stockStatus ? `${product.stockQuantity} In Stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingProduct(product); setModalOpen(true); }} className="text-blue-400 hover:text-blue-300 text-xs mr-3">Edit</button>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0A0A0A] sticky top-0 z-10">
              <h2 className="text-xl font-bold">{editingProduct?.id ? 'Edit Product' : 'Create New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            
            <form onSubmit={saveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Product Name (UK)</label>
                  <input required value={editingProduct?.nameUk || ''} onChange={e => setEditingProduct({...editingProduct, nameUk: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" placeholder="e.g. ГАБА Алішань" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Slug (URL identity)</label>
                  <input required value={editingProduct?.slug || ''} onChange={e => setEditingProduct({...editingProduct, slug: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" placeholder="e.g. gaba-alishan" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Brand Entity</label>
                  <select required value={editingProduct?.brandId || ''} onChange={e => setEditingProduct({...editingProduct, brandId: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none">
                    <option value="" disabled>Select Brand...</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Category</label>
                  <input required value={editingProduct?.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" placeholder="e.g. Concentrate" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Price (UAH)</label>
                  <input type="number" step="0.01" required value={editingProduct?.price || ''} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Stock Quantity</label>
                  <input type="number" required value={editingProduct?.stockQuantity || 0} onChange={e => setEditingProduct({...editingProduct, stockQuantity: parseInt(e.target.value)})} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={editingProduct?.stockStatus || false} onChange={e => setEditingProduct({...editingProduct, stockStatus: e.target.checked})} className="rounded bg-[#050505] border-white/10" />
                    Available In-Stock
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                <input value={editingProduct?.image || ''} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Description (Markdown Supported)</label>
                <textarea rows={4} value={editingProduct?.descriptionUk || ''} onChange={e => setEditingProduct({...editingProduct, descriptionUk: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none resize-y" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors">
                  {editingProduct?.id ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

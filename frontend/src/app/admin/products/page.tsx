"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import { Product, PaginatedResponse, Category } from "@/types";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { Plus, Edit, Trash2, X, Image as ImageIcon } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
  });
  const [localImages, setLocalImages] = useState<File[]>([]);
  const [urlImages, setUrlImages] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await api.get<PaginatedResponse<Product>>("/admin/products");
      setProducts(res.data.data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
    });
    setLocalImages([]);
    setUrlImages([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id?.toString() || "",
    });
    setLocalImages([]);
    setUrlImages([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(formData.price) < 0) return toast.error("Price cannot be negative");
    if (Number(formData.stock) < 0) return toast.error("Stock cannot be negative");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("stock", formData.stock);
    if (formData.category_id) {
      payload.append("category_id", formData.category_id);
    }

    localImages.forEach((img) => payload.append("images[]", img));
    urlImages.forEach((url) => payload.append("image_urls[]", url));

    // Also support legacy field just in case
    if (urlImages.length > 0) {
      payload.append("image_url", urlImages[0]);
    }

    try {
      if (editingProduct) {
        payload.append("_method", "PUT");
        await api.post(`/admin/products/${editingProduct.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully");
      } else {
        await api.post("/admin/products", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created successfully");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save product");
    }
  };

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => <div className="font-medium text-zinc-900 dark:text-zinc-200">{info.getValue() as string}</div>,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "stock",
        header: "Stock",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditModal(row.original)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Products</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">Manage your product catalog</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center justify-center transition-all shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-zinc-500">Loading...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-zinc-200 dark:border-zinc-800">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 font-medium">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
          <button
            className="px-3 py-1 border border-zinc-200 dark:border-zinc-700 rounded-md disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <span className="text-zinc-500 text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <button
            className="px-3 py-1 border border-zinc-200 dark:border-zinc-700 rounded-md disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl mt-10 mb-10 border border-zinc-200 dark:border-zinc-800 relative">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Images (Local & URLs)</label>
                <div className="p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <label className="flex-1 cursor-pointer w-full">
                      <div className="flex items-center justify-center p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                        <ImageIcon className="w-5 h-5 mr-2 text-indigo-500" />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload Files</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            setLocalImages((prev) => [...prev, ...Array.from(e.target.files!)]);
                          }
                        }}
                      />
                    </label>
                    <span className="text-zinc-400">or</span>
                    <div className="flex-1 flex gap-2 w-full">
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newUrl) {
                            setUrlImages((prev) => [...prev, newUrl]);
                            setNewUrl("");
                          }
                        }}
                        className="px-3 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg text-sm text-zinc-800 dark:text-white font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {(localImages.length > 0 || urlImages.length > 0 || (editingProduct?.images && editingProduct.images.length > 0)) && (
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                      {/* Show existing images if editing */}
                      {editingProduct?.images?.map((img) => (
                        <div key={img.id} className="relative shrink-0">
                          <img src={img.image_url} alt="product" className="h-20 w-20 object-cover rounded-md border border-zinc-200 dark:border-zinc-700" />
                        </div>
                      ))}
                      {localImages.map((file, i) => (
                        <div key={`local-${i}`} className="relative shrink-0">
                          <img src={URL.createObjectURL(file)} alt="preview" className="h-20 w-20 object-cover rounded-md border border-zinc-200 dark:border-zinc-700" />
                          <button
                            type="button"
                            onClick={() => setLocalImages((prev) => prev.filter((_, idx) => idx !== i))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {urlImages.map((url, i) => (
                        <div key={`url-${i}`} className="relative shrink-0">
                          <img src={url} alt="preview" className="h-20 w-20 object-cover rounded-md border border-zinc-200 dark:border-zinc-700" />
                          <button
                            type="button"
                            onClick={() => setUrlImages((prev) => prev.filter((_, idx) => idx !== i))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

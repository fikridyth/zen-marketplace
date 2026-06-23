"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import type { Product, PaginatedResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      // The API endpoint /api/admin/products is protected by seller middleware on the backend
      const res = await api.get<PaginatedResponse<Product>>("/admin/products");
      setProducts(res.data.data);
    } catch (error) {
      toast.error("Failed to load your products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Product deleted successfully");
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Manage your store and products</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
            <span className="mr-2">➕</span> Add Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {products.filter((p) => p.stock > 0 && p.stock <= 5).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-500">
              {products.filter((p) => p.stock === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-zinc-400">Loading products...</div>
          ) : products.length > 0 ? (
            <div className="rounded-md border border-zinc-800">
              <Table>
                <TableHeader className="bg-zinc-900">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Name</TableHead>
                    <TableHead className="text-zinc-400">Price</TableHead>
                    <TableHead className="text-zinc-400">Stock</TableHead>
                    <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell className="font-medium text-zinc-200">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-zinc-300">${Number(product.price).toFixed(2)}</TableCell>
                      <TableCell>
                        {product.stock > 5 ? (
                          <Badge variant="outline" className="border-green-500/30 text-green-400">
                            {product.stock} in stock
                          </Badge>
                        ) : product.stock > 0 ? (
                          <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                            {product.stock} low
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-red-500/30 text-red-400">
                            Out of stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-indigo-400">
                              ✏️
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400"
                            onClick={() => handleDelete(product.id)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">No products yet</h3>
              <p className="text-zinc-400 mb-4">Start selling by adding your first product.</p>
              <Link href="/admin/products/new">
                <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
                  Create Product
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

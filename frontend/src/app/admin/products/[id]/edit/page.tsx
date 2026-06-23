"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data;
        setFormData({
          name: p.name,
          description: p.description || "",
          price: p.price.toString(),
          stock: p.stock.toString(),
          image_url: p.image_url || "",
        });
      } catch (error) {
        toast.error("Failed to load product details");
        router.push("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.put(`/admin/products/${id}`, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      });
      
      toast.success("Product updated successfully");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-zinc-400 text-center py-12">Loading product data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
            ← Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">Edit Product</h1>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Product Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">Description</Label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-zinc-300">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-zinc-300">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url" className="text-zinc-300">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700 text-white"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-32"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Customer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, UserPlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function CustomersClient() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        total_purchases: 0,
    });

    // Fetch customers
    const fetchCustomers = async () => {
        try {
            const response = await fetch("/api/customers");
            if (!response.ok) throw new Error("Failed to fetch customers");
            const data = await response.json();
            setCustomers(data);
            setFilteredCustomers(data);
        } catch (error) {
            console.error("Error fetching customers:", error);
            toast.error("Gagal memuat data pelanggan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Search filter
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredCustomers(customers);
        } else {
            const filtered = customers.filter(
                (customer) =>
                    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    customer.address.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCustomers(filtered);
        }
    }, [searchQuery, customers]);

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Nama pelanggan wajib diisi");
            return;
        }

        try {
            if (isEditMode && currentCustomer) {
                // Update customer
                console.log("Updating customer:", currentCustomer.id, formData);
                const response = await fetch(`/api/customers/${currentCustomer.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                console.log("Update response:", response.status, data);

                if (!response.ok) {
                    throw new Error(data.error || "Failed to update customer");
                }

                toast.success("Data pelanggan berhasil diperbarui");
            } else {
                // Create new customer
                console.log("Creating customer:", formData);
                const response = await fetch("/api/customers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                console.log("Create response:", response.status, data);

                if (!response.ok) {
                    throw new Error(data.error || "Failed to create customer");
                }

                toast.success("Pelanggan baru berhasil ditambahkan");
            }

            // Reset form and close dialog
            setFormData({ name: "", address: "", total_purchases: 0 });
            setIsDialogOpen(false);
            setIsEditMode(false);
            setCurrentCustomer(null);
            fetchCustomers();
        } catch (error) {
            console.error("Error saving customer:", error);
            toast.error(error instanceof Error ? error.message : "Gagal menyimpan data pelanggan");
        }
    };

    // Handle edit
    const handleEdit = (customer: Customer) => {
        setCurrentCustomer(customer);
        setFormData({
            name: customer.name,
            address: customer.address,
            total_purchases: customer.total_purchases,
        });
        setIsEditMode(true);
        setIsDialogOpen(true);
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
            return;
        }

        try {
            console.log("Deleting customer:", id);
            const response = await fetch(`/api/customers/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            console.log("Delete response:", response.status, data);

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete customer");
            }

            toast.success("Pelanggan berhasil dihapus");
            fetchCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
            toast.error(error instanceof Error ? error.message : "Gagal menghapus pelanggan");
        }
    };

    // Open dialog for new customer
    const handleAddNew = () => {
        setFormData({ name: "", address: "", total_purchases: 0 });
        setIsEditMode(false);
        setCurrentCustomer(null);
        setIsDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Add Button */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Cari Pelanggan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari berdasarkan nama atau alamat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            onClick={handleAddNew}
                            className="gradient-primary hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Pelanggan
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Daftar Pelanggan ({filteredCustomers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-12">
                            <UserPlus className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-lg font-semibold mb-1">
                                {searchQuery ? "Tidak ada hasil" : "Belum ada pelanggan"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {searchQuery
                                    ? "Coba kata kunci pencarian lain"
                                    : "Tambahkan pelanggan pertama Anda"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead className="text-right">Jumlah Pembelian</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium">
                                                {customer.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {customer.address || "-"}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {new Intl.NumberFormat("id-ID").format(customer.total_purchases)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(customer)}
                                                        className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(customer.id)}
                                                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditMode ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditMode
                                ? "Perbarui data pelanggan di bawah ini"
                                : "Masukkan data pelanggan baru"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nama <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Masukkan nama pelanggan"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat</Label>
                                <Textarea
                                    id="address"
                                    placeholder="Masukkan alamat pelanggan"
                                    value={formData.address}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="total_purchases">Jumlah Pembelian</Label>
                                <Input
                                    id="total_purchases"
                                    type="number"
                                    placeholder="0"
                                    value={formData.total_purchases}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            total_purchases: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    min="0"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="gradient-primary hover:shadow-lg hover:shadow-purple-500/50"
                            >
                                {isEditMode ? "Simpan Perubahan" : "Tambah Pelanggan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

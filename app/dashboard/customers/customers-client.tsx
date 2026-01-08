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
    const [formData, setFormData] = useState<{
        name: string;
        address: string;
        total_purchases: number | string;
    }>({
        name: "",
        address: "",
        total_purchases: "",
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

        // Format data for submission
        const submissionData = {
            ...formData,
            total_purchases: Number(formData.total_purchases) || 0,
        };

        try {
            if (isEditMode && currentCustomer) {
                // Update customer
                console.log("Updating customer:", currentCustomer.id, submissionData);
                const response = await fetch(`/api/customers/${currentCustomer.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(submissionData),
                });

                const data = await response.json();
                console.log("Update response:", response.status, data);

                if (!response.ok) {
                    throw new Error(data.error || "Failed to update customer");
                }

                toast.success("Data pelanggan berhasil diperbarui");
            } else {
                // Create new customer
                console.log("Creating customer:", submissionData);
                const response = await fetch("/api/customers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(submissionData),
                });

                const data = await response.json();
                console.log("Create response:", response.status, data);

                if (!response.ok) {
                    throw new Error(data.error || "Failed to create customer");
                }

                toast.success("Pelanggan baru berhasil ditambahkan");
            }

            // Reset form and close dialog
            setFormData({ name: "", address: "", total_purchases: "" });
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
            total_purchases: customer.total_purchases === 0 ? "" : customer.total_purchases,
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
        setFormData({ name: "", address: "", total_purchases: "" });
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
        <div className="space-y-3 md:space-y-6">
            {/* Search and Add Button */}
            <Card>
                <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Search className="w-4 h-4 md:w-5 md:h-5" />
                        Cari Pelanggan
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama atau alamat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 md:pl-10 h-9 md:h-10 text-sm"
                            />
                        </div>
                        <Button
                            onClick={handleAddNew}
                            className="gradient-primary hover:shadow-lg hover:shadow-purple-500/50 transition-all h-9 md:h-10 text-sm"
                        >
                            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                            <span className="hidden sm:inline">Tambah Pelanggan</span>
                            <span className="sm:hidden">Tambah</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
                <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                        Daftar Pelanggan ({filteredCustomers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-2 md:px-6">
                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-8 md:py-12">
                            <UserPlus className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-3 md:mb-4" />
                            <p className="text-base md:text-lg font-semibold mb-1">
                                {searchQuery ? "Tidak ada hasil" : "Belum ada pelanggan"}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                {searchQuery
                                    ? "Coba kata kunci pencarian lain"
                                    : "Tambahkan pelanggan pertama Anda"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-2 md:mx-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs md:text-sm">Nama</TableHead>
                                        <TableHead className="hidden md:table-cell text-xs md:text-sm">Alamat</TableHead>
                                        <TableHead className="text-right text-xs md:text-sm">Pembelian</TableHead>
                                        <TableHead className="text-right text-xs md:text-sm">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">
                                                <div className="max-w-[120px] md:max-w-none truncate">{customer.name}</div>
                                                <div className="md:hidden text-[10px] text-muted-foreground mt-0.5 truncate max-w-[120px]">
                                                    {customer.address || "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground text-xs md:text-sm">
                                                {customer.address || "-"}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-xs md:text-sm py-2 md:py-4">
                                                <div className="whitespace-nowrap">{new Intl.NumberFormat("id-ID").format(customer.total_purchases)}</div>
                                            </TableCell>
                                            <TableCell className="text-right py-2 md:py-4">
                                                <div className="flex justify-end gap-1 md:gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(customer)}
                                                        className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 h-7 w-7 md:h-8 md:w-8 p-0"
                                                    >
                                                        <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(customer.id)}
                                                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 h-7 w-7 md:h-8 md:w-8 p-0"
                                                    >
                                                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
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
                <DialogContent className="sm:max-w-[500px] p-4 md:p-6 gap-3 md:gap-6">
                    <DialogHeader className="space-y-1.5">
                        <DialogTitle className="text-lg md:text-xl">
                            {isEditMode ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
                        </DialogTitle>
                        <DialogDescription className="text-xs md:text-sm">
                            {isEditMode
                                ? "Perbarui data pelanggan di bawah ini"
                                : "Masukkan data pelanggan baru"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3 py-1 md:py-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs md:text-sm font-semibold">
                                    Nama <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Masukkan nama pelanggan"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="h-9 md:h-10 text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="address" className="text-xs md:text-sm font-semibold">Alamat</Label>
                                <Textarea
                                    id="address"
                                    placeholder="Masukkan alamat pelanggan"
                                    value={formData.address}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    className="text-sm min-h-[60px] md:min-h-[80px]"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="total_purchases" className="text-xs md:text-sm font-semibold">Jumlah Pembelian</Label>
                                <Input
                                    id="total_purchases"
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={formData.total_purchases}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            total_purchases: e.target.value === "" ? "" : e.target.value,
                                        })
                                    }
                                    className="h-9 md:h-10 text-sm"
                                    min="0"
                                />
                            </div>
                        </div>
                        <DialogFooter className="flex-row gap-2 mt-2 md:mt-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1 h-9 md:h-10 text-sm"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="flex-[1.5] gradient-primary hover:shadow-lg hover:shadow-purple-500/50 h-9 md:h-10 text-sm"
                            >
                                {isEditMode ? "Simpan" : "Tambah"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

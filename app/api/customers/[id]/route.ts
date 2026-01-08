import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { name, address, total_purchases } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Nama pelanggan wajib diisi" },
                { status: 400 }
            );
        }

        const { data: customer, error } = await supabase
            .from("customers")
            .update({
                name,
                address: address || "",
                total_purchases: total_purchases || 0,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!customer) {
            return NextResponse.json(
                { error: "Pelanggan tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        const { error } = await supabase
            .from("customers")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Pelanggan berhasil dihapus" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete customer" },
            { status: 500 }
        );
    }
}

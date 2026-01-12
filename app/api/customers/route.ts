import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: customers, error } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(customers);
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
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
            .insert([
                {
                    user_id: user.id,
                    name,
                    address: address || "",
                    total_purchases: total_purchases || 0,
                },
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }
}

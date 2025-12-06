import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/supabase/queries";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Ensure user profile exists (this will create it if it doesn't exist)
  try {
    await getUserProfile();
  } catch (error) {
    console.error("Error ensuring user profile exists:", error);
  }

  // Redirect to dashboard after ensuring profile exists
  redirect("/dashboard");
}
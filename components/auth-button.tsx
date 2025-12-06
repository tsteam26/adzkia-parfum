import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { getUserProfile } from "@/lib/supabase/queries";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Try to get user profile, which will create it if it doesn't exist
  let profile = null;
  if (user) {
    try {
      profile = await getUserProfile();
    } catch (error) {
      console.error("Error getting user profile:", error);
    }
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {profile?.store_name || user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/auth/actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("age_verified, privacy_consent_at")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/auth/login");
  }

  if (!profile.age_verified) {
    redirect("/onboarding/age");
  }

  if (!profile.privacy_consent_at) {
    redirect("/onboarding/privacy");
  }

  redirect("/memories");
}
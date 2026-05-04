"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function confirmAgeAction() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { error } = await supabase
    .from("users")
    .update({ age_verified: true })
    .eq("id", user.id);

  if (error) {
    redirect(`/onboarding/age?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/onboarding/privacy");
}

export async function acceptPrivacyAction() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { error } = await supabase
    .from("users")
    .update({
      privacy_consent_version: "mvp-v1",
      privacy_consent_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/onboarding/privacy?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/memories/new");
}
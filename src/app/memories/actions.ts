"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createMemorySchema = z.object({
  age_stage: z.enum(["childhood", "teen", "current", "custom"]),
  age_from: z.coerce.number().int().min(0).max(120).optional().nullable(),
  age_to: z.coerce.number().int().min(0).max(120).optional().nullable(),
  title: z.string().max(100).optional(),
  content: z.string().min(10, "回忆内容至少 10 个字").max(5000),
  location: z.string().max(100).optional(),
  emotion_tags: z.string().optional(),
});

function parseEmotionTags(input?: string) {
  if (!input) return [];
  return input
    .split(/[，,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);
}

export async function createMemoryAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const parsed = createMemorySchema.safeParse({
    age_stage: formData.get("age_stage"),
    age_from: formData.get("age_from") || null,
    age_to: formData.get("age_to") || null,
    title: formData.get("title") || "",
    content: formData.get("content") || "",
    location: formData.get("location") || "",
    emotion_tags: formData.get("emotion_tags") || "",
  });

  if (!parsed.success) {
    redirect(`/memories/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "表单信息错误")}`);
  }

  const { age_from, age_to } = parsed.data;

  if (age_from !== null && age_to !== null && age_from !== undefined && age_to !== undefined && age_from > age_to) {
    redirect(`/memories/new?error=${encodeURIComponent("起始年龄不能大于结束年龄")}`);
  }

  const { error } = await supabase.from("memories").insert({
    user_id: user.id,
    age_stage: parsed.data.age_stage,
    age_from: parsed.data.age_from,
    age_to: parsed.data.age_to,
    title: parsed.data.title || null,
    content: parsed.data.content,
    location: parsed.data.location || null,
    emotion_tags: parseEmotionTags(parsed.data.emotion_tags),
    sensitivity_level: 0,
    user_confirmed: true,
  });

  if (error) {
    redirect(`/memories/new?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/memories");
}

export async function deleteMemoryAction(formData: FormData) {
  const memoryId = String(formData.get("memory_id") || "");

  if (!memoryId) redirect("/memories");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  await supabase
    .from("memories")
    .delete()
    .eq("id", memoryId)
    .eq("user_id", user.id);

  redirect("/memories");
}
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteMemoryAction } from "./actions";
import { signOutAction } from "@/app/auth/actions";

function getStageLabel(stage: string) {
  switch (stage) {
    case "childhood":
      return "童年";
    case "teen":
      return "青春期";
    case "current":
      return "现在";
    default:
      return "自定义";
  }
}

export default async function MemoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("age_verified, privacy_consent_at")
    .eq("id", user.id)
    .single();

  if (!profile?.age_verified) redirect("/onboarding/age");
  if (!profile?.privacy_consent_at) redirect("/onboarding/privacy");

  const { data: memories, error } = await supabase
    .from("memories")
    .select("id, age_stage, age_from, age_to, title, content, location, emotion_tags, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">你的私人回忆库</p>
          <h1 className="mt-2 text-3xl font-semibold">回忆列表</h1>
          <p className="mt-2 text-sm text-gray-600">
            这些回忆将用于后续生成不同年龄段的 AI 自己。
          </p>
        </div>
        <form action={signOutAction}>
          <button className="rounded-lg border px-4 py-2 text-sm" type="submit">
            退出
          </button>
        </form>
      </header>

      <div className="mt-8 flex justify-between gap-3">
        <Link href="/memories/new" className="rounded-lg bg-black px-4 py-2 text-sm text-white">
          添加回忆
        </Link>
        <Link href="/dashboard" className="rounded-lg border px-4 py-2 text-sm">
          刷新状态
        </Link>
      </div>

      <section className="mt-8 space-y-4">
        {!memories || memories.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center">
            <h2 className="text-lg font-medium">还没有回忆</h2>
            <p className="mt-2 text-sm text-gray-500">先写下一段童年、青春期或现在的回忆。</p>
            <Link href="/memories/new" className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm text-white">
              开始填写
            </Link>
          </div>
        ) : (
          memories.map((memory) => (
            <article key={memory.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    {getStageLabel(memory.age_stage)}
                    {memory.age_from !== null || memory.age_to !== null
                      ? ` · ${memory.age_from ?? "?"}-${memory.age_to ?? "?"} 岁`
                      : ""}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold">{memory.title || "未命名回忆"}</h2>
                </div>
                <form action={deleteMemoryAction}>
                  <input type="hidden" name="memory_id" value={memory.id} />
                  <button className="rounded-lg border px-3 py-1 text-sm text-red-600" type="submit">
                    删除
                  </button>
                </form>
              </div>

              {memory.location ? <p className="mt-2 text-sm text-gray-500">{memory.location}</p> : null}

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {memory.content}
              </p>

              {Array.isArray(memory.emotion_tags) && memory.emotion_tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {memory.emotion_tags.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
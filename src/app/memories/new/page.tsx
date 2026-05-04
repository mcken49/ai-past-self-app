import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createMemoryAction } from "../actions";

export default async function NewMemoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
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

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/memories" className="text-sm text-gray-500 underline">
        返回回忆列表
      </Link>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">第一步：写下一段真实回忆</p>
        <h1 className="mt-2 text-2xl font-semibold">添加一段回忆</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          不需要一次写完人生。先写一段你愿意告诉 AI 的回忆即可。敏感内容可以跳过。
        </p>

        {params.error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {decodeURIComponent(params.error)}
          </div>
        ) : null}

        <form action={createMemoryAction} className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium">回忆阶段</label>
            <select name="age_stage" required className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="childhood">童年，约 6-12 岁</option>
              <option value="teen">青春期，约 13-18 岁</option>
              <option value="current">现在的我</option>
              <option value="custom">自定义阶段</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">起始年龄</label>
              <input name="age_from" type="number" min="0" max="120" className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="例如 16" />
            </div>
            <div>
              <label className="text-sm font-medium">结束年龄</label>
              <input name="age_to" type="number" min="0" max="120" className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="例如 18" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">标题，可选</label>
            <input name="title" className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="例如：高考前的那个夏天" />
          </div>

          <div>
            <label className="text-sm font-medium">当时的城市 / 学校 / 环境，可选</label>
            <input name="location" className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="例如：重庆，一所寄宿高中" />
          </div>

          <div>
            <label className="text-sm font-medium">这段回忆</label>
            <textarea
              name="content"
              required
              minLength={10}
              rows={8}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="写写当时发生了什么，你的感受、害怕、期待、遗憾或梦想。"
            />
          </div>

          <div>
            <label className="text-sm font-medium">情绪标签，可选</label>
            <input name="emotion_tags" className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="例如：焦虑，孤独，期待" />
            <p className="mt-1 text-xs text-gray-500">用逗号或空格分隔，最多保存 10 个。</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600">
            提醒：你可以之后删除这段回忆。AI 生成内容仅基于你提供的信息进行推测，不代表真实预测。
          </div>

          <button className="w-full rounded-lg bg-black px-4 py-2 text-white" type="submit">
            保存这段回忆
          </button>
        </form>
      </div>
    </main>
  );
}
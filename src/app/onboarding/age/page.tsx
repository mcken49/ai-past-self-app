import { confirmAgeAction } from "../actions";

export default async function AgePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">开始前确认</p>
        <h1 className="mt-2 text-2xl font-semibold">你是否已满 18 岁？</h1>
        <p className="mt-4 text-sm leading-6 text-gray-600">
          本产品会引导你填写人生回忆，并生成 AI 对话内容。MVP 阶段仅面向 18 岁以上用户开放。
        </p>

        {params.error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {decodeURIComponent(params.error)}
          </div>
        ) : null}

        <form action={confirmAgeAction} className="mt-6">
          <button className="w-full rounded-lg bg-black px-4 py-2 text-white" type="submit">
            我确认已满 18 岁
          </button>
        </form>
      </div>
    </main>
  );
}
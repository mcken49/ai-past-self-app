import { acceptPrivacyAction } from "../actions";

export default async function PrivacyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">隐私与 AI 内容说明</p>
        <h1 className="mt-2 text-2xl font-semibold">请先了解这些边界</h1>

        {params.error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {decodeURIComponent(params.error)}
          </div>
        ) : null}

        <div className="mt-6 space-y-4 text-sm leading-6 text-gray-700">
          <p>1. 你填写的回忆会用于生成不同年龄段的 AI 自己。</p>
          <p>2. AI 生成内容仅供自我探索、娱乐和反思，不代表真实预测或专业建议。</p>
          <p>3. 平行人生内容属于 AI 假设推演，不代表真实世界一定会发生。</p>
          <p>4. MVP 阶段默认不将你的私密回忆用于模型训练。</p>
          <p>5. 你可以在设置中删除回忆、对话、人格和全部个人数据。</p>
          <p>6. 本产品不是心理治疗产品，不能替代心理咨询师、医生或其他专业人士。</p>
        </div>

        <form action={acceptPrivacyAction} className="mt-8">
          <button className="w-full rounded-lg bg-black px-4 py-2 text-white" type="submit">
            我已了解并同意继续
          </button>
        </form>
      </div>
    </main>
  );
}
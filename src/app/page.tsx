import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-12">
      <section className="text-center">
        <p className="text-sm text-gray-500">AI 私人回忆应用</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
          和过去的自己聊聊，看看另一种人生。
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
          填写真实回忆，生成不同年龄段的 AI 自己。你可以和童年的你、18 岁的你、现在的你对话，也可以探索某个选择改变后的平行人生。
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/auth/signup" className="rounded-lg bg-black px-5 py-3 text-sm text-white">
            开始体验
          </Link>
          <Link href="/auth/login" className="rounded-lg border px-5 py-3 text-sm">
            登录
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">生成过去的自己</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">基于你填写的回忆，生成 12 岁、18 岁、现在的 AI 自己。</p>
        </div>
        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">对话与和解</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">和某个年龄段的自己聊聊，重新理解当时的害怕、梦想和选择。</p>
        </div>
        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">平行人生</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">如果当时换一个选择，另一个你会过着怎样的生活？</p>
        </div>
      </section>
    </main>
  );
}
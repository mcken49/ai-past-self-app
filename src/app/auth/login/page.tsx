import Link from "next/link";
import { signInAction } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">登录</h1>
        <p className="mt-2 text-sm text-gray-500">继续遇见不同年龄段的自己。</p>

        {params.error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {decodeURIComponent(params.error)}
          </div>
        ) : null}

        <form action={signInAction} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">邮箱</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">密码</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="至少 8 位"
            />
          </div>

          <button className="w-full rounded-lg bg-black px-4 py-2 text-white" type="submit">
            登录
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          还没有账号？
          <Link href="/auth/signup" className="ml-1 text-black underline">
            注册
          </Link>
        </p>
      </div>
    </main>
  );
}
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm soft-card p-6 sm:p-7">
        {/* Logo */}
        <div className="text-center mb-7">
          <Image
            src={`${basePath}/logo.png`}
            alt="LeanStreak logo"
            width={56}
            height={56}
            className="mx-auto rounded-2xl"
            priority
          />
          <h1 className="text-2xl font-bold text-[var(--foreground)] mt-2">LeanStreak</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Build healthy habits, one streak at a time.</p>
        </div>
        {children}
      </div>
    </div>
  );
}

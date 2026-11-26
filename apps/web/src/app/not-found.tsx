import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020604] text-white font-sans">
      <h2 className="text-2xl font-bold text-emerald-400">404 - পৃষ্ঠাটি পাওয়া যায়নি</h2>
      <p className="mt-2 text-sm text-emerald-300/70">অনুরোধকৃত রিসোর্সটি খুঁজে পাওয়া যায়নি।</p>
      <Link
        href="/"
        className="mt-5 rounded-xl bg-emerald-500/20 px-4 py-2 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
      >
        হোমে ফিরে যান
      </Link>
    </div>
  );
}

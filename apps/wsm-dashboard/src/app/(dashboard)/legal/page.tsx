import Legal3DClient from './Legal3DClient';

export default function LegalPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          ⚖️ B2B Legal & Compliance Structure
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Інтерактивна 3D-візуалізація юридичної архітектури екосистеми (IP, договори, фінансові потоки та ризики). Обертайте камеру та наводьте на вузли.
        </p>
      </div>

      <div className="flex-1 bg-[#0D0F14] rounded-xl overflow-hidden border border-white/5 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <Legal3DClient />
      </div>
    </div>
  );
}

import FounderChatClient from './FounderChatClient';

export const dynamic = 'force-dynamic';

export default function FounderPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          👑 Founder OS (Master Brain)
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Ексклюзивний доступ для Fedchenko Maksym Serhiyovych. Цей ШІ має абсолютні права на аналіз АрхіВу Поведінки та управління резервами (L&D 7% Net Profit Allocator).
        </p>
      </div>

      <FounderChatClient />
    </div>
  );
}

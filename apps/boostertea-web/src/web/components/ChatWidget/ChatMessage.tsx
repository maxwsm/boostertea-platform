import type { Message } from './types';

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-xs flex-shrink-0">
          🍵
        </div>
      )}
      <div
        className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] whitespace-pre-wrap leading-relaxed ${
          isUser
            ? 'bg-[var(--accent)] text-[var(--bg-primary)] rounded-br-sm'
            : 'bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-bl-sm border border-[var(--border)]'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

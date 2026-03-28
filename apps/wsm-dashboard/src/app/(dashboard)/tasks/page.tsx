import { prisma as db } from '@wsm/db';
import TasksClient from './TasksClient';

export const dynamic = 'force-dynamic';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            📋 Team Tasks (Enterprise CRM)
          </h1>
          <p className="text-sm text-gray-400">
            Система контролю виконання задач команди з підтримкою AI-нагадувань від Gemini.
          </p>
        </div>
      </div>

      <TasksClient />
    </div>
  );
}

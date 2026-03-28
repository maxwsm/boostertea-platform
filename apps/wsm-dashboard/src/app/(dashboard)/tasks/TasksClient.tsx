'use client';

import { useState, useEffect } from 'react';

type Task = {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  assignee: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
};

export default function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
      });
  }, []);

  const handleAiSync = async () => {
    setSyncing(true);
    setAiReport(null);
    try {
      const res = await fetch('/api/tasks/reminders', { method: 'POST' });
      const data = await res.json();
      setAiReport(data.report);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const columns = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-[#111] p-4 rounded-xl border border-white/10">
        <div className="flex gap-4">
          <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded font-medium transition-colors">
            + Створити задачу
          </button>
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full border-2 border-[#111] bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs uppercase">ІБ</div>
            <div className="w-10 h-10 rounded-full border-2 border-[#111] bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs uppercase">ОК</div>
            <div className="w-10 h-10 rounded-full border-2 border-[#111] bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs uppercase">MW</div>
          </div>
        </div>

        <button 
          onClick={handleAiSync}
          disabled={syncing}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded font-medium transition-colors flex items-center gap-2"
        >
          {syncing ? 'Аналіз Gemini...' : '🤖 AI Task Sync (Gemini)'}
        </button>
      </div>

      {aiReport && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
          <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
            <span className="animate-pulse">🤖</span> AI Sync Звіт
          </h3>
          <p className="text-gray-300 text-sm whitespace-pre-wrap">{aiReport}</p>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map(status => (
          <div key={status} className="bg-[#111]/50 p-4 rounded-xl border border-white/5 flex flex-col min-h-[500px]">
            <h3 className="text-gray-400 font-medium mb-4 flex justify-between items-center">
              {status.replace('_', ' ')}
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            
            <div className="flex-1 space-y-3">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-white/10 shadow-lg cursor-grab active:cursor-grabbing hover:border-gray-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      task.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">#{task.id}</span>
                  </div>
                  <p className="text-white text-sm font-medium leading-snug mb-4">{task.title}</p>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/20 text-[8px] flex items-center justify-center font-bold uppercase">
                        {task.assignee.substring(0, 2)}
                      </div>
                      <span className="text-xs text-gray-400">{task.assignee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
}

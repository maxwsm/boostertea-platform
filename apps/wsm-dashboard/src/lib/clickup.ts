/**
 * TITAN OMNI-CHANNEL ERP: ClickUp SDK
 * Auto-dispatches physical/technical tasks to employees based on AI / System triggers.
 */

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN || '';
const WORKSPACE_ID = process.env.CLICKUP_WORKSPACE_ID || '90152362126';
// In reality, spaces and lists are required before tasks. We assume a default list ID here or get it dynamically.
const DEFAULT_LIST_ID = process.env.CLICKUP_DEFAULT_LIST_ID || '';

export async function createLogisticsTask(taskName: string, description: string, priority: '1'|'2'|'3'|'4' = '2') {
  if (!CLICKUP_API_TOKEN || !DEFAULT_LIST_ID) {
    console.warn('[ClickUp SDK] CLICKUP_API_TOKEN or LIST_ID is missing. Skipping task creation.');
    return null;
  }

  try {
    const res = await fetch(`https://api.clickup.com/api/v2/list/${DEFAULT_LIST_ID}/task`, {
      method: 'POST',
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: taskName,
        description: description,
        priority: priority, // 1 is Urgent, 4 is Low
        status: 'To Do'
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`ClickUp API Error: ${err.err}`);
    }

    const data = await res.json();
    console.log(`[ClickUp SDK] Task Created: ${data.url}`);
    return data;
  } catch (err: any) {
    console.error(`[ClickUp Error]:`, err.message);
    return null;
  }
}

// Приклад використання AI HR Dispatcher
export async function dispatchHRWarning(date: string) {
  return createLogisticsTask(
    `[AI FORECAST] Залучити додаткових пакувальників на ${date}`,
    `Алгоритм "Герой Району" виявив аномальний ріст ROAS (відсоток конверсії +45%).\nНеобхідно залучити на 2 людини більше на зміну, щоб уникнути затримок.`,
    '1' // Urgent
  );
}

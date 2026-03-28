import { CoreButton } from '@wsm/ui';
import { products } from '@wsm/config';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl font-bold text-green-500 mb-4">
          DinoSlush
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
          Welcome to the DinoSlush interface. This app is powered by the WSM Master Ecosystem. 
        </p>
        
        <div className="my-6">
          <CoreButton>Start Order</CoreButton>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl w-full">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">IMPORTED FROM @WSM/CONFIG</h2>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {products.slice(0,3).map(p => (
              <span key={p.id} className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

import { redirect } from 'next/navigation';
import { prisma } from '@wsm/db';
import { StoreInitializer } from '../../src/web/components/StoreInitializer';

export default async function RecoverPage({
  searchParams,
}: {
  searchParams: { sid?: string };
}) {
  const sid = searchParams.sid;
  
  if (!sid) {
    return redirect('/');
  }

  const shadowCart = await prisma.shadowCart.findUnique({
    where: { sessionId: sid }
  });

  if (!shadowCart) {
    return redirect('/');
  }

  let payload = null;
  try {
    payload = JSON.parse(shadowCart.payload);
  } catch(e) {}

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white font-sans">
       <StoreInitializer preloadedCart={payload} />
       
       <div className="flex flex-col items-center justify-center gap-4">
         <div className="w-12 h-12 border-4 border-[#C8FA5F] border-t-transparent rounded-full animate-spin"></div>
         <p className="text-xl font-medium text-[#C8FA5F]">Завантажуємо збережений кошик...</p>
         <p className="text-sm text-gray-500">Ми відновили вашу сесію через Shadow Closer</p>
       </div>
    </div>
  );
}

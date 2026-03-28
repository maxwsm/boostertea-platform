import { NextResponse } from 'next/server';

const MONOBANK_API_URL = 'https://api.monobank.ua/api/merchant/invoice/create';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, products, redirectUrl } = body;

    // Ensure we have the Monobank API token in the environment
    const token = process.env.MONOBANK_API_TOKEN;
    if (!token) {
      console.error('[Monobank API] No token provided in .env');
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const payload = {
      amount: Math.round(amount * 100), // Convert UAH to kopecks
      ccy: 980, // UAH
      merchantPaymInfo: {
        reference: `order_\${Date.now()}`,
        destination: `Оплата замовлення в BoosterTea`,
        basketOrder: products.map((p: any) => ({
          name: p.name,
          qty: p.qty,
          sum: Math.round(p.price * 100),
          icon: p.img || '',
          unit: 'шт.'
        }))
      },
      redirectUrl: redirectUrl || `\${process.env.NEXT_PUBLIC_APP_URL}/telegram/store/success`,
      webHookUrl: `\${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/monobank`,
      validity: 3600 // 1 hour validity
    };

    const response = await fetch(MONOBANK_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Token': token
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Monobank API] Error:', response.status, errText);
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ pageUrl: data.pageUrl, invoiceId: data.invoiceId });
  } catch (error: any) {
    console.error('[Checkout Route] Internal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

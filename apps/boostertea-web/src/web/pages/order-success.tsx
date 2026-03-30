import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TelegramButton from '../components/TelegramButton';
import { useTranslation } from '../lib/i18n';
import { SEO } from '../components/SEO';
import { Confetti } from '../components/animations';

interface OrderDetails {
  orderNumber: string;
  status: string;
  total: number;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  deliveryMethod: string;
  deliveryCity: string;
  deliveryWarehouse?: string;
  createdAt: string;
  items?: Array<{
    productName: string;
    volume: string;
    quantity: number;
    totalPrice: number;
  }>;
}

const OrderSuccess = () => {
  const { t, language } = useTranslation();

  // Track purchase conversion on page load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const orderNum = params.get('order');
      const w = window as any;
      if (orderNum && w.BT_Track) w.BT_Track.purchase(orderNum, 0, []);
    } catch(e) {}
  }, []);
  const searchParams = useSearchParams();
  const search = searchParams ? searchParams.toString() : '';
  const params = new URLSearchParams(search);
  const orderNumber = params.get('order');
  const isDemo = params.get('demo') === 'true';
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  // GA4 DataLayer integration for purchase
  useEffect(() => {
    if (orderDetails) {
      try {
        const gtmWindow = window as any;
        gtmWindow.dataLayer = gtmWindow.dataLayer || [];
        gtmWindow.dataLayer.push({
          event: "purchase",
          user_data: { 
            email: orderDetails.customerEmail
          },
          ecommerce: {
            transaction_id: orderDetails.orderNumber,
            affiliation: "BoosterTea Store",
            value: orderDetails.total,
            currency: "UAH",
            items: orderDetails.items?.map(item => ({
              item_id: item.productName,
              item_name: item.productName,
              item_variant: item.volume,
              price: item.totalPrice / item.quantity,
              quantity: item.quantity
            })) || []
          }
        });
      } catch(e) {}
    }
  }, [orderDetails]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderNumber}`);
        if (response.ok) {
          const data = await response.json();
          setOrderDetails({
            orderNumber: data.order.orderNumber,
            status: data.order.status,
            total: data.order.total,
            paymentStatus: data.order.paymentStatus,
            customerName: data.order.customerName,
            customerEmail: data.order.customerEmail,
            deliveryMethod: data.order.deliveryMethod,
            deliveryCity: data.order.deliveryCity,
            deliveryWarehouse: data.order.deliveryWarehouse,
            createdAt: data.order.createdAt,
            items: data.items
          });
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();

    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [orderNumber]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-[var(--accent)]';
      case 'pending':
      case 'processing':
        return 'text-[#C9A55C]';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-[var(--text-primary)]';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('orderSuccess.status.pending'),
      processing: t('orderSuccess.status.processing'),
      paid: t('orderSuccess.status.paid'),
      shipped: t('orderSuccess.status.shipped'),
      delivered: t('orderSuccess.status.delivered'),
      cancelled: t('orderSuccess.status.cancelled')
    };
    return statusMap[status] || status;
  };

  const getDeliveryMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      nova_poshta: t('checkout.delivery.novaPoshta'),
      ukrposhta: t('checkout.delivery.ukrposhta'),
      pickup: t('checkout.delivery.pickup')
    };
    return methodMap[method] || method;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO 
        title={t('orderSuccess.title')}
        description={t('orderSuccess.description')}
        noIndex={true}
      />
      {showConfetti && <Confetti active={showConfetti} />}
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin w-8 h-8 border-2 border-[#9FD356] border-t-transparent rounded-full" />
            </div>
          ) : orderDetails ? (
            <>
              {/* Success Icon */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-[var(--accent)]/20 rounded-full flex items-center justify-center animate-scale-in">
                  <svg className="w-12 h-12 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h1 
                  className="text-3xl sm:text-4xl text-[var(--text-primary)] mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('orderSuccess.title')}
                </h1>
                
                <p className="text-[var(--text-primary)]/var(--text-muted) text-lg">
                  {t('orderSuccess.subtitle')}
                </p>
              </div>

              {/* Demo Notice */}
              {isDemo && (
                <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <p className="text-amber-400 text-center">
                    ⚠️ {t('orderSuccess.demoNotice')}
                  </p>
                </div>
              )}

              {/* Order Details Card */}
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 border border-[var(--card-border)] mb-8">
                {/* Order Number & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b border-[var(--border)]">
                  <div>
                    <p className="text-[var(--text-primary)]/var(--text-muted) text-sm mb-1">{t('orderSuccess.orderNumber')}</p>
                    <p className="text-[var(--text-primary)] text-xl font-bold">{orderDetails.orderNumber}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:text-right">
                    <p className="text-[var(--text-primary)]/var(--text-muted) text-sm mb-1">{t('orderSuccess.orderStatus')}</p>
                    <p className={`text-lg font-semibold ${getStatusColor(orderDetails.status)}`}>
                      {getStatusText(orderDetails.status)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                {orderDetails.items && orderDetails.items.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-[var(--border)]">
                    <h3 className="text-[var(--text-primary)] font-medium mb-4">{t('orderSuccess.items')}</h3>
                    <div className="space-y-3">
                      {orderDetails.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-[var(--text-primary)]/var(--text-secondary)">
                            {item.productName} ({item.volume}) × {item.quantity}
                          </span>
                          <span className="text-[var(--text-primary)]">{item.totalPrice.toLocaleString()}₴</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery Info */}
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <h3 className="text-[var(--text-primary)] font-medium mb-4">{t('orderSuccess.deliveryInfo')}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{t('checkout.fields.deliveryMethod')}</p>
                      <p className="text-[var(--text-primary)]">{getDeliveryMethodText(orderDetails.deliveryMethod)}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{t('checkout.fields.city')}</p>
                      <p className="text-[var(--text-primary)]">{orderDetails.deliveryCity}</p>
                    </div>
                    {orderDetails.deliveryWarehouse && (
                      <div className="sm:col-span-2">
                        <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{t('checkout.fields.warehouse')}</p>
                        <p className="text-[var(--text-primary)]">{orderDetails.deliveryWarehouse}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <h3 className="text-[var(--text-primary)] font-medium mb-4">{t('orderSuccess.contactInfo')}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{t('checkout.fields.name')}</p>
                      <p className="text-[var(--text-primary)]">{orderDetails.customerName}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{t('checkout.fields.email')}</p>
                      <p className="text-[var(--text-primary)]">{orderDetails.customerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-primary)] text-lg">{t('cart.total')}</span>
                  <span className="text-[var(--accent)] text-3xl font-bold">{orderDetails.total.toLocaleString()}₴</span>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 border border-[var(--card-border)] mb-8">
                <h3 
                  className="text-xl text-[var(--text-primary)] mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('orderSuccess.whatsNext')}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--accent)] text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-medium">{t('orderSuccess.step1Title')}</p>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{t('orderSuccess.step1Desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--accent)] text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-medium">{t('orderSuccess.step2Title')}</p>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{t('orderSuccess.step2Desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--accent)] text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-medium">{t('orderSuccess.step3Title')}</p>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{t('orderSuccess.step3Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/account"
                  className="flex-1 py-4 px-6 bg-[var(--accent)] text-[#0D0D0D] font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all text-center"
                >
                  {t('orderSuccess.trackOrder')}
                </Link>
                <Link 
                  href="/products"
                  className="flex-1 py-4 px-6 border border-[#F5F0E8]/20 text-[var(--text-primary)] font-medium rounded-xl hover:bg-[#F5F0E8]/10 transition-all text-center"
                >
                  {t('orderSuccess.continueShopping')}
                </Link>
              </div>
            </>
          ) : (
            /* No Order Found */
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#F5F0E8]/10 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-[var(--text-primary)]/var(--text-subtle)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h1 
                className="text-2xl text-[var(--text-primary)] mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('orderSuccess.notFound')}
              </h1>
              
              <p className="text-[var(--text-primary)]/var(--text-muted) mb-8">
                {t('orderSuccess.notFoundDesc')}
              </p>
              
              <Link 
                href="/"
                className="inline-block py-3 px-8 bg-[var(--accent)] text-[#0D0D0D] font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all"
              >
                {t('404.home')}
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <TelegramButton />
    </div>
  );
};

export default OrderSuccess;

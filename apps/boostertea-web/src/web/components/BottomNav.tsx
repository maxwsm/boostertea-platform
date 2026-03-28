import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ShoppingCart, BookOpen, User } from 'lucide-react';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useStore } from '../lib/store';

interface NavItem {
  href: string;
  icon: typeof Home;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: Home, label: 'Головна' },
  { href: '/products', icon: ShoppingBag, label: 'Каталог' },
  { href: '/cart', icon: ShoppingCart, label: 'Кошик' },
  { href: '/blog', icon: BookOpen, label: 'Блог' },
  { href: '/account', icon: User, label: 'Акаунт' },
];

export function BottomNav() {
  const location = usePathname() || '/';
  const scrollDirection = useScrollDirection();
  const { cart } = useStore();
  
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (href: string) => {
    if (href === '/') {
      return location === '/';
    }
    return location.startsWith(href);
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--bg-primary)]/95 backdrop-blur-md border-t border-[var(--border-color)] transition-transform duration-300 ${
        scrollDirection === 'down' ? 'translate-y-full' : 'translate-y-0'
      }`}
      style={{ height: '56px' }}
      aria-label="Мобільна навігація"
    >
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          const isCart = href === '/cart';
          
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
                active 
                  ? 'text-[var(--color-primary)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} 
                />
                {/* Cart badge */}
                {isCart && cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[var(--color-primary)] text-black text-xs font-bold rounded-full px-1">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${active ? 'font-semibold' : 'font-normal'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;

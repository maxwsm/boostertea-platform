// App Entry Point
import { Route, Switch } from "wouter";
import React, { Suspense, useState } from "react";
import Home from "./pages/index";
import { Provider } from "./components/provider";
import { StoreProvider } from "./lib/store";
import { AuthProvider } from "./lib/auth";
import { I18nProvider } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme";
import { CookieConsent } from "./components/CookieConsent";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { BottomNav } from "./components/BottomNav";
import { LaunchSequence } from "./components/LaunchSequence";
import ChatWidget from "./components/ChatWidget";
import { Search } from "./components/Search";
import { PageSkeleton } from "./components/Skeleton";
import { LivePurchasesPopup } from "./components/LivePurchasesPopup";
import { TornPageEasterEgg } from "./components/TornPageEasterEgg";
import { TelemetryTracker } from "./components/TelemetryTracker";
import { SmartCartDrawer } from "./components/SmartCartDrawer";
import { UpsellModal } from "./components/UpsellModal";
import { useStore } from "./lib/store";

// Lazy load all pages except Home (for LCP)
const Products = React.lazy(() => import("./pages/products"));
const ProductDetail = React.lazy(() => import("./pages/product-detail"));
const Accessories = React.lazy(() => import("./pages/accessories"));
const B2B = React.lazy(() => import("./pages/b2b"));
const Adaptation = React.lazy(() => import("./pages/adaptation"));
const Blog = React.lazy(() => import("./pages/blog"));
const BlogPost = React.lazy(() => import("./pages/blog-post"));
const Cart = React.lazy(() => import("./pages/cart"));
const Checkout = React.lazy(() => import("./pages/checkout"));
const OrderSuccess = React.lazy(() => import("./pages/order-success"));
const Account = React.lazy(() => import("./pages/account"));
const Login = React.lazy(() => import("./pages/login"));
const Register = React.lazy(() => import("./pages/register"));
const Contacts = React.lazy(() => import("./pages/contacts"));
const Admin = React.lazy(() => import("./pages/admin"));
const Privacy = React.lazy(() => import("./pages/privacy"));
const Terms = React.lazy(() => import("./pages/terms"));
const ReturnPolicy = React.lazy(() => import("./pages/return-policy"));
const Certificates = React.lazy(() => import("./pages/certificates"));
const NotFound = React.lazy(() => import("./pages/404"));
const MLM = React.lazy(() => import("./pages/mlm"));
const Influencer = React.lazy(() => import("./pages/influencer"));
const BaristaGateway = React.lazy(() => import("./pages/barista"));

// Lazy route wrapper component
function LazyRoute({ children }: { children: React.ReactNode }) {
        return (
                <Suspense fallback={<PageSkeleton />}>
                        {children}
                </Suspense>
        );
}

function GlobalSearchWrapper() {
        const { isSearchOpen, setSearchOpen } = useStore();
        return <Search isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />;
}

function GlobalTelemetryTracker() {
        React.useEffect(() => {
                try {
                        const params = new URLSearchParams(window.location.search);
                        const refCode = params.get('ref');
                        if (refCode) {
                                const existing = localStorage.getItem('wsm_ref_code');
                                if (existing !== refCode) {
                                        localStorage.setItem('wsm_ref_code', refCode);
                                        // Notify backend about click
                                        fetch('/api/ambassadors/click', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ refCode })
                                        }).catch(() => {});
                                }
                        }
                } catch(e) {}
        }, []);
        return null;
}

function App() {
        return (
                <Provider>
                        <ThemeProvider>
                                <I18nProvider>
                                        <AuthProvider>
                                                <StoreProvider>
                                                        <LaunchSequence />
                                                        <CookieConsent />
                                                        
                                                        <GlobalTelemetryTracker />
                                                        <TelemetryTracker />
                                                        
                                                        {/* Behavioral Economics Upsell Modals */}
                                                        <UpsellModal />

                                                        <GlobalSearchWrapper />
                                                        
                                                        {/* Global Smart Cart Drawer */}
                                                        <SmartCartDrawer />
                                                        
                                                        {/* Error Boundary wraps all routes */}
                                                        <ErrorBoundary>
                                                                <div className="pb-16 md:pb-0">
                                                                        <Switch>
                                                                                {/* Home - eager loaded for LCP */}
                                                                                <Route path="/" component={Home} />
                                                                                
                                                                                {/* Lazy loaded routes */}
                                                                                <Route path="/products">
                                                                                        <LazyRoute><Products /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/products/:slug">
                                                                                        {(params) => (
                                                                                                <LazyRoute><ProductDetail /></LazyRoute>
                                                                                        )}
                                                                                </Route>
                                                                                <Route path="/accessories">
                                                                                        <LazyRoute><Accessories /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/b2b">
                                                                                        <LazyRoute><B2B /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/adaptation">
                                                                                        <LazyRoute><Adaptation /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/mlm">
                                                                                        <LazyRoute><MLM /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/influencer">
                                                                                        <LazyRoute><Influencer /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/blog">
                                                                                        <LazyRoute><Blog /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/blog/:slug">
                                                                                        {(params) => (
                                                                                                <LazyRoute><div className="text-white p-20 text-center text-xl mt-32">Server Components Required</div></LazyRoute>
                                                                                        )}
                                                                                </Route>
                                                                                <Route path="/cart">
                                                                                        <LazyRoute><Cart /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/checkout">
                                                                                        <LazyRoute><Checkout /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/order-success">
                                                                                        <LazyRoute><OrderSuccess /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/barista">
                                                                                        <LazyRoute><BaristaGateway /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/account">
                                                                                        <LazyRoute><Account /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/login">
                                                                                        <LazyRoute><Login /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/register">
                                                                                        <LazyRoute><Register /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/contacts">
                                                                                        <LazyRoute><Contacts /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/admin">
                                                                                        <LazyRoute><Admin /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/privacy">
                                                                                        <LazyRoute><Privacy /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/privacy-policy">
                                                                                        <LazyRoute><Privacy /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/terms">
                                                                                        <LazyRoute><Terms /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/terms-of-use">
                                                                                        <LazyRoute><Terms /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/return-policy">
                                                                                        <LazyRoute><ReturnPolicy /></LazyRoute>
                                                                                </Route>
                                                                                <Route path="/certificates">
                                                                                        <LazyRoute><Certificates /></LazyRoute>
                                                                                </Route>
                                                                                
                                                                                {/* 404 fallback */}
                                                                                <Route>
                                                                                        <LazyRoute><NotFound /></LazyRoute>
                                                                                </Route>
                                                                        </Switch>
                                                                </div>
                                                        </ErrorBoundary>
                                                        
                                                        {/* Mobile Bottom Navigation */}
                                                        <BottomNav />

                                                        <LivePurchasesPopup />
                                                        <TornPageEasterEgg />

                                                        {/* AI Chat Widget */}
                                                        <ChatWidget />
                                                </StoreProvider>
                                        </AuthProvider>
                                </I18nProvider>
                        </ThemeProvider>
                </Provider>
        );
}

export default App;

import React, { useState } from 'react';
import { useCart } from './CartStore';

const UPSELL_PRODUCT = {
  id: 'u1',
  name: 'Booster Base (1 Літр) + Дозатор',
  price: 380.00,
  oldPrice: 450.00,
  category: 'upsell'
};

export const CartOverlay = () => {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal, addToCart, clearCart } = useCart();
  
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'upsell' | 'success'
  const [formData, setFormData] = useState({ name: '', phone: '', npBranch: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-close if cart is empty and we are looking at the cart step
  if (!isCartOpen) return null;

  const handleClose = () => {
    if (step === 'success') clearCart();
    setStep('cart');
    toggleCart();
  };

  const submitDetails = (e) => {
    e.preventDefault();
    setStep('upsell');
  };

  const processOrder = async (withUpsell = false) => {
    setIsProcessing(true);
    if (withUpsell) {
      addToCart(UPSELL_PRODUCT);
    }
    
    // Fake API call to backend (creating Order in Prisma)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setStep('success');
  };

  return (
    <div className="cart-overlay-backdrop fade-in" onClick={step === 'success' ? handleClose : null}>
      <div className="cart-panel slide-in-right" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cyber-glitch-text">
            {step === 'cart' && 'CYBER-CART //'}
            {step === 'checkout' && 'SECURE CHECKOUT //'}
            {step === 'upsell' && 'WAIT! SPECIAL OFFER //'}
            {step === 'success' && 'MISSION ACCOMPLISHED //'}
          </h2>
          <button className="close-btn action-btn orange" onClick={handleClose}>[ X ]</button>
        </div>

        {/* STEP 1: CART ITEMS */}
        {step === 'cart' && (
          <>
            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart-msg">Сховище порожнє. Додай дофаміну!</div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="cart-item-card task-card primary">
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">{item.price.toFixed(2)} UAH</div>
                    </div>
                    <div className="item-controls" style={{marginTop: '10px'}}>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="qty-display" style={{color: '#fff', margin: '0 5px'}}>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>DEL</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="total-display">
                <span>TOTAL:</span>
                <span className="total-amount">{cartTotal.toFixed(2)} UAH</span>
              </div>
              <button 
                className="submit-btn checkout-btn" 
                disabled={cartItems.length === 0}
                onClick={() => setStep('checkout')}
              >
                PROCEED TO CHECKOUT {'>'}
              </button>
            </div>
          </>
        )}

        {/* STEP 2: CHECKOUT FORM */}
        {step === 'checkout' && (
          <form className="assign-form" style={{flex: 1, display: 'flex', flexDirection: 'column'}} onSubmit={submitDetails}>
            <div className="cart-items" style={{overflow: 'visible'}}>
              <div className="form-group">
                <label>Повне Ім'я (Кодове ім'я):</label>
                <input 
                  type="text" 
                  className="checkout-input" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Самурай..."
                />
              </div>
              <div className="form-group">
                <label>Твій Комунікатор (Телефон):</label>
                <input 
                  type="tel" 
                  className="checkout-input" 
                  required 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+380..."
                />
              </div>
              <div className="form-group">
                <label>Локація Дропу (Відділення НП):</label>
                <input 
                  type="text" 
                  className="checkout-input" 
                  required 
                  value={formData.npBranch}
                  onChange={e => setFormData({...formData, npBranch: e.target.value})}
                  placeholder="м. Київ, Відділення №1"
                />
              </div>
            </div>
            
            <div className="cart-footer">
               <button type="button" className="action-btn" style={{marginBottom: '10px'}} onClick={() => setStep('cart')}>
                 {'<'} ПОВЕРНУТИСЬ ДО КОРЗИНИ
               </button>
               <button type="submit" className="submit-btn checkout-btn">
                 ПІДТВЕРДИТИ ДАНІ
               </button>
            </div>
          </form>
        )}

        {/* STEP 3: UPSELL ENGINE */}
        {step === 'upsell' && (
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center'}}>
            <div className="upsell-alert pulse-animation">
              🔥 СТОП! ТІЛЬКИ ЗАРАЗ 🔥
            </div>
            <p style={{textAlign: 'center', color: '#fff'}}>
              Ти вже замовляєш Booster T. Забери літрову базу зі знижкою 15%, щоб вистачило надовго!
            </p>
            
            <div className="task-card primary" style={{width: '100%', borderColor: 'var(--neon-green)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h3 style={{color: '#fff', fontSize: '1.2rem', marginBottom: '10px'}}>{UPSELL_PRODUCT.name}</h3>
              <div style={{display: 'flex', gap: '15px', alignItems: 'baseline'}}>
                <span style={{textDecoration: 'line-through', color: 'var(--neon-red)'}}>{UPSELL_PRODUCT.oldPrice} UAH</span>
                <span style={{fontSize: '1.5rem', color: 'var(--neon-green)', fontWeight: 'bold'}}>{UPSELL_PRODUCT.price} UAH</span>
              </div>
            </div>

            <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px'}}>
              <button 
                className="submit-btn" 
                style={{background: 'var(--neon-green)', color: '#000'}}
                onClick={() => processOrder(true)}
                disabled={isProcessing}
              >
                {isProcessing ? '[ ПЕРЕДАЧА ДАНИХ... ]' : '+ ТАК, ДОДАЙТЕ В ЗАМОВЛЕННЯ'}
              </button>
              <button 
                className="action-btn" 
                style={{borderColor: 'var(--border-dark)', color: 'var(--text-muted)'}}
                onClick={() => processOrder(false)}
                disabled={isProcessing}
              >
                НІ, ОПЛАТИТИ ЯК Є
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px'}}>
             <div className="success-icon" style={{fontSize: '4rem'}}>🏆</div>
             <h3 className="cyber-glitch-text" style={{color: 'var(--neon-green)'}}>[ ПЛАТІЖ ПРИЙНЯТО ]</h3>
             <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>
               Твоє замовлення успішно передано на виробництво (Вул. Городоцька 242).
               <br/><br/>
               Очікуй ТТН в боті!
             </p>
             <button className="submit-btn" style={{width: '100%', marginTop: '30px'}} onClick={handleClose}>
               ЗАКРИТИ ТА ПОВЕРНУТИСЬ
             </button>
          </div>
        )}

      </div>

      <style>{`
        .checkout-input {
          width: 100%;
          background: rgba(0,0,0,0.5);
          border: 1px dashed var(--neon-blue);
          color: #fff;
          padding: 12px;
          font-family: inherit;
          font-size: 1rem;
          margin-bottom: 15px;
        }
        .checkout-input:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(0, 204, 255, 0.4);
          border-color: var(--neon-green);
        }
        .upsell-alert {
          background: rgba(255, 42, 42, 0.1);
          border: 1px solid var(--neon-red);
          color: var(--neon-red);
          padding: 10px 20px;
          font-weight: bold;
          font-size: 1.2rem;
          text-shadow: 0 0 10px rgba(255,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

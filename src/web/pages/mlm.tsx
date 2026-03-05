import { SEO, generateFAQSchema } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useI18n } from '../lib/i18n';
import { useState } from 'react';

const mlmFAQs = [
  { question: 'Як стати партнером BoosterTea?', answer: 'Зареєструйтесь через реферальне посилання існуючого партнера або залиште заявку на сайті. Після підтвердження ви отримаєте персональне посилання та доступ до партнерського кабінету.' },
  { question: 'Скільки можна заробити?', answer: 'Дохід залежить від вашої активності. В середньому: Стартовий рівень — 3000-8000₴/міс, Бронзовий — 8000-20000₴/міс, Срібний — 20000-50000₴/міс, Золотий — від 50000₴/міс.' },
  { question: 'Чи потрібно купувати товар наперед?', answer: 'Ні. Ви рекомендуєте продукт через своє посилання, клієнт замовляє на сайті, ми доставляємо. Ви отримуєте комісію після оплати.' },
  { question: 'Як відстежувати свої продажі?', answer: 'У партнерському кабінеті ви бачите всі переходи, замовлення, нараховані бонуси та статистику вашої мережі в реальному часі.' },
];

const levels = [
  { name: 'Стартовий', icon: '🌱', commission: '10%', teamBonus: '—', requirement: 'Реєстрація', monthlyTarget: '—', color: 'from-green-500/20 to-green-600/20' },
  { name: 'Бронзовий', icon: '🥉', commission: '12%', teamBonus: '3% від 1 лінії', requirement: '5 особистих клієнтів', monthlyTarget: '10 000₴', color: 'from-amber-600/20 to-amber-700/20' },
  { name: 'Срібний', icon: '🥈', commission: '15%', teamBonus: '5% від 1 лінії + 2% від 2 лінії', requirement: '3 активних партнери', monthlyTarget: '30 000₴', color: 'from-gray-300/20 to-gray-400/20' },
  { name: 'Золотий', icon: '🥇', commission: '18%', teamBonus: '7% від 1 лінії + 4% від 2 лінії + 2% від 3 лінії', requirement: '5 активних партнерів + 2 Срібних', monthlyTarget: '100 000₴', color: 'from-yellow-400/20 to-yellow-500/20' },
  { name: 'Платиновий', icon: '💎', commission: '20%', teamBonus: '8% + 5% + 3% + 1%', requirement: '3 Золотих у мережі', monthlyTarget: '300 000₴', color: 'from-purple-400/20 to-purple-500/20' },
];

export default function MLMPage() {
  const { t } = useI18n();
  const [calc, setCalc] = useState({ clients: 10, avgOrder: 1000, partners: 3 });

  const personalIncome = calc.clients * calc.avgOrder * 0.12;
  const teamIncome = calc.partners * 5 * calc.avgOrder * 0.03;
  const totalIncome = personalIncome + teamIncome;

  return (
    <>
      <SEO
        title="Партнерська програма BoosterTea"
        description="Приєднуйтесь до партнерської мережі BoosterTea. Заробляйте від 10% до 20% на рекомендаціях преміального чаю. 5 рівнів розвитку, бонуси за команду."
        breadcrumbs={[
          { name: 'Головна', url: '/' },
          { name: 'Партнерська програма', url: '/mlm' }
        ]}
      />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs 
          items={[
            { label: 'Головна', href: '/' },
            { label: 'Партнерська програма' }
          ]} 
        />
      </div>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-black to-neutral-900 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🤝</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Партнерська програма<br/>
            <span className="text-amber-400">BoosterTea</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Рекомендуйте преміальний чай та отримуйте від 10% до 20% з кожного продажу. 
            Будуйте команду — заробляйте більше.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register?ref=mlm" className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all">
              Стати партнером
            </a>
            <a href="#calculator" className="border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-bold py-4 px-8 rounded-xl text-lg transition-all">
              Розрахувати дохід
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-neutral-900 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Як це працює</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: '📝', title: 'Реєстрація', desc: 'Створіть акаунт та отримайте персональне реферальне посилання' },
              { step: '02', icon: '📢', title: 'Рекомендація', desc: 'Діліться посиланням у соцмережах, месенджерах, особисто' },
              { step: '03', icon: '🛒', title: 'Продаж', desc: 'Клієнт замовляє через ваше посилання — ми доставляємо' },
              { step: '04', icon: '💰', title: 'Дохід', desc: 'Отримуйте комісію автоматично після кожної оплати' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-amber-400 text-sm font-bold mb-2">КРОК {item.step}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Рівні партнерства</h2>
          <p className="text-gray-400 text-center mb-12">Зростайте разом з BoosterTea — кожен рівень відкриває нові можливості</p>
          <div className="space-y-4">
            {levels.map((level) => (
              <div key={level.name} className={`bg-gradient-to-r ${level.color} border border-white/10 rounded-xl p-6`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{level.icon}</span>
                    <div>
                      <h3 className="text-white font-bold text-lg">{level.name}</h3>
                      <p className="text-gray-400 text-sm">{level.requirement}</p>
                    </div>
                  </div>
                  <div className="flex gap-8 text-sm">
                    <div><span className="text-gray-500">Комісія:</span> <span className="text-amber-400 font-bold">{level.commission}</span></div>
                    <div><span className="text-gray-500">Команда:</span> <span className="text-white">{level.teamBonus}</span></div>
                    <div><span className="text-gray-500">Оборот:</span> <span className="text-white">{level.monthlyTarget}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="bg-neutral-900 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Калькулятор доходу</h2>
          <div className="bg-neutral-800 rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Клієнтів на місяць</label>
                <input type="range" min="1" max="50" value={calc.clients} onChange={(e) => setCalc({...calc, clients: +e.target.value})} className="w-full accent-amber-500" />
                <div className="text-white font-bold text-xl text-center mt-2">{calc.clients}</div>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Середній чек, ₴</label>
                <input type="range" min="500" max="5000" step="100" value={calc.avgOrder} onChange={(e) => setCalc({...calc, avgOrder: +e.target.value})} className="w-full accent-amber-500" />
                <div className="text-white font-bold text-xl text-center mt-2">{calc.avgOrder}₴</div>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Партнерів у команді</label>
                <input type="range" min="0" max="20" value={calc.partners} onChange={(e) => setCalc({...calc, partners: +e.target.value})} className="w-full accent-amber-500" />
                <div className="text-white font-bold text-xl text-center mt-2">{calc.partners}</div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-gray-400 text-sm">Особисті продажі</div>
                  <div className="text-green-400 font-bold text-2xl">{personalIncome.toLocaleString()}₴</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Бонус за команду</div>
                  <div className="text-blue-400 font-bold text-2xl">{teamIncome.toLocaleString()}₴</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Разом на місяць</div>
                  <div className="text-amber-400 font-bold text-3xl">{totalIncome.toLocaleString()}₴</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Переваги партнерства</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📦', title: 'Без закупок', desc: 'Не потрібно купувати товар наперед. Клієнт замовляє — ми доставляємо.' },
              { icon: '📊', title: 'Прозора аналітика', desc: 'Партнерський кабінет з реальними даними: кліки, замовлення, виплати.' },
              { icon: '🎓', title: 'Навчання', desc: 'Безкоштовне навчання продажам, маркетингу та роботі з соцмережами.' },
              { icon: '🚀', title: 'Зростання', desc: '5 рівнів партнерства з зростаючими бонусами та привілеями.' },
              { icon: '💳', title: 'Швидкі виплати', desc: 'Виплати двічі на місяць на будь-яку карту українського банку.' },
              { icon: '🤝', title: 'Підтримка', desc: 'Персональний менеджер, маркетингові матеріали, готові тексти та креативи.' },
            ].map((item) => (
              <div key={item.title} className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-900 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Часті питання</h2>
          <div className="space-y-4">
            {mlmFAQs.map((faq, i) => (
              <details key={i} className="bg-neutral-800 border border-white/10 rounded-xl p-6 group">
                <summary className="text-white font-bold cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <span className="text-amber-400 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="text-gray-400 mt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-neutral-900 to-black py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Готові почати заробляти?</h2>
          <p className="text-gray-400 mb-8">Приєднуйтесь до партнерської мережі BoosterTea вже сьогодні. Реєстрація безкоштовна.</p>
          <a href="/register?ref=mlm" className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-12 rounded-xl text-lg transition-all">
            Зареєструватися як партнер
          </a>
          <p className="text-gray-600 text-sm mt-4">Або напишіть нам: <a href="https://t.me/booster_tea_b2b" className="text-amber-400">@booster_tea_b2b</a></p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(generateFAQSchema(mlmFAQs))}} />
    </>
  );
}

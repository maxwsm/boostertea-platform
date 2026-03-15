import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — Часті запитання про BoosterTea',
  description:
    'Відповіді на часті запитання: як заварювати чайний концентрат, склад, терміни придатності, доставка по Україні, B2B умови.',
  openGraph: {
    title: 'FAQ — Часті запитання | BoosterTea',
    description: 'Все що вам потрібно знати про чайні концентрати BoosterTea.',
    url: 'https://www.boostertea.com.ua/faq',
  },
}

const faqs = [
  {
    question: 'Скільки порцій у пляшці 1L?',
    answer:
      'У пляшці 1L міститься 40+ порцій при використанні 25 мл концентрату на стакан (200-250 мл гарячої води).',
  },
  {
    question: 'Скільки порцій у пляшці 0.25L?',
    answer:
      'У пляшці 0.25L міститься 10+ порцій при використанні 25 мл на стакан. Ідеально для першої спроби або в дорогу.',
  },
  {
    question: 'Як зберігати концентрат?',
    answer:
      'Нерозкрита пляшка зберігається при кімнатній температурі. Після відкриття — у холодильнику до 14 днів.',
  },
  {
    question: 'Чи потрібно спеціальне обладнання для приготування?',
    answer:
      'Ні. Просто додайте 25 мл концентрату в чашку та залийте гарячою водою (85–95°C). Готово за 15 секунд.',
  },
  {
    question: 'Чи є штучні ароматизатори чи консерванти?',
    answer:
      'Ні. BoosterTea містить виключно натуральний чайний екстракт без ароматизаторів, барвників та консервантів.',
  },
  {
    question: 'Яка мінімальна кількість для замовлення?',
    answer:
      'Мінімальне замовлення: 6 пляшок 1L або 12 пляшок 0.25L. Для B2B — уточнюйте у менеджера.',
  },
  {
    question: 'Чи є доставка за межі України?',
    answer:
      'Наразі доставляємо тільки по Україні через Нову Пошту. Міжнародна доставка — незабаром.',
  },
  {
    question: 'Скільки кофеїну в концентраті?',
    answer:
      'Вміст кофеїну: PU-ERH ~ 40 мг/порцію, DA HONG PAO ~ 35 мг, GABA ~ 15 мг. Для порівняння — в еспресо ~63 мг.',
  },
  {
    question: 'Чи можна використовувати в кафе або ресторані?',
    answer:
      'Так! BoosterTea ідеально підходить для HoReCa: не потрібне обладнання, мінімальне навчання персоналу, висока маржинальність. Напишіть нам для B2B умов.',
  },
  {
    question: 'Звідки береться чай?',
    answer:
      'PU-ERH — провінція Юньнань, Китай. DA HONG PAO — гори Уї, Фуцзянь, Китай. GABA — Тайвань. Листя відбирається вручну від перевірених постачальників.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-[var(--bg-primary)] py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h1
              className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Часті <span className="gradient-text">запитання</span>
            </h1>
            <p className="text-[var(--text-muted)] text-lg">
              Все про чайні концентрати BoosterTea
            </p>
          </header>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none text-[var(--text-primary)] font-medium text-lg hover:text-[var(--accent)] transition-colors">
                  {faq.question}
                  <svg
                    className="w-5 h-5 shrink-0 ml-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-6 pb-6 text-[var(--text-muted)] leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-[var(--text-muted)] mb-4">Не знайшли відповідь?</p>
            <a
              href="https://t.me/booster_tea_b2b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-black font-semibold px-6 py-3 rounded-full hover:bg-[var(--accent-hover)] transition-colors"
            >
              Написати в Telegram
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

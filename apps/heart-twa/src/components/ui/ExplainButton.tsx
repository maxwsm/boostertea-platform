"use client";

/**
 * EXPLAIN BUTTON — Universal "explain this" button
 * 
 * Provides multi-layer explanation of any concept:
 * 1. Простий приклад (Simple example)
 * 2. Логіка (Logic/mechanism)
 * 3. Візуальна алюзія (Visual metaphor)
 * 4. Сцена з фільму (Movie scene reference)
 * 
 * Uses Gemini API for dynamic explanations when data isn't pre-loaded.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, Lightbulb, Cpu, Palette, Film,
  X, Loader2, ChevronDown,
} from "lucide-react";

interface ExplainLayer {
  icon: typeof Lightbulb;
  label: string;
  content: string;
}

// Pre-built explanations for core concepts
const EXPLANATIONS: Record<string, ExplainLayer[]> = {
  "cortisol": [
    { icon: Lightbulb, label: "Простими словами", content: "Кортизол — це ваша внутрішня сигналізація. Коли вам страшно або стресово, мозок вмикає її. Все добре, якщо вона вимикається після загрози. Погано — якщо вона горить 24/7." },
    { icon: Cpu, label: "Як це працює", content: "Гіпоталамус → Гіпофіз → Наднирники (HPA-вісь). Кортизол мобілізує глюкозу, підвищує АТ, пригнічує імунітет. Хронічний підвищений рівень руйнує гіпокамп (пам'ять) і prefrontal cortex (рішення)." },
    { icon: Palette, label: "Уявіть собі", content: "Уявіть пожежну сирену у вашому домі. Коли горить — сирена рятує. Але якщо вона виє цілодобово без пожежі — ви перестанете спати, їсти, думати. Ваші сусіди (органи) теж виснажаться." },
    { icon: Film, label: "Як у фільмі", content: "Пам'ятаєте «Інтерсвітяне»? Одна година на планеті Міллера = 7 років на Землі. Кортизол працює так само: один день хронічного стресу може зістарити ваш мозок на тижні." },
  ],
  "dopamine": [
    { icon: Lightbulb, label: "Простими словами", content: "Допамін — це не «гормон щастя», а гормон «хочу ще». Він змушує вас тягнутися до нового повідомлення, ще одного ролика, ще одного шматка торта. Він дає передчуття кайфу, а не сам кайф." },
    { icon: Cpu, label: "Як це працює", content: "VTA (вентральна тегментальна область) → Nucleus Accumbens. Допамін виділяється НЕ від нагороди, а від ОЧІКУВАННЯ нагороди. Тому скролінг TikTok затягує — кожне відео = міні-лотерея." },
    { icon: Palette, label: "Уявіть собі", content: "Допамін — це осел, якому показують морквину на палиці. Він біжить за нею, але ніколи не дістає. Мудрість — зупинитися і поїсти траву під ногами." },
    { icon: Film, label: "Як у фільмі", content: "Фільм «Соціальна дилема»: кожне сповіщення на телефоні — це допаміновий гачок. Розробники додатків буквально проектують вашу залежність. Усвідомити це = перший крок до свободи." },
  ],
  "shadow": [
    { icon: Lightbulb, label: "Простими словами", content: "Тінь — це частина вас, яку ви ховаєте від себе і від інших. Наприклад, ви говорите «я ніколи не злюся», але насправді злість є — просто прихована. І саме ця прихована злість керує вашими рішеннями." },
    { icon: Cpu, label: "Як це працює", content: "Юнг: Тінь = витіснений зміст несвідомого. IFS (Шварц): Тінь = 'вигнанець' (exile) — частина, яка несе рану. Захисні частини (менеджери та пожежники) ховають вигнанця, але він керує з-за куліс." },
    { icon: Palette, label: "Уявіть собі", content: "Уявіть, що ви — це будинок. Тінь — це кімната, двері якої ви замкнули і забули. Але з-за дверей чутно стук. Чим довше ігноруєте — тим гучніше стукає. Одного дня двері вилетять." },
    { icon: Film, label: "Як у фільмі", content: "«Бійцівський клуб»: Тайлер Дерден — це буквально Тінь оповідача. Все, що він тримав усередині — агресію, бунт, свободу — вибухнуло окремою особистістю. Тінь не зникає якщо її ігнорувати." },
  ],
  "polyvagal": [
    { icon: Lightbulb, label: "Простими словами", content: "Ваша нервова система працює як світлофор. Зелений — все ок, ви спокійні і можете думати. Жовтий — стрес, серце б'ється, хочеться тікати або сваритися. Червоний — завмирання, ви ніби «вимкнулись» і не можете нічого робити." },
    { icon: Cpu, label: "Як це працює", content: "Блукаючий нерв (vagus) має 2 гілки: вентральну (безпека, соціальна залученість) і дорсальну (завмирання, колапс). Між ними — симпатична НС (fight/flight). Порядок реакції еволюційний: спочатку пробуємо поговорити → не вийшло — тікаємо/б'ємо → зовсім погано — завмираємо." },
    { icon: Palette, label: "Уявіть собі", content: "Ви — ліфт у 3-поверховому будинку. Верхній поверх — кабінет (ви думаєте, спілкуєтесь). Середній — спортзал (ви бігаєте, б'єте грушу). Підвал — бункер (ви лежите і не рухаєтесь). Стрес натискає кнопку «вниз»." },
    { icon: Film, label: "Як у фільмі", content: "«Головоломка» (Inside Out): коли Райлі втрачає радість і смуток — залишається тільки гнів і страх (симпатика). А коли все зовсім погано — вона «вимикається» і нічого не відчуває (дорсальний вагус). Ідеальна ілюстрація 3 станів." },
  ],
  "serotonin": [
    { icon: Lightbulb, label: "Простими словами", content: "Серотонін — це ваше внутрішнє відчуття «мені досить». Коли його мало — вам здається що ви гірші за інших, що треба більше працювати, що все погано. Коли його достатньо — ви спокійні і задоволені тим що маєте." },
    { icon: Cpu, label: "Як це працює", content: "95% серотоніну виробляється в кишечнику (!), тільки 5% — в мозку (raphe nuclei). Тому здоровий кишечник = здоровий настрій. Серотонін регулює сон, апетит, настрій і відчуття соціального статусу." },
    { icon: Palette, label: "Уявіть собі", content: "Серотонін — це рівень води в озері. Коли води достатньо — все квітне навколо. Коли рівень падає — видно бруд, сміття і каміння на дні. Бруд і сміття завжди були — просто вода їх приховувала." },
    { icon: Film, label: "Як у фільмі", content: "«Ешкрофт» або будь-який фільм про депресію: герой бачить світ сірим, не може радіти нічому, не хоче їсти. Це буквально картина низького серотоніну. Одна таблетка SSRI не змінить життя — але прогулянка на сонці + спорт + здорова їжа — змінять." },
  ],
  "escapist": [
    { icon: Lightbulb, label: "Простими словами", content: "Ескапіст — це коли ви замість роботи гортаєте стрічку, замість складної розмови дивитесь серіал, замість вирішення проблеми — їсте. Це не лінощі. Це мозок, який ховається від болю." },
    { icon: Cpu, label: "Як це працює", content: "Дорсальний вагус маскується під «відпочинок». Допамін шукає швидке задоволення (скролінг, їжа, покупки). Кортизол фоново підвищений. Сенсорна система перевантажена → мозок натискає «вимкнути»." },
    { icon: Palette, label: "Уявіть собі", content: "Ви стоїте перед великою горою. Замість того щоб почати підніматися — ви сідаєте на лавку і дивитесь на гору. Потім дістаєте телефон. Потім каву. Гора нікуди не дінеться. Але ваш день — вже закінчився." },
    { icon: Film, label: "Як у фільмі", content: "«Матриця»: Нео живе в симуляції, бо реальність надто страшна. Ескапізм — це ваша особиста Матриця. Червона таблетка = визнати що ви тікаєте. Синя = продовжити гортати стрічку." },
  ],
  "perfectionist": [
    { icon: Lightbulb, label: "Простими словами", content: "Перфекціоніст — це коли ви переробляєте проект 10 разів і все одно «не готово». Коли ви не можете делегувати, бо «вони зроблять гірше». Коли ви виснажуєтесь не від роботи, а від контролю." },
    { icon: Cpu, label: "Як це працює", content: "Кортизол + Адреналін постійно підвищені (режим «бий»). Мозок сприймає помилку як загрозу виживанню. Префронтальна кора в режимі гіперсканування. Окситоцин знижений → стосунки страждають." },
    { icon: Palette, label: "Уявіть собі", content: "Уявіть скульптора який вирізає статую. Він вже зробив шедевр — але продовжує «виправляти». Ще трішки тут, ще там. Поки статуя не розсипається. Перфекціоніст руйнує саме те, що намагається зберегти." },
    { icon: Film, label: "Як у фільмі", content: "«Одержимість» (Whiplash): Ендрю стукає на барабанах до крові. Його вчитель каже: «Найшкідливіші слова — ‹достатньо добре›». Але фільм показує правду: перфекціонізм = руйнування здоров'я і стосунків заради ілюзії ідеалу." },
  ],
  "victim": [
    { icon: Lightbulb, label: "Простими словами", content: "Жертва — це коли здається що «я нічого не можу змінити», «все залежить від інших», «чому саме зі мною?». Це не слабкість. Це стан нервової системи, коли мозок «завмер» від безсилля." },
    { icon: Cpu, label: "Як це працює", content: "Дорсальний вагус в режимі колапсу. Допамін і тестостерон критично низькі (learned helplessness — Селігман). Окситоцин підвищений — шукає «рятувальника». Кортизол хронічно високий." },
    { icon: Palette, label: "Уявіть собі", content: "Слон у цирку: малим його прив'язали тонкою мотузкою. Він не міг вирватись. Виріс — може порвати будь-який ланцюг. Але не пробує. Бо «знає» що не вийде. Жертва — це дорослий слон з мотузкою на нозі." },
    { icon: Film, label: "Як у фільмі", content: "«Втеча з Шоушенка»: Брукс вийшов на волю після 50 років — і не зміг жити на свободі. Він звик бути жертвою системи. Ред — теж, але він ОБРАВ свободу. Жертва стає вільною коли робить ОДНУ дію, навіть маленьку." },
  ],
};

interface ExplainButtonProps {
  conceptId: string;
  label?: string;
  size?: "sm" | "md";
}

export function ExplainButton({ conceptId, label, size = "sm" }: ExplainButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicLayers, setDynamicLayers] = useState<ExplainLayer[] | null>(null);

  const layers = dynamicLayers || EXPLANATIONS[conceptId] || null;

  const fetchExplanation = useCallback(async () => {
    if (layers) return; // Already have data
    setIsLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptId, label }),
      });
      if (res.ok) {
        const data = await res.json();
        setDynamicLayers(data.layers);
      }
    } catch { /* fallback to default */ }
    setIsLoading(false);
  }, [conceptId, label, layers]);

  const handleOpen = () => {
    setIsOpen(true);
    setActiveLayer(0);
    if (!layers) fetchExplanation();
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className={`inline-flex items-center gap-1 rounded-full transition-all hover:opacity-80 ${
          size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-3 py-1.5 text-[11px]"
        }`}
        style={{
          backgroundColor: "var(--v-accent-muted)",
          color: "var(--v-accent)",
          border: "1px solid var(--v-border)",
        }}
      >
        <HelpCircle size={size === "sm" ? 10 : 14} />
        <span className="font-mono tracking-wide">{label || "Поясни"}</span>
      </button>

      {/* Explanation modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full max-w-md rounded-t-[24px] p-5 pb-10 max-h-[85vh] overflow-y-auto"
              style={{ backgroundColor: "var(--v-bg)", border: "1px solid var(--v-border)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: "var(--v-border)" }} />

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold" style={{ color: "var(--v-text)" }}>
                  {label || conceptId}
                </h3>
                <button onClick={() => setIsOpen(false)}>
                  <X size={18} style={{ color: "var(--v-text-dim)" }} />
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin" style={{ color: "var(--v-accent)" }} />
                </div>
              ) : layers ? (
                <>
                  {/* Layer tabs */}
                  <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
                    {layers.map((layer, i) => {
                      const LayerIcon = layer.icon;
                      return (
                        <button
                          key={i}
                          onClick={() => setActiveLayer(i)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] whitespace-nowrap transition-all text-[11px]"
                          style={{
                            backgroundColor: i === activeLayer ? "var(--v-accent-muted)" : "var(--v-bg-input)",
                            color: i === activeLayer ? "var(--v-accent)" : "var(--v-text-dim)",
                            border: `1px solid ${i === activeLayer ? "var(--v-accent)" : "var(--v-border)"}`,
                          }}
                        >
                          <LayerIcon size={12} />
                          {layer.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeLayer}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-[16px]"
                      style={{ backgroundColor: "var(--v-bg-card)", border: "1px solid var(--v-border)" }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {(() => {
                          const L = layers[activeLayer].icon;
                          return <L size={16} style={{ color: "var(--v-accent)" }} />;
                        })()}
                        <span className="text-xs font-bold" style={{ color: "var(--v-text)" }}>
                          {layers[activeLayer].label}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--v-text-muted)" }}>
                        {layers[activeLayer].content}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Swipe hint */}
                  {activeLayer < layers.length - 1 && (
                    <motion.button
                      onClick={() => setActiveLayer(prev => Math.min(prev + 1, layers.length - 1))}
                      className="flex items-center justify-center gap-1 w-full mt-3 py-2 text-[10px] font-mono"
                      style={{ color: "var(--v-text-dim)" }}
                      animate={{ y: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ChevronDown size={12} />
                      Ще {layers.length - activeLayer - 1} пояснення
                    </motion.button>
                  )}
                </>
              ) : (
                <p className="text-sm text-center py-8" style={{ color: "var(--v-text-dim)" }}>
                  Пояснення для цього поняття ще не додано
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

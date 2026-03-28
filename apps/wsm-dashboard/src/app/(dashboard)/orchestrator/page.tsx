import { MetaCampaignCard } from "./components/MetaCampaignCard";
import AmbassadorFunnel from "./components/AmbassadorFunnel";
import { ContentProductionPanel } from "./components/ContentProductionPanel";
import { PhysicalProductionPanel } from "./components/PhysicalProductionPanel";
import { Globe, BotMessageSquare, Users, Cpu } from 'lucide-react';

// Цей компонент є головною сторінкою Оркестратора.
// В реальному застосунку `aiSuggestions` будуть приходити з API, яке взаємодіє з Gemini.

async function getAiCampaignSuggestions() {
  // Mock-дані, що імітують відповідь від Gemini 1.5 Pro
  return [
    {
      id: 'gemini-sugg-1',
      targetAudience: 'Lookalike (Vertex AI) - High LTV Users',
      headline: '🍵 Твій ідеальний ранок починається з BoosterTea.',
      primaryText: 'Відчуй прилив енергії та натхнення з першого ковтка. Наші ексклюзивні бленди створені для твоїх великих звершень. Знижка 20% на перше замовлення! ✨',
      cta: 'SHOP_NOW',
    },
    {
      id: 'gemini-sugg-2',
      targetAudience: 'Broad Audience - Ukraine, 25-45',
      headline: '💥 DinoSlush: Вибух смаку, що повертає в дитинство!',
      primaryText: 'Пам\'ятаєш той самий смак? Ми його повернули! DinoSlush - це не просто напій, це квиток у найтепліші спогади. Спробуй зараз та отримай стікер-пак у подарунок! 🦖',
      cta: 'LEARN_MORE',
    },
    {
      id: 'gemini-sugg-3',
      targetAudience: 'Retargeting - Added to Cart (Last 14 days)',
      headline: '🤔 Забули щось у кошику?',
      primaryText: 'Ваші улюблені сорти чаю сумують за вами! Завершіть замовлення сьогодні та отримайте безкоштовну доставку. Не пропустіть свій заряд бадьорості. 🚀',
      cta: 'SHOP_NOW',
    },
  ];
}

export default async function OrchestratorPage() {
  const aiSuggestions = await getAiCampaignSuggestions();

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center mb-6">
        <Globe className="h-8 w-8 mr-3 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Оркестратор Рекламних Кампаній</h1>
          <p className="text-muted-foreground">Керування всіма рекламними конекторами з єдиного центру.</p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Cpu className="h-6 w-6 mr-2 text-indigo-500" />
          Пульт Керування Виробництвом
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ContentProductionPanel />
          <PhysicalProductionPanel />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BotMessageSquare className="h-6 w-6 mr-2 text-purple-500" />
          Пропозиції від AI для Meta (Facebook & Instagram)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {aiSuggestions.map((suggestion) => (
            <MetaCampaignCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Users className="h-6 w-6 mr-2 text-indigo-500" />
          Моніторинг екосистеми "Герой Району"
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AmbassadorFunnel />
        </div>
      </section>

      {/* Тут можна додати секції для Google Ads, TikTok і т.д. */}
    </div>
  );
}

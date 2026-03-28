import React from 'react';
import Head from 'next/head';
import { ScrollytellingWrapper } from '../components/scrollytelling/ScrollytellingWrapper';
import { BiometricPulse } from '../components/scrollytelling/BiometricPulse';
import { LiveMathB2B } from '../components/scrollytelling/LiveMathB2B';
import { SugarRushTrigger } from '../components/scrollytelling/SugarRushTrigger';
import { WebGLXRay } from '../components/scrollytelling/WebGLXRay';

// Import newly created packs
import { MatrixDecodeText, DeepWorkMode, ReverseTimerTask, FocusTunnel } from '../components/scrollytelling/BoosterTeaMotions';
import { FrostOverlay, LiquidHoverDrips, ExpertContext, NeonCocktailMixer } from '../components/scrollytelling/FunnyDropsMotions';
import { SlushCannonGame, BouncyGelText, WebARPreviewMock } from '../components/scrollytelling/DinoSlushMotions';
import { ThermoSliderEnv, HapticPump, QuantumParticleFlow } from '../components/scrollytelling/TLabMotions';

export default function SandboxStressTest() {
  return (
    <ScrollytellingWrapper vibeTone="dark">
      <Head>
        <title>MEGA STRESS TEST - GENERATIVE MEDIA ENGINE</title>
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-32 space-y-40">
        
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">System<br/><span className="text-[var(--accent)]">Stress Test</span></h1>
          <p className="text-xl text-zinc-400 font-mono">16+ Scrollytelling Mechanics across 4 Brands</p>
        </div>

        {/* ========================================================= */}
        {/* BOOSTERTEA PACK */}
        <section className="space-y-16">
          <div className="border-b-2 border-green-500 pb-4 mb-12">
            <h2 className="text-4xl font-black text-green-500 uppercase tracking-widest">Brand: BoosterTea</h2>
            <p className="text-zinc-500 font-mono">Vibe: Biohacking, Matrix, Focus</p>
          </div>
          
          <BiometricPulse 
            triggerWords={["стрес", "ритм"]} 
            resolveWords={["фокус"]} 
            content="Сучасний ритм випалює твої ресурси. Час зупинити стрес. Перехід у стан абсолютного фокусу можливий завдяки правильній екстракції L-теаніну."
          />
          <DeepWorkMode />
          <ReverseTimerTask />
          <FocusTunnel />
          <p className="text-2xl text-white font-mono text-center">
            You are reading <MatrixDecodeText text="THE TRUTH ABOUT ENERGY" /> and your brain is optimizing.
          </p>
        </section>

        {/* ========================================================= */}
        {/* FUNNYDROPS PACK */}
        <section className="space-y-16">
          <div className="border-b-2 border-yellow-500 pb-4 mb-12">
            <h2 className="text-4xl font-black text-yellow-500 uppercase tracking-widest">Brand: FunnyDrops</h2>
            <p className="text-zinc-500 font-mono">Vibe: Neon, Liquid, Horeca B2B</p>
          </div>

          <LiveMathB2B 
            initialValue={50} step={10} min={10} max={500} multiplier={500} 
            textBefore="Якщо ваш заклад робить" textAfter="коктейлів на добу, ви витрачаєте" 
          />
          <FrostOverlay />
          <div className="grid md:grid-cols-2 gap-8">
            <LiquidHoverDrips title="Neon Mango" />
            <LiquidHoverDrips title="Acid Cherry" />
          </div>
          <NeonCocktailMixer />
          <p className="text-2xl text-white text-center p-12 glass rounded-2xl">
            Дізнайтеся більше про <ExpertContext text="холодну екстракцію" tooltip="Це метод заварювання льодяною водою протягом 12 годин для усунення гіркоти." /> для ваших напоїв.
          </p>
        </section>

        {/* ========================================================= */}
        {/* DINOSLUSH PACK */}
        <section className="space-y-16">
          <div className="border-b-2 border-pink-500 pb-4 mb-12">
            <h2 className="text-4xl font-black text-pink-500 uppercase tracking-widest">Brand: DinoSlush</h2>
            <p className="text-zinc-500 font-mono">Vibe: Arcade, Rave, TikTok</p>
          </div>

          <BouncyGelText text="DINO VIBES" />
          <SlushCannonGame />
          <SugarRushTrigger />
          <WebARPreviewMock />
        </section>

        {/* ========================================================= */}
        {/* T-LAB PACK */}
        <section className="space-y-16">
          <div className="border-b-2 border-blue-500 pb-4 mb-12">
            <h2 className="text-4xl font-black text-blue-500 uppercase tracking-widest">Brand: T-Lab</h2>
            <p className="text-zinc-500 font-mono">Vibe: Alchemical, Industrial, Apple-like</p>
          </div>

          <WebGLXRay />
          <ThermoSliderEnv />
          <HapticPump />
          <QuantumParticleFlow />
        </section>

      </main>
    </ScrollytellingWrapper>
  );
}

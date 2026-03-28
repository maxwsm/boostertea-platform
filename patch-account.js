const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'apps/boostertea-web/src/web/pages/account.tsx');
let txt = fs.readFileSync(filePath, 'utf8');

const journeyStart = `{activeTab === 'journey' && (`
const referralStart = `{activeTab === 'referral' && (`
const b2bStart = `{activeTab === 'b2b-hunter' && (`
const closingTags = `            </AnimatePresence>`

const journeyReplacement = `{activeTab === 'journey' && (
                <motion.div key="journey" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                  {/* Hero Gamification Banner */}
                  <div className="bg-[url('/path-bg-placeholder.jpg')] bg-cover relative p-6 md:p-8 rounded-[2rem] border border-[var(--border)] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-tertiary)]/90 to-transparent"></div>
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_60%)] opacity-20 mix-blend-screen animate-pulse"></div>
                    
                    <div className="relative z-10 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-lg border border-black/10 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <Star className="w-3 h-3 text-[var(--accent)]" /> {statusName}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-primary)]/50">
                        Еволюція Енергії
                      </h3>
                      <p className="text-[var(--text-secondary)] mb-6 leading-relaxed text-sm md:text-base">
                        Твій енергетичний потенціал зростає! До переходу в {user.totalLiters < 5 ? 'Tea Lover' : user.totalLiters < 15 ? 'Energy Master' : 'Grand Master'} залишилось {(nextStatusGoal - user.totalLiters).toFixed(1)} літрів чистого ПУЕРУ.
                      </p>
                      
                      <div className="relative">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-[var(--text-subtle)] mb-2 tracking-widest">
                          <span>{Math.round(user.totalLiters * 10)} чашок випито</span>
                          <span>Еволюція: {nextStatusGoal * 10} чашок</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-[#111] h-4 rounded-full overflow-hidden p-[2px] shadow-inner border border-black/5 dark:border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: \`\${progress}%\` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[var(--accent)] to-[#C9A962] rounded-full relative">
                            <div className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-white/40 to-transparent"></div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fun Analytics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass p-4 md:p-5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-[#7FB030]/20 text-[#7FB030] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><TrendingUp className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">{Math.round(user.totalLiters * 10)}</p>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-1">Випито Чашок</p>
                    </div>
                    <div className="glass p-4 md:p-5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Wallet className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">{Math.round(user.totalLiters * 10 * 75)}₴</p>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-1">Зекономлено</p>
                    </div>
                    <div className="glass p-4 md:p-5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Zap className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">{Math.round(user.totalLiters * 10 * 4)}</p>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-1">Годин Енергії</p>
                    </div>
                    <div className="glass p-4 md:p-5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><MapPin className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">{Math.round(user.totalLiters * 1.5)}<span className="text-sm">км</span></p>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-1">Довжина посилок</p>
                    </div>
                  </div>

                  {/* Health Progress Bars & Easter Egg Grid */}
                  <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 glass p-6 rounded-3xl border-black/5 dark:border-white/5 shadow-lg flex flex-col justify-center">
                       <h4 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> Біохакінг Організму</h4>
                       <div className="space-y-6">
                         <div>
                           <div className="flex justify-between text-xs font-bold mb-2">
                             <span className="text-[var(--text-secondary)]">Збережене Серце (vs Кава)</span>
                             <span className="text-red-500">{(user.totalLiters * 10 * 12).toFixed(0)} ударів/хв</span>
                           </div>
                           <div className="h-2 w-full bg-gray-200 dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                             <div className="h-full bg-red-500 w-[75%] rounded-full opacity-80 mix-blend-screen"></div>
                           </div>
                         </div>
                         <div>
                           <div className="flex justify-between text-xs font-bold mb-2">
                             <span className="text-[var(--text-secondary)]">Профілактика Діабету (vs Енергетики)</span>
                             <span className="text-blue-500">{Math.round(user.totalLiters * 10 * 27)}г цукру уникнуто</span>
                           </div>
                           <div className="h-2 w-full bg-gray-200 dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500 w-[90%] rounded-full opacity-80 mix-blend-screen"></div>
                           </div>
                         </div>
                         <div>
                           <div className="flex justify-between text-xs font-bold mb-2">
                             <span className="text-[var(--text-secondary)]">Метаболізм & Травлення</span>
                             <span className="text-green-500">+{Math.round(user.totalLiters * 1.2)}% прискорення</span>
                           </div>
                           <div className="h-2 w-full bg-gray-200 dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 w-[60%] rounded-full opacity-80 mix-blend-screen"></div>
                           </div>
                         </div>
                       </div>
                    </div>

                    <div className="lg:col-span-2 glass p-6 rounded-3xl border-black/5 dark:border-white/5 shadow-lg relative overflow-hidden flex flex-col justify-center items-center text-center group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--tea-gold)]/5 to-transparent"></div>
                      <div className="w-24 h-24 perspective-[1000px] group-hover:scale-110 transition-transform duration-500 mb-6 relative z-10">
                        <div className="w-full h-full bg-[var(--accent)] rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_40px_rgba(107,142,78,0.4)] border-2 border-[var(--tea-gold)]/40 animate-[spin_10s_linear_infinite]">
                          <div className="-rotate-45 font-black text-3xl text-black">?</div>
                        </div>
                      </div>
                      <h4 className="font-bold text-lg mb-1 relative z-10 text-[var(--accent)] drop-shadow-lg">Секретний Дроп</h4>
                      <p className="text-[10px] text-[var(--text-primary)]/80 max-w-[200px] relative z-10 uppercase tracking-widest font-bold">Тисни для активації 3D голограми та секретних пасхалок</p>
                      
                      {/* Hidden interactive egg background */}
                      <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-[var(--tea-gold)]/20 to-transparent group-hover:h-full transition-all duration-300"></div>
                    </div>
                  </div>
                </motion.div>
              )}
`;

const b2bReplacement = `{activeTab === 'b2b-hunter' && (
                <motion.div key="b2b-hunter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  {/* Hero C2B2B Banner */}
                  <div className="bg-[url('/path-bg-placeholder.jpg')] bg-cover relative p-6 md:p-8 rounded-[2rem] border border-[var(--border)] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-tertiary)]/90 to-transparent"></div>
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_60%)] opacity-20 mix-blend-screen animate-pulse"></div>
                    
                    <div className="relative z-10 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-lg border border-red-500/30 text-[10px] font-bold uppercase tracking-widest mb-4 text-red-500">
                        <Target className="w-3 h-3" /> C2B2B Hunt
                      </div>
                      <h3 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-black dark:text-white uppercase leading-tight">
                        Здай Свою Кав'ярню <br/><span className="text-[var(--accent)] font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#7FB030]">Отримай Чай</span>
                      </h3>
                      <p className="text-gray-600 dark:text-zinc-400 mb-6 leading-relaxed text-sm md:text-base">
                        Кав'ярня на твоєму районі досі готує хімозні чаї? Здай нам їх назву та місто. Ми підключимо їх до Синдикату, а ти отримаєш фіксований <strong className="text-black dark:text-white font-bold bg-[var(--accent)]/20 px-2 py-0.5 rounded">+500₴ бонус</strong> на баланс за кожну успішну 1L інтеграцію.
                      </p>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <div className="glass p-8 rounded-3xl border border-red-500/10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px]"></div>
                    <form onSubmit={handleB2bSubmit} className="space-y-5 relative z-10">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-3 bg-gray-200 dark:bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 group-focus-within:text-red-500 transition-colors z-10 rounded">Назва Кав'ярні *</label>
                          <input type="text" required value={b2bForm.cafeName} onChange={e => setB2bForm({...b2bForm, cafeName: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-[var(--bg-primary)] transition-all font-medium text-sm" />
                        </div>
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-3 bg-gray-200 dark:bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 group-focus-within:text-red-500 transition-colors z-10 rounded">Місто</label>
                          <input type="text" value={b2bForm.city} onChange={e => setB2bForm({...b2bForm, city: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-[var(--bg-primary)] transition-all font-medium text-sm" />
                        </div>
                      </div>

                      <div className="relative group">
                        <label className="absolute -top-2.5 left-3 bg-gray-200 dark:bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 group-focus-within:text-red-500 transition-colors z-10 rounded">Адреса або Instagram</label>
                        <input type="text" value={b2bForm.address} onChange={e => setB2bForm({...b2bForm, address: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-[var(--bg-primary)] transition-all font-medium text-sm" />
                      </div>

                      <div className="relative group">
                        <label className="absolute -top-2.5 left-3 bg-gray-200 dark:bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 group-focus-within:text-red-500 transition-colors z-10 rounded">Коментар</label>
                        <textarea rows={3} value={b2bForm.notes} onChange={e => setB2bForm({...b2bForm, notes: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-[var(--bg-primary)] transition-all resize-none font-medium text-sm"></textarea>
                      </div>

                      <div className="pt-2">
                        <button disabled={isB2bSubmitting} type="submit" className="w-full bg-red-500/10 hover:bg-red-500/20 hover:border-red-500 border border-red-500/50 disabled:opacity-50 text-red-500 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 mt-4">
                          <Target className="w-4 h-4" />
                          {isB2bSubmitting ? 'Передача...' : 'Передати координати у Штаб'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
`;

const iJourneyStart = txt.indexOf(journeyStart);
const iReferralStart = txt.indexOf(referralStart);
txt = txt.substring(0, iJourneyStart) + journeyReplacement + '\n' + txt.substring(iReferralStart);

const iB2bStart = txt.indexOf(b2bStart);
const iClosingTags = txt.indexOf(closingTags, iB2bStart);
txt = txt.substring(0, iB2bStart) + b2bReplacement + '\n' + txt.substring(iClosingTags);

fs.writeFileSync(filePath, txt);
console.log('Patched account.tsx successfully');

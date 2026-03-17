import React, { useEffect } from 'react';

const CystEvit: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="bg-slate-50 dark:bg-slate-900/50 pt-8 pb-16">
                <div className="px-6 lg:px-20 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Image Stack */}
                        <div className="relative h-[500px] w-full isolate">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform -rotate-3 z-0"></div>
                            <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden z-10 p-8 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                <img className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" alt="Cyst Evit product box and tablets" src="https://placehold.co/600x600/f8f6f6/ec5b13?text=Cyst+Evit" />
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Female Wellness</span>
                                </div>
                            </div>
                        </div>

                        {/* Context & Actions */}
                        <div className="flex flex-col gap-8">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-primary font-bold uppercase tracking-widest text-sm">Therapeutics</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                    <span className="text-slate-500 text-sm">Ayurvedic Formulation</span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Cyst Evit</h1>
                                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    Natural support for managing PCOS/PCOD and maintaining female reproductive health.
                                </p>
                            </div>

                            <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white">$29.99</span>
                                    <span className="text-sm text-amber-600 font-bold">In Stock</span>
                                </div>
                                <div className="h-12 w-px bg-slate-200 dark:border-slate-700"></div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex text-amber-400">
                                        <span className="material-symbols-outlined fill-1">star</span>
                                        <span className="material-symbols-outlined fill-1">star</span>
                                        <span className="material-symbols-outlined fill-1">star</span>
                                        <span className="material-symbols-outlined fill-1">star</span>
                                        <span className="material-symbols-outlined fill-1">star</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">4.9/5 from 85 reviews</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 w-32 shrink-0">
                                        <button className="flex-1 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">remove</span></button>
                                        <div className="flex-1 flex items-center justify-center font-bold text-slate-900 dark:text-white">1</div>
                                        <button className="flex-1 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">add</span></button>
                                    </div>
                                    <button className="flex-1 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">shopping_bag</span>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1.5 border border-primary/20">local_shipping</span>
                                    <span className="text-sm font-medium">Free Shipping over $50</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1.5 border border-primary/20">verified_user</span>
                                    <span className="text-sm font-medium">Verified Authentic</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Highlights / Tabs Section */}
            <div className="px-6 lg:px-20 py-16 max-w-7xl mx-auto">
                {/* Navigation Tabs (Visual Only for Layout) */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-10 overflow-x-auto whitespace-nowrap hide-scrollbar">
                    <button className="px-8 py-4 text-primary border-b-2 border-primary font-bold text-lg">Overview</button>
                    <button className="px-8 py-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium text-lg transition-colors">Key Ingredients</button>
                    <button className="px-8 py-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium text-lg transition-colors">How to Use</button>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">About Cyst Evit</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                Cyst Evit is a meticulously researched Ayurvedic formulation aimed at addressing the root causes of Polycystic Ovary Syndrome (PCOS) and Polycystic Ovary Disease (PCOD). It works harmoniously with the female body to normalize hormonal levels, regulate menstrual cycles, and support healthy ovarian function.
                            </p>
                        </section>

                        <section className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">health_and_safety</span> Primary Benefits
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <span className="shrink-0 size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mt-1">1</span>
                                    <div>
                                        <strong className="block text-slate-900 dark:text-white mb-1">Hormonal Balance</strong>
                                        <span className="text-slate-600 dark:text-slate-400">Helps in regulating estrogen and progesterone levels naturally.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="shrink-0 size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mt-1">2</span>
                                    <div>
                                        <strong className="block text-slate-900 dark:text-white mb-1">Cycle Regulation</strong>
                                        <span className="text-slate-600 dark:text-slate-400">Promotes timely and healthy menstrual cycles without synthetic hormones.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="shrink-0 size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mt-1">3</span>
                                    <div>
                                        <strong className="block text-slate-900 dark:text-white mb-1">Ovarian Health</strong>
                                        <span className="text-slate-600 dark:text-slate-400">Supports the reduction of ovarian cyst size and prevents new formations.</span>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
                                <span className="material-symbols-outlined">medication_liquid</span> Dosage
                            </h3>
                            <div className="relative z-10">
                                <p className="text-3xl font-black mb-2">2 Tablets</p>
                                <p className="text-white/80 font-medium">Twice a day</p>
                                <div className="mt-4 pt-4 border-t border-white/20">
                                    <p className="text-sm text-white/90">Take after meals with water. Best results observed with continuous use for 3-6 months.</p>
                                </div>
                            </div>
                        </div>

                        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-white dark:bg-slate-900">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Core Ingredients</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Kanchanar Guggulu</span>
                                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Shatavari</span>
                                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Ashoka</span>
                                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Lodhra</span>
                                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CystEvit;

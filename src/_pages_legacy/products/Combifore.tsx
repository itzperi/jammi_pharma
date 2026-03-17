import React, { useEffect } from 'react';

const Combifore: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 flex flex-col gap-16">

                {/* Main Product Area */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* Images */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden relative group border border-slate-200 dark:border-slate-800">
                            <img className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110" alt="Combifore PDP Ayurvedic supplement bottle" src="https://placehold.co/800x600/f8f6f6/ec5b13?text=Combifore" />
                            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="absolute top-6 left-6">
                                <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold px-4 py-2 rounded-full tracking-widest uppercase">Premium Care</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border-2 border-primary cursor-pointer">
                                <img className="w-full h-full object-cover" alt="Combifore bottle front" src="https://placehold.co/400x400/f8f6f6/ec5b13?text=Combifore" />
                            </div>
                            <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors">
                                <img className="w-full h-full object-cover" alt="Combifore ingredients" src="https://placehold.co/400x400/f8f6f6/ec5b13?text=Combifore" />
                            </div>
                            <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-center p-6">
                                <span className="material-symbols-outlined text-6xl text-slate-400">play_circle</span>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <div className="mb-6">
                            <p className="text-primary font-bold tracking-widest text-sm uppercase mb-3 flex items-center gap-2">
                                <span className="w-8 h-px bg-primary"></span> Therapeutics
                            </p>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Combifore (PDP)</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-amber-500 fill-1 text-sm">star</span>
                                    <span className="font-bold text-amber-700 dark:text-amber-400 text-sm ml-1">4.6</span>
                                </div>
                                <a href="#reviews" className="text-slate-500 hover:text-primary underline text-sm font-medium transition-colors">Read 54 Reviews</a>
                            </div>
                        </div>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                            A specialized dual-action formulation representing a breakthrough in Ayurvedic care. Combifore (PDP) provides targeted support for complex physiological imbalances, ensuring vitality and restorative health.
                        </p>

                        <div className="flex items-end gap-6 mb-10 pb-10 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <p className="text-sm text-slate-500 line-through mb-1">$55.00</p>
                                <p className="text-5xl font-black text-slate-900 dark:text-white">$42.50</p>
                            </div>
                            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 h-fit mb-2 border border-amber-200 dark:border-amber-800/50">
                                <span className="material-symbols-outlined text-sm">sell</span> Save 22%
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 w-full sm:w-40 bg-white dark:bg-slate-900">
                                <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">remove</span></button>
                                <span className="font-bold text-xl">1</span>
                                <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">add</span></button>
                            </div>
                            <button className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex justify-center items-center gap-3 text-lg">
                                <span className="material-symbols-outlined">shopping_cart_checkout</span>
                                Add to Cart
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm text-slate-600 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">science</span> Formulated by Experts
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">verified</span> 100% Authentic
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">local_shipping</span> Fast Delivery
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">lock</span> Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-slate-100 dark:border-slate-700">
                            <span className="material-symbols-outlined text-3xl text-primary">psychiatry</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Mechanism</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Functions by modulating cellular responses and promoting natural detoxification pathways, leading to restored systemic balance.
                        </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-slate-100 dark:border-slate-700">
                            <span className="material-symbols-outlined text-3xl text-primary">prescriptions</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Indications</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Recommended for chronic conditions requiring supportive therapy, immune regulation, and general restorative care.
                        </p>
                    </div>

                    <div className="bg-primary rounded-3xl p-10 text-white relative overflow-hidden shadow-xl shadow-primary/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center mb-6 relative z-10 border border-white/30">
                            <span className="material-symbols-outlined text-3xl text-white">medication</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 relative z-10 text-white">Administration</h3>
                        <ul className="space-y-3 relative z-10 text-white/90">
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm mt-1">check_circle</span>
                                <span>Adults: 1-2 capsules twice daily</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm mt-1">check_circle</span>
                                <span>Take with milk or warm water</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm mt-1">check_circle</span>
                                <span>Strict dietary regimen recommended</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Combifore;

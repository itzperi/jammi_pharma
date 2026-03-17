import React, { useEffect } from 'react';

const AACaps: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 md:px-10">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="w-full">
                    <div className="relative group aspect-square rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <img className="w-full h-full object-contain p-4" alt="Jammi's AA Caps product box and blister pack" src="https://placehold.co/600x600/f8f6f6/ec5b13?text=AA+Caps" />
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Top Rated</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-primary">
                            <img className="w-full h-full object-cover" alt="Close up of AA Caps capsules" src="https://placehold.co/600x600/f8f6f6/ec5b13?text=AA+Caps" />
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">medication</span>
                            </div>
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">eco</span>
                            </div>
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">science</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-6">
                    <div>
                        <span className="text-primary font-semibold tracking-wide text-sm uppercase">Wellness / Therapeutics</span>
                        <h1 className="text-slate-900 dark:text-slate-100 text-4xl md:text-5xl font-black leading-tight tracking-tight mt-2">AA Caps (Breathe Easy)</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mt-2">By Jammi Pharmaceuticals</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-primary">
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined">star_half</span>
                                <span className="text-slate-900 dark:text-slate-100 font-bold ml-2">4.8</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Based on 128 verified reviews</p>
                        </div>
                        <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">$24.99</p>
                            <p className="text-xs text-amber-600 font-medium">In Stock &amp; Ready to Ship</p>
                        </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                        AA Caps is a scientifically formulated therapeutic supplement designed to relieve respiratory tract disorders. Crafted with potent Ayurvedic herbs, it helps clear congestion and promotes effortless breathing.
                    </p>
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 justify-between">
                                <button className="text-primary hover:bg-primary/10 rounded-lg p-1 transition-colors"><span className="material-symbols-outlined">remove</span></button>
                                <span className="font-bold">1</span>
                                <button className="text-primary hover:bg-primary/10 rounded-lg p-1 transition-colors"><span className="material-symbols-outlined">add</span></button>
                            </div>
                            <button className="flex-2 bg-primary text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full md:w-auto">
                                <span className="material-symbols-outlined">shopping_bag</span>
                                Add to Cart
                            </button>
                        </div>
                        <button className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:opacity-90 transition-opacity">
                            Buy it now
                        </button>
                    </div>

                    {/* Key Benefits */}
                    <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-8">
                        <h3 className="text-xl font-bold mb-4">Key Benefits</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">air</span>
                                <div>
                                    <p className="font-bold text-sm">Respiratory Relief</p>
                                    <p className="text-xs text-slate-500">Helps in clearing the respiratory tract.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">shield</span>
                                <div>
                                    <p className="font-bold text-sm">Immune Support</p>
                                    <p className="text-xs text-slate-500">Strengthens natural defense mechanisms.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">spa</span>
                                <div>
                                    <p className="font-bold text-sm">100% Herbal</p>
                                    <p className="text-xs text-slate-500">No synthetic additives or chemicals.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">verified</span>
                                <div>
                                    <p className="font-bold text-sm">Fast Acting</p>
                                    <p className="text-xs text-slate-500">Quick absorption for faster relief.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Details Tabs Style Sections */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Ingredients */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">eco</span> Ingredients
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex flex-col pb-4 border-b border-slate-100 dark:border-slate-700">
                            <span className="font-bold text-lg text-primary">Vasa</span>
                            <span className="text-slate-500 text-sm italic">Adhatoda vasica</span>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Known for its potent anti-inflammatory and bronchodilatory properties.</p>
                        </li>
                        <li className="flex flex-col pb-4 border-b border-slate-100 dark:border-slate-700">
                            <span className="font-bold text-lg text-primary">Tulsi</span>
                            <span className="text-slate-500 text-sm italic">Ocimum sanctum</span>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Holy Basil, an adaptogen that boosts immunity and clears mucus.</p>
                        </li>
                        <li className="flex flex-col">
                            <span className="font-bold text-lg text-primary">Yashtimadhu</span>
                            <span className="text-slate-500 text-sm italic">Glycyrrhiza glabra</span>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Licorice root that soothes the throat and eases irritation.</p>
                        </li>
                    </ul>
                </div>

                {/* How to Use */}
                <div className="bg-primary text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">schedule</span> How to Use
                        </h3>
                        <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30">
                            <div className="text-5xl font-black mb-2">1 <span className="text-xl">Capsule</span></div>
                            <p className="text-lg font-medium">Twice Daily</p>
                            <p className="mt-4 text-white/80 text-sm leading-relaxed">
                                For best results, take one capsule in the morning and one in the evening after meals with lukewarm water.
                            </p>
                        </div>
                        <div className="mt-8 flex items-start gap-3 text-sm bg-black/10 p-4 rounded-lg">
                            <span className="material-symbols-outlined text-white">info</span>
                            <p>Consult your healthcare provider if you are pregnant, nursing, or taking other medications.</p>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 opacity-10">
                        <span className="material-symbols-outlined text-[200px]">medication</span>
                    </div>
                </div>

                {/* Reviews Summary */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">reviews</span> Reviews
                    </h3>
                    <div className="flex items-center gap-4 mb-8">
                        <p className="text-5xl font-black text-slate-900 dark:text-slate-100">4.8</p>
                        <div>
                            <div className="flex text-primary">
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined fill-1">star</span>
                            </div>
                            <p className="text-slate-500 text-xs">Based on 128 reviews</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-[20px_1fr_40px] items-center gap-3">
                            <p className="text-sm font-bold">5</p>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                <div className="h-full bg-primary rounded-full" style={{ width: '80%' }}></div>
                            </div>
                            <p className="text-slate-500 text-xs text-right">80%</p>
                        </div>
                        <div className="grid grid-cols-[20px_1fr_40px] items-center gap-3">
                            <p className="text-sm font-bold">4</p>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                <div className="h-full bg-primary rounded-full" style={{ width: '12%' }}></div>
                            </div>
                            <p className="text-slate-500 text-xs text-right">12%</p>
                        </div>
                        <div className="grid grid-cols-[20px_1fr_40px] items-center gap-3">
                            <p className="text-sm font-bold">3</p>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                <div className="h-full bg-primary rounded-full" style={{ width: '5%' }}></div>
                            </div>
                            <p className="text-slate-500 text-xs text-right">5%</p>
                        </div>
                        <div className="grid grid-cols-[20px_1fr_40px] items-center gap-3">
                            <p className="text-sm font-bold">2</p>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                <div className="h-full bg-primary rounded-full" style={{ width: '2%' }}></div>
                            </div>
                            <p className="text-slate-500 text-xs text-right">2%</p>
                        </div>
                        <div className="grid grid-cols-[20px_1fr_40px] items-center gap-3">
                            <p className="text-sm font-bold">1</p>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                <div className="h-full bg-primary rounded-full" style={{ width: '1%' }}></div>
                            </div>
                            <p className="text-slate-500 text-xs text-right">1%</p>
                        </div>
                    </div>
                    <button className="w-full mt-8 border border-slate-200 dark:border-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Read all reviews
                    </button>
                </div>
            </div>

            {/* Individual Review Snippet */}
            <div className="mt-12 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">JD</div>
                        <div>
                            <p className="font-bold">John Doe</p>
                            <p className="text-xs text-slate-500">Verified Buyer • 2 weeks ago</p>
                        </div>
                    </div>
                    <div className="flex text-primary">
                        <span className="material-symbols-outlined fill-1 text-sm">star</span>
                        <span className="material-symbols-outlined fill-1 text-sm">star</span>
                        <span className="material-symbols-outlined fill-1 text-sm">star</span>
                        <span className="material-symbols-outlined fill-1 text-sm">star</span>
                        <span className="material-symbols-outlined fill-1 text-sm">star</span>
                    </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400">"I've been using AA Caps for my seasonal allergies and persistent cough. Within a week, I noticed a significant difference in my breathing clarity. It's much easier to breathe during my morning runs now!"</p>
            </div>

        </div>
    );
};

export default AACaps;

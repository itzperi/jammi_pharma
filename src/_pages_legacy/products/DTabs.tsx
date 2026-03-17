import React, { useEffect } from 'react';

const DTabs: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="px-6 md:px-20 lg:px-40 py-10 max-w-[1440px] mx-auto w-full">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="@container">
                    <div className="overflow-hidden rounded-3xl bg-primary/5 aspect-square flex items-center justify-center">
                        <img className="w-full h-full object-cover" alt="Bottle of D'Tabs herbal anti-diarrheal supplements" src="https://placehold.co/600x600/f8f6f6/ec5b13?text=DTabs" />
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Wellness</span>
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Therapeutics</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-slate-100">D'Tabs (Anti-Diarrheal)</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            Fast-acting, natural relief for digestive wellness. Formulated by Jammi Pharmaceuticals to restore balance effectively and gently.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-primary">$24.99</span>
                        <div className="flex items-center text-amber-500">
                            <span className="material-symbols-outlined fill-1">star</span>
                            <span className="material-symbols-outlined fill-1">star</span>
                            <span className="material-symbols-outlined fill-1">star</span>
                            <span className="material-symbols-outlined fill-1">star</span>
                            <span className="material-symbols-outlined">star_half</span>
                            <span className="ml-2 text-slate-500 text-sm">(128 reviews)</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 py-6 border-y border-primary/10">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                            <span className="text-slate-700 dark:text-slate-300">Quickly controls loose motions</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                            <span className="text-slate-700 dark:text-slate-300">Reduces abdominal discomfort</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                            <span className="text-slate-700 dark:text-slate-300">100% Ayurvedic botanical formula</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex-1 bg-primary text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            Add to Cart
                        </button>
                        <button className="px-4 py-4 rounded-xl border border-primary/20 text-primary hover:bg-primary/5 transition-colors">
                            <span className="material-symbols-outlined">favorite</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Key Benefits & Ingredients */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">vital_signs</span>
                        Key Benefits
                    </h2>
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-primary/5 shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Rapid Relief</h3>
                            <p className="text-slate-600 dark:text-slate-400">Specially formulated to address acute diarrhea and gastrointestinal distress within hours.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-primary/5 shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Gut Microbiome Support</h3>
                            <p className="text-slate-600 dark:text-slate-400">Unlike harsh synthetics, D'Tabs works with your body's natural flora to restore digestive harmony.</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">eco</span>
                        Key Ingredients
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-primary/5">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-primary">potted_plant</span>
                            </div>
                            <span className="font-bold text-sm">Kutaj</span>
                            <span className="text-xs text-slate-500 mt-1">Holarrhena antidysenterica</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-primary/5">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-primary">potted_plant</span>
                            </div>
                            <span className="font-bold text-sm">Bilva</span>
                            <span className="text-xs text-slate-500 mt-1">Bael Fruit</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-primary/5">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-primary">potted_plant</span>
                            </div>
                            <span className="font-bold text-sm">Musta</span>
                            <span className="text-xs text-slate-500 mt-1">Nut Grass</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* How to Use Section */}
            <div className="mt-20 p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        How to Use
                    </h2>
                    <p className="text-slate-300 text-lg">
                        Take <span className="text-primary font-bold">1-2 tablets</span> as needed with lukewarm water. Do not exceed 6 tablets in a 24-hour period unless directed by a physician.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
                        <div>
                            <p className="text-xs uppercase text-slate-400">Frequency</p>
                            <p className="font-bold">Every 4-6 hours</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-20">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold">Customer Reviews</h2>
                    <button className="text-primary font-bold hover:underline">Write a review</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-primary/5">
                        <div className="flex items-center gap-1 text-amber-500 mb-2">
                            <span className="material-symbols-outlined fill-1 text-sm">star</span>
                            <span className="material-symbols-outlined fill-1 text-sm">star</span>
                            <span className="material-symbols-outlined fill-1 text-sm">star</span>
                            <span className="material-symbols-outlined fill-1 text-sm">star</span>
                            <span className="material-symbols-outlined fill-1 text-sm">star</span>
                        </div>
                        <p className="font-bold mb-2 text-slate-900 dark:text-slate-100">Life saver during travels!</p>
                        <p className="text-slate-600 dark:text-slate-400 italic mb-4">"I never go on vacation without D'Tabs. It works quickly and doesn't cause constipation like other brands."</p>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">AM</div>
                            <span className="text-sm font-medium">Ananya M.</span>
                            <span className="material-symbols-outlined text-primary text-xs">verified</span>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-primary/5">
                        <div className="flex items-center gap-1 text-amber-500 mb-2">
                            <span className="material-symbols-outlined fill-1 text-sm">star</span>
                            <span className="material-symbols-outlined fill-1 text-sm">star</span>
                            <span className="material-symbols-outlined fill-1 text-sm">star</span>
                            <span className="material-symbols-outlined fill-1 text-sm">star</span>
                            <span className="material-symbols-outlined text-sm">star</span>
                        </div>
                        <p className="font-bold mb-2 text-slate-900 dark:text-slate-100">Gentle and effective</p>
                        <p className="text-slate-600 dark:text-slate-400 italic mb-4">"Great natural alternative. My stomach feels much better using this herbal formula."</p>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">RK</div>
                            <span className="text-sm font-medium">Raj K.</span>
                            <span className="material-symbols-outlined text-primary text-xs">verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DTabs;

import React, { useEffect } from 'react';

const GTPMentalFitness: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="px-6 lg:px-20 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800 shadow-2xl group">
                        <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Premium glass bottle of GTP mental fitness capsules" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBTnEDHyB9yQwgED_IPe-OJCRz5hqBedDCGTtvsAoFX_vxzN7DGSxh8DuwJsg-Ajo8no8jdnLDUq6NXYDw3W2JrUh_q531tJgMae8ccD5rsVbl6vNgXrg-4g9hDNUw0qSmWjzQq3R6PWXaXSVPMbNbLWlLqGmAfWtfNFAu7ZJf3gz3x2mecWDWq_g7ykpgqQfwQNVs_ZzYpOfs3AKgeveOiTDcgF271FDjODEUq89xxqxSsi7429v7KaseutiQfkjD_Nhnipp9jKs" />
                        <div className="absolute top-4 left-4">
                            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Best Seller</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-primary font-bold uppercase tracking-widest text-sm">Wellness / Therapeutics</span>
                            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-100">GTP Mental Fitness</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex text-amber-400">
                                    <span className="material-symbols-outlined">star</span>
                                    <span className="material-symbols-outlined">star</span>
                                    <span className="material-symbols-outlined">star</span>
                                    <span className="material-symbols-outlined">star</span>
                                    <span className="material-symbols-outlined">star_half</span>
                                </div>
                                <span className="text-sm font-medium text-slate-500">(128 reviews)</span>
                            </div>
                        </div>
                        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                            A specialized Ayurvedic formulation designed to harmonize neural pathways, enhance cognitive clarity, and fortify the mind against modern stressors.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-primary border border-primary/20">
                                <span className="material-symbols-outlined text-xl">psychology</span>
                                <span className="text-sm font-bold">Stress Reduction</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-primary border border-primary/20">
                                <span className="material-symbols-outlined text-xl">memory</span>
                                <span className="text-sm font-bold">Memory Enhancement</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-slate-500 text-sm line-through">$45.00</span>
                                <span className="text-3xl font-black text-slate-900 dark:text-slate-100">$34.99</span>
                            </div>
                            <button className="flex-1 lg:max-w-xs flex h-14 items-center justify-center rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Benefits Section */}
            <section className="bg-white dark:bg-background-dark/50 py-16 px-6 lg:px-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-10 text-center">Key Benefits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-4">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined !text-4xl">energy_savings_leaf</span>
                            </div>
                            <h3 className="text-xl font-bold">Neural Balance</h3>
                            <p className="text-slate-600 dark:text-slate-400">Restores the natural equilibrium of neurotransmitters to reduce anxiety.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-4">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined !text-4xl">speed</span>
                            </div>
                            <h3 className="text-xl font-bold">Cognitive Speed</h3>
                            <p className="text-slate-600 dark:text-slate-400">Enhances data processing speed and mental recall efficiency.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-4">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined !text-4xl">sleep</span>
                            </div>
                            <h3 className="text-xl font-bold">Cortisol Control</h3>
                            <p className="text-slate-600 dark:text-slate-400">Regulates stress hormone levels for better focus and restful sleep.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ingredients & How to Use */}
            <div className="px-6 lg:px-20 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Ingredients */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Pure Active Ingredients</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-6 p-6 rounded-2xl bg-white dark:bg-background-dark border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                    <img className="h-full w-full object-cover" alt="Brahmi herb close up" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPm0Y408PKJWWOIgUQ8ZHeRJA9hEvHCFIb28eEh-Lh4h9CjXzoft6TDkU38af95EF2ymgmzXtRlkMKmeDr6F7oS-77jyCTzgoT2SH8Nh8j18BU-gdj-NfeSiX2gDYF7yFUlm-C7qYof-rwTK6UCGqLCECU7O4IFaPgepkWShd4jA2ScBnU0Pk13ka5kd_4zxlkYqlYbTomnilQ55ar9VATbupFRBcxoecmuCkRFEdCr_Oa4oG7SQkVcU56b-_9UmBV8ysdg5w2BHU" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold">Brahmi (Bacopa Monnieri)</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Renowned brain tonic that sharpens memory and increases alertness.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 p-6 rounded-2xl bg-white dark:bg-background-dark border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                    <img className="h-full w-full object-cover" alt="Shankhapushpi herbal leaves" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-G9qIJo9Vf-q_Zsqh2YjcP7gutzJzIwvzfiYaVXrKExehlhja04ZYvbm-LGfuTbexWGtv3kPSZeEP8pCHt7-7IXd0J754DOWg1tJUrhnQs8PefdN4g3UxGy4_7Uh6ImxAqUGp2V6U_6IQpHs-MWBWIMCaEyacSUrj0so3uxrh2G97mej5cW46DNGFsdslTHzkuGv5ctEvinqN1wDNvmV-WwwQlWKxi18uG42S3QB7P0cQDhE7aJXwYAO8lG2JEXPoFjD-V3pZUzs" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold">Shankhapushpi</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Natural psychotropic that improves learning and mental capacity.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 p-6 rounded-2xl bg-white dark:bg-background-dark border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                    <img className="h-full w-full object-cover" alt="Jatamansi root extract" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEq8Gtx-uGXDgqjRZ9biR2kBDtP3LUnxWTnCVMX9OEhm6TprUw5b6GuKEc6UDDlhJrIp9YT_bInEURdfNEpcUGgTDxz3dqkUHbMkdP3VEg59e9pjDrBzNSEEbDYxNUA2H2JJtSSbjPa3BtUAIBdlRh8qXbK4JjVQXLchqZYSGle7sYe2JN_bP1ZOt8TYw9Ux1tzVcqwK_lNtENDKXb4uImAUznqaZffDwg17agV3Lc7AqKN7zmOBGIR6SLyshsAFfCYuKcHfW1smw" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold">Jatamansi</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Provides cooling effect and powerful antioxidant support for neurons.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage */}
                    <div className="flex flex-col justify-center">
                        <div className="rounded-3xl bg-primary p-10 text-white relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
                                <span className="material-symbols-outlined !text-[200px]">medical_services</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-6 relative z-10">How to Use</h2>
                            <div className="flex items-start gap-4 mb-8 relative z-10">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                    <span className="font-bold">1</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">Standard Dosage</h4>
                                    <p className="text-white/80 mt-1">Take 1-2 capsules twice daily with lukewarm water or milk after meals.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 mb-8 relative z-10">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                    <span className="font-bold">2</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">Consistency</h4>
                                    <p className="text-white/80 mt-1">For optimal mental fitness results, continue use for 3-4 months regularly.</p>
                                </div>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl border border-white/20 relative z-10">
                                <p className="text-sm italic flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">info</span>
                                    Consult your physician before use if pregnant or nursing.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <section className="bg-slate-100 dark:bg-background-dark py-16 px-6 lg:px-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold">Customer Reviews</h2>
                        <button className="text-primary font-bold hover:underline">Write a review</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-background-dark/50 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">AS</div>
                                    <div>
                                        <h5 className="font-bold">Ananya S.</h5>
                                        <span className="text-xs text-slate-500">Verified Buyer</span>
                                    </div>
                                </div>
                                <div className="flex text-amber-400 text-sm">
                                    <span className="material-symbols-outlined !text-lg">star</span>
                                    <span className="material-symbols-outlined !text-lg">star</span>
                                    <span className="material-symbols-outlined !text-lg">star</span>
                                    <span className="material-symbols-outlined !text-lg">star</span>
                                    <span className="material-symbols-outlined !text-lg">star</span>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">"Noticed a significant difference in my concentration levels within two weeks. My morning brain fog has almost vanished. Highly recommend for working professionals."</p>
                        </div>
                        <div className="bg-white dark:bg-background-dark/50 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">RM</div>
                                    <div>
                                        <h5 className="font-bold">Rahul M.</h5>
                                        <span className="text-xs text-slate-500">Verified Buyer</span>
                                    </div>
                                </div>
                                <div className="flex text-amber-400 text-sm">
                                    <span className="material-symbols-outlined !text-lg">star</span>
                                    <span className="material-symbols-outlined !text-lg">star</span>
                                    <span className="material-symbols-outlined !text-lg">star</span>
                                    <span className="material-symbols-outlined !text-lg">star</span>
                                    <span className="material-symbols-outlined !text-lg">star</span>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">"As a student preparing for competitive exams, GTP has been a game-changer. It keeps me calm during high-pressure study sessions."</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GTPMentalFitness;

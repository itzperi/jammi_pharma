const fs = require('fs');

const p8Html = `<!-- Breadcrumbs -->
<nav class="flex text-xs uppercase tracking-widest text-slate-500 mb-8 gap-2">
<a class="hover:text-primary" href="#">Home</a>
<span>/</span>
<a class="hover:text-primary" href="#">Skin &amp; Hair Care</a>
<span>/</span>
<span class="text-secondary font-bold">UVSafe Sunscreen</span>
</nav>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
<!-- Hero Gallery -->
<div class="space-y-4">
<div class="aspect-[4/5] bg-white rounded-xl overflow-hidden border border-secondary/5 shadow-sm group">
<img alt="UVSafe Sunscreen elegant packaging" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Jammi Pharmaceuticals UVSafe Sunscreen premium bottle on stone pedestal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm508BgjDHuNGWt_cPbUkhQswp9cjvrurYR13TBYGw2sDMR87twhpwAFqZWMBX3iSXXl1yfhcY3MXb_REPbmv-ysmY6oEyxw10vmzqA7K4YGyt5yloTDtsu6N_Zgc50oHO3jETacSwnAi6Z3QP_vcFfV5rZ1Zlb-CyXaRq_x0h86x5FknFX13B7Rxrvr7NyF2PJn3JIzwk0FHqIJebDNSlCmLJgZ0Kz4YAuRvupop_P0ZVkMP0pcmV75VXeJW0BZZtURUCCeF70gA"/>
</div>
<div class="grid grid-cols-4 gap-4">
<div class="aspect-square bg-white rounded-lg border-2 border-primary overflow-hidden">
<img alt="Sunscreen texture" class="w-full h-full object-cover" data-alt="Creamy sunscreen texture being applied to skin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF368r9U90aGIDQ2m53N5s1XVKLlXD-tvnMUWmCd_rFaoqR_EC1bMxY8Xt7EzD4YH1ZGlKcogs4ddP44tSTvCGUT6tSlj_F72vjmCLEKmjWeqNTj0J_OFb8l9NFNJxu5g-sQwsHT4Zwt2TQNFY9vL_4ftRi9FINz9rCZ_rZX48gvstr4p_8e_go-R9dzTv-4WGpCmBjRV8Y7Nehq-CWruIm6Gts_XSzgWYyJWuKAOpOyfHUnZp6DLlhUOkCywtBCcFwLlOaWjrTrY"/>
</div>
<div class="aspect-square bg-white rounded-lg border border-secondary/5 overflow-hidden opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
<img alt="Saffron ingredients" class="w-full h-full object-cover" data-alt="Kashmiri saffron threads in a wooden bowl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeJYlPvYZXzgO2YyYDNugG1wAMz_4QIO1C14jnIUWAUh0zltrkg0RlBVDJGafM-dchJGOdAoX5-Qq6pcOO7MC9tEt9QsYxTDH_rvDvZYRz0YMwfP3uYCEmOpn_8O8LN3FD7cj1GN7MABLVTaiAb8ND3yP1shc7pBN1YE_Jhst-WS_24twFQa9ADmYOLmBNlxpEmFq2bLasMnpGNwabnnedG1SNV7wWUIJ5NXLilYiz6hqXjhuUfRUtE0NCj_rolEAYtpM894Tw2wY"/>
</div>
<div class="aspect-square bg-white rounded-lg border border-secondary/5 overflow-hidden opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
<img alt="Aloe vera extract" class="w-full h-full object-cover" data-alt="Fresh aloe vera plant slices with gel dripping" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMS-AZKFWSJjUKB9OOXL4mYpPqhVGUlA5F7xIe7hVvyZw0HDbj9VzmvxR9dhGN82T9a5oL08UIlZUA1zoNIEX45G3GNZOoq1MOH6L__xP4ggkTWwxoDcnlLbuUunjd7PEHwTr-pQP7hrO1rg6e9LiBzU5RbBnVJQ2fPU9H2ygIjbDDmtgycWQjbiBGYVwONQJ9BsgojRavxn3ud8ONb_YGeuNT7eQL_86bVxXo76hv5ICGLK7_7XWzc1Wahks2dC6M6f3ZoTIS2xE"/>
</div>
<div class="aspect-square bg-white rounded-lg border border-secondary/5 overflow-hidden opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
<img alt="Legacy factory" class="w-full h-full object-cover" data-alt="Vintage black and white photo of an Ayurvedic pharmacy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1_RgKaoN5sxyuii42QizizvTLNGo0_7Wcy_pL0unERlzdQF4Ys2YY8-HBSATzSmJuuiNwxDvUdHP-XK5LiWQRmi0X6BrNrvjMnODwOxWsv9vN9xLm9nBTZSCz6Nn1vCKAa7Pk6gEFPTN1LVVP07kkAFjG0DHkPg3AC-sD-BoKWpFpS6vE_0M2Ks-ggz_i4Rjjb2VJswr34TFJ9EXDOKLJbPRV8ftCFpYXRZfDw4VN3Aa5sw2Lk7qT1PFimk5shMfWBcQbXvK8F48"/>
</div>
</div>
</div>
<!-- Product Info -->
<div class="flex flex-col">
<div class="mb-2">
<span class="inline-block px-3 py-1 bg-secondary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">125-Year Heritage</span>
</div>
<h2 class="text-4xl md:text-5xl font-heading text-secondary mb-4 leading-tight">UVSafe Ayurvedic Protection SPF 50</h2>
<div class="flex items-center gap-4 mb-6">
<div class="flex text-primary">
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined">star_half</span>
</div>
<span class="text-sm font-medium text-slate-600">4.8 (1,250 Reviews)</span>
</div>
<div class="mb-8">
<p class="text-3xl font-body font-bold text-secondary">₹845.00 <span class="text-lg font-normal text-slate-400 line-through ml-2">₹1,150.00</span></p>
<p class="text-sm text-primary font-medium mt-1">Inclusive of all taxes</p>
</div>
<div class="p-6 bg-white rounded-xl border border-secondary/5 mb-8">
<h3 class="font-heading text-xl text-secondary mb-4">Key Benefits</h3>
<ul class="space-y-4">
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary text-xl">shield_moon</span>
<div>
<p class="font-bold text-secondary text-sm">Triple-Shield Protection</p>
<p class="text-sm text-slate-600">Broad spectrum defense against UVA, UVB, and Blue Light.</p>
</div>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary text-xl">auto_awesome</span>
<div>
<p class="font-bold text-secondary text-sm">Natural Golden Glow</p>
<p class="text-sm text-slate-600">Infused with Kashmiri Saffron for instant skin brightening.</p>
</div>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary text-xl">water_drop</span>
<div>
<p class="font-bold text-secondary text-sm">Non-Greasy Formula</p>
<p class="text-sm text-slate-600">Ayurvedic oils that absorb instantly without a white cast.</p>
</div>
</li>
</ul>
</div>
<div class="flex flex-col sm:flex-row gap-4 mb-10">
<div class="flex items-center border border-secondary/20 rounded-lg overflow-hidden h-14 w-full sm:w-32 bg-white">
<button class="flex-1 hover:bg-secondary/5 transition-colors h-full flex items-center justify-center"><span class="material-symbols-outlined text-sm">remove</span></button>
<span class="flex-1 text-center font-bold">1</span>
<button class="flex-1 hover:bg-secondary/5 transition-colors h-full flex items-center justify-center"><span class="material-symbols-outlined text-sm">add</span></button>
</div>
<button class="flex-[2] bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
<span class="material-symbols-outlined">shopping_cart</span>
                        Add to Cart
                    </button>
<button class="flex-1 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center">
                        Buy Now
                    </button>
</div>
<div class="grid grid-cols-2 gap-4 border-t border-secondary/10 pt-8">
<div class="flex items-center gap-2 text-xs text-slate-600 font-medium">
<span class="material-symbols-outlined text-secondary">verified_user</span>
                        CLINICALLY TESTED
                    </div>
<div class="flex items-center gap-2 text-xs text-slate-600 font-medium">
<span class="material-symbols-outlined text-secondary">psychology_alt</span>
                        AYUSH CERTIFIED
                    </div>
<div class="flex items-center gap-2 text-xs text-slate-600 font-medium">
<span class="material-symbols-outlined text-secondary">cruelty_free</span>
                        CRUELTY FREE
                    </div>
<div class="flex items-center gap-2 text-xs text-slate-600 font-medium">
<span class="material-symbols-outlined text-secondary">eco</span>
                        PARABEN FREE
                    </div>
</div>
</div>
</div>
<!-- Details Section -->
<section class="mt-24 space-y-16">
<!-- Description -->
<div class="max-w-4xl mx-auto text-center">
<h2 class="text-3xl font-heading text-secondary mb-6">The Jammi Legacy</h2>
<p class="text-lg text-slate-600 leading-relaxed font-body">
                    UVSafe is not just a sunscreen; it's a century-old Ayurvedic recipe refined for the modern world. Developed by the master pharmacists at Jammi, our formula uses the cooling properties of Aloe Vera and the restorative power of Saffron to protect your skin from the harshest sun while treating underlying pigmentation.
                </p>
</div>
<!-- Ingredients -->
<div class="bg-secondary text-white rounded-3xl p-12 overflow-hidden relative">
<div class="absolute -right-20 -top-20 opacity-10">
<span class="material-symbols-outlined text-[300px]">spa</span>
</div>
<div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
<div>
<h2 class="text-3xl font-heading mb-8 text-primary">Natural Potency</h2>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
<div class="flex gap-4">
<div class="size-16 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
<span class="material-symbols-outlined text-primary text-3xl">flare</span>
</div>
<div>
<h4 class="font-bold text-lg mb-1">Pure Saffron</h4>
<p class="text-sm text-white/70">Handpicked Kashmiri Saffron threads known for skin brightening.</p>
</div>
</div>
<div class="flex gap-4">
<div class="size-16 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
<span class="material-symbols-outlined text-primary text-3xl">water_drop</span>
</div>
<div>
<h4 class="font-bold text-lg mb-1">Aloe Vera</h4>
<p class="text-sm text-white/70">Premium organic pulp to cool and hydrate sun-exposed skin.</p>
</div>
</div>
<div class="flex gap-4">
<div class="size-16 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
<span class="material-symbols-outlined text-primary text-3xl">grass</span>
</div>
<div>
<h4 class="font-bold text-lg mb-1">Manjistha</h4>
<p class="text-sm text-white/70">Potent herb to detoxify skin and prevent sun spots.</p>
</div>
</div>
<div class="flex gap-4">
<div class="size-16 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
<span class="material-symbols-outlined text-primary text-3xl">waves</span>
</div>
<div>
<h4 class="font-bold text-lg mb-1">Zinc Oxide</h4>
<p class="text-sm text-white/70">Natural mineral filter for immediate UVA/UVB protection.</p>
</div>
</div>
</div>
</div>
<div class="hidden md:block">
<img alt="Natural ingredients layout" class="rounded-2xl shadow-2xl" data-alt="Artistic flatlay of saffron threads, aloe leaves, and Ayurvedic herbs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0990vxKhTWjn0aLD0RmVCaWuSmT9alB606Bd8Iv9vNForz_1FuzyzMv-LrOVZcIWHdDHIql0DpJ6Zs6s6rt6M2v6pVZzbjBcHaXEJQSnSgbgA9T4-EylUcbAv0Y8sfx8eLF65qDtx7JS7b2Ub2TRAyY5XdUtEPZB1FvxcFLbnRGfzCKiilXBUazw_MCPFZ37R6x-9xYTElxXOB7r0E4SncO0Mfbo-GYiSYK5AAr_mT46YHUnZ7aanioukznn0MHcAP42VZzKPL70"/>
</div>
</div>
</div>
<!-- How to Use -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<div class="text-center p-8 bg-white rounded-xl border border-secondary/5 shadow-sm">
<div class="size-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
<h3 class="font-heading text-xl text-secondary mb-2">Cleanse</h3>
<p class="text-slate-600 text-sm">Wash your face with a mild herbal cleanser and pat dry.</p>
</div>
<div class="text-center p-8 bg-white rounded-xl border border-secondary/5 shadow-sm">
<div class="size-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
<h3 class="font-heading text-xl text-secondary mb-2">Apply</h3>
<p class="text-slate-600 text-sm">Apply a pea-sized amount evenly across face and neck.</p>
</div>
<div class="text-center p-8 bg-white rounded-xl border border-secondary/5 shadow-sm">
<div class="size-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
<h3 class="font-heading text-xl text-secondary mb-2">Wait</h3>
<p class="text-slate-600 text-sm">Allow 15 minutes for absorption before sun exposure.</p>
</div>
</div>
<!-- FAQ Section -->
<div class="max-w-3xl mx-auto">
<h2 class="text-3xl font-heading text-secondary mb-8 text-center">Frequently Asked Questions</h2>
<div class="space-y-4">
<details class="group bg-white rounded-xl border border-secondary/5 overflow-hidden" open="">
<summary class="flex items-center justify-between p-6 cursor-pointer list-none">
<span class="font-bold text-secondary">Does it leave a white cast on darker skin tones?</span>
<span class="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
</summary>
<div class="p-6 pt-0 text-slate-600 border-t border-secondary/5">
                            Our unique micronized Zinc Oxide combined with Saffron oil ensures a transparent, glowing finish on all skin tones without any chalky residue.
                        </div>
</details>
<details class="group bg-white rounded-xl border border-secondary/5 overflow-hidden">
<summary class="flex items-center justify-between p-6 cursor-pointer list-none">
<span class="font-bold text-secondary">Is it suitable for acne-prone skin?</span>
<span class="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
</summary>
<div class="p-6 pt-0 text-slate-600 border-t border-secondary/5">
                            Yes, the non-comedogenic formula contains Neem and Aloe Vera which help soothe active inflammation while providing sun protection.
                        </div>
</details>
<details class="group bg-white rounded-xl border border-secondary/5 overflow-hidden">
<summary class="flex items-center justify-between p-6 cursor-pointer list-none">
<span class="font-bold text-secondary">How often should I reapply?</span>
<span class="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
</summary>
<div class="p-6 pt-0 text-slate-600 border-t border-secondary/5">
                            For continuous protection, we recommend reapplying every 3-4 hours if you are outdoors or after swimming and sweating.
                        </div>
</details>
</div>
</div>
<!-- Reviews Section -->
<div class="border-t border-secondary/10 pt-16">
<div class="flex flex-col md:flex-row gap-12 items-start">
<div class="w-full md:w-1/3">
<h2 class="text-3xl font-heading text-secondary mb-6">Real Experiences</h2>
<div class="bg-white p-8 rounded-2xl border border-secondary/5 shadow-sm text-center">
<p class="text-6xl font-bold text-secondary mb-2">4.8</p>
<div class="flex justify-center text-primary mb-2">
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
</div>
<p class="text-slate-500 text-sm">Based on 1,250 verified purchasers</p>
<div class="mt-8 space-y-3">
<div class="flex items-center gap-3">
<span class="text-xs font-bold w-4">5</span>
<div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
<div class="h-full bg-primary" style="width: 85%"></div>
</div>
<span class="text-xs text-slate-400 w-8">85%</span>
</div>
<div class="flex items-center gap-3">
<span class="text-xs font-bold w-4">4</span>
<div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
<div class="h-full bg-primary" style="width: 10%"></div>
</div>
<span class="text-xs text-slate-400 w-8">10%</span>
</div>
<div class="flex items-center gap-3">
<span class="text-xs font-bold w-4">3</span>
<div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
<div class="h-full bg-primary" style="width: 3%"></div>
</div>
<span class="text-xs text-slate-400 w-8">3%</span>
</div>
<div class="flex items-center gap-3">
<span class="text-xs font-bold w-4">2</span>
<div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
<div class="h-full bg-primary" style="width: 1%"></div>
</div>
<span class="text-xs text-slate-400 w-8">1%</span>
</div>
<div class="flex items-center gap-3">
<span class="text-xs font-bold w-4">1</span>
<div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
<div class="h-full bg-primary" style="width: 1%"></div>
</div>
<span class="text-xs text-slate-400 w-8">1%</span>
</div>
</div>
<button class="w-full mt-8 py-3 bg-secondary text-white rounded-lg font-bold hover:bg-secondary/90 transition-colors">Write a Review</button>
</div>
</div>
<div class="w-full md:w-2/3 space-y-8">
<div class="border-b border-secondary/5 pb-8">
<div class="flex justify-between items-start mb-4">
<div class="flex items-center gap-3">
<div class="size-10 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary">AK</div>
<div>
<p class="font-bold text-secondary">Ananya K.</p>
<p class="text-xs text-slate-400">Verified Buyer • 2 weeks ago</p>
</div>
</div>
<div class="flex text-primary text-sm">
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
</div>
</div>
<p class="text-slate-600 font-body">Finally a physical sunscreen that doesn't make me look like a ghost! The saffron gives a really lovely warmth to the skin. Love the legacy behind this brand.</p>
</div>
<div class="border-b border-secondary/5 pb-8">
<div class="flex justify-between items-start mb-4">
<div class="flex items-center gap-3">
<div class="size-10 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary">RV</div>
<div>
<p class="font-bold text-secondary">Rohan V.</p>
<p class="text-xs text-slate-400">Verified Buyer • 1 month ago</p>
</div>
</div>
<div class="flex text-primary text-sm">
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined fill-1">star</span>
<span class="material-symbols-outlined">star</span>
</div>
</div>
<p class="text-slate-600 font-body">Very cooling on the skin. I live in a humid city and this doesn't feel sticky at all. It's become a staple in my daily routine.</p>
</div>
<button class="w-full py-4 text-secondary font-bold flex items-center justify-center gap-2 hover:bg-secondary/5 rounded-xl transition-colors">
                            Load More Reviews
                            <span class="material-symbols-outlined">expand_more</span>
</button>
</div>
</div>
</div>`;

const p9Html = `<!-- Hero Section -->
<div class="max-w-7xl mx-auto px-4 md:px-10 py-8 lg:py-16">
<div class="grid lg:grid-cols-2 gap-12 items-center">
<div class="order-2 lg:order-1 flex flex-col gap-6">
<div class="flex flex-wrap gap-2 text-primary text-sm font-medium">
<a class="hover:underline" href="#">Home</a>
<span>/</span>
<a class="hover:underline" href="#">Skin &amp; Hair Care</a>
<span>/</span>
<span class="text-secondary font-bold">Anti-Ageing</span>
</div>
<h1 class="text-4xl md:text-6xl font-black text-secondary dark:text-slate-100 leading-tight">Timeless Anti-Ageing Cream</h1>
<p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                                A restorative Ayurvedic formula crafted with pure Guggul and Ashwagandha. Experience a visible transformation as it targets fine lines and restores your skin's youthful radiance.
                            </p>
<div class="flex items-center gap-6 py-4">
<div class="flex flex-col">
<div class="flex gap-1 text-primary">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
</div>
<p class="text-sm font-medium text-slate-500">4.9/5 from 850+ reviews</p>
</div>
<div class="h-10 w-px bg-slate-300"></div>
<div>
<p class="text-3xl font-bold text-secondary dark:text-primary">$85.00</p>
<p class="text-xs text-slate-500">50ml / 1.7 fl. oz</p>
</div>
</div>
<div class="flex flex-col sm:flex-row gap-4">
<button class="flex-1 h-14 bg-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2">
<span class="material-symbols-outlined">add_shopping_cart</span>
                                    Add to Cart
                                </button>
<button class="h-14 px-8 border-2 border-secondary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all">
                                    Subscribe &amp; Save 15%
                                </button>
</div>
<div class="flex gap-8 border-t border-slate-200 dark:border-slate-800 pt-8 mt-4">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary">verified_user</span>
<span class="text-xs font-semibold uppercase tracking-wider">Clinically Tested</span>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary">eco</span>
<span class="text-xs font-semibold uppercase tracking-wider">100% Organic</span>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary">cruelty_free</span>
<span class="text-xs font-semibold uppercase tracking-wider">Cruelty Free</span>
</div>
</div>
</div>
<div class="order-1 lg:order-2">
<div class="relative group">
<div class="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
<img class="relative w-full aspect-square object-cover rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800" data-alt="Premium jar of anti-ageing cream on a wooden surface with herbal ingredients" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0u2y3Yd2aIMMO9Wjj1ILe040OyX-3Q8826DPzRaJeWNi5xaqGgjRcOirvD8y8BEZH6v8lYemFvPtXoIUp5swTLbEBMxhk6ruQDGBx4q0lfaEI3y2R_My2jZMGpFKwOzXond5krqb6ZZbYx0nPdIiU1SolZJoFk_Q75VojKGIq27J5XPdA2NhCCrgz1cKmjJymarz6AKajvDyPGbnBPZIFSHes8i16pM-2H3P-CDbHtBCBrvbw1hvUHzc2y1YDCSDbNe7zi2QJJu0"/>
</div>
</div>
</div>
</div>
<!-- Key Benefits Section -->
<section class="bg-secondary text-white py-20">
<div class="max-w-7xl mx-auto px-4 md:px-10 text-center">
<h2 class="text-3xl md:text-5xl font-bold mb-16">The Science of Ageless Beauty</h2>
<div class="grid md:grid-cols-3 gap-12">
<div class="flex flex-col items-center gap-4">
<div class="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-2">
<span class="material-symbols-outlined text-primary text-4xl">auto_fix_high</span>
</div>
<h3 class="text-xl font-bold">Reduces Wrinkles</h3>
<p class="text-slate-300 leading-relaxed">Clinically proven to reduce the depth of fine lines and visible wrinkles within 4 weeks of consistent use.</p>
</div>
<div class="flex flex-col items-center gap-4">
<div class="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-2">
<span class="material-symbols-outlined text-primary text-4xl">dry_cleaning</span>
</div>
<h3 class="text-xl font-bold">Firms Skin</h3>
<p class="text-slate-300 leading-relaxed">Improves skin elasticity and promotes natural collagen production for a lifted, more contoured appearance.</p>
</div>
<div class="flex flex-col items-center gap-4">
<div class="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-2">
<span class="material-symbols-outlined text-primary text-4xl">flare</span>
</div>
<h3 class="text-xl font-bold">Restores Youth</h3>
<p class="text-slate-300 leading-relaxed">Deeply nourishes the dermal layers to restore natural radiance and smooth uneven skin texture.</p>
</div>
</div>
</div>
</section>
<!-- Ingredients Section -->
<section class="py-24 bg-white dark:bg-slate-900">
<div class="max-w-7xl mx-auto px-4 md:px-10">
<div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
<div class="max-w-2xl">
<span class="text-primary font-bold uppercase tracking-widest text-sm">Nature's Finest</span>
<h2 class="text-4xl font-black text-secondary dark:text-slate-100 mt-2">Potent Ayurvedic Ingredients</h2>
</div>
<a class="text-primary font-bold flex items-center gap-2 hover:underline" href="#">
                                View All Ingredients
                                <span class="material-symbols-outlined">trending_flat</span>
</a>
</div>
<div class="grid md:grid-cols-3 gap-8">
<div class="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
<div class="text-4xl mb-4">🌿</div>
<h4 class="text-xl font-bold text-secondary dark:text-primary mb-3">Pure Guggul</h4>
<p class="text-slate-600 dark:text-slate-400">A potent resin known for its incredible ability to support natural skin regeneration and lipid balance.</p>
</div>
<div class="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
<div class="text-4xl mb-4">✨</div>
<h4 class="text-xl font-bold text-secondary dark:text-primary mb-3">Ashwagandha</h4>
<p class="text-slate-600 dark:text-slate-400">The "King of Herbs" that provides powerful antioxidant protection against environmental stressors.</p>
</div>
<div class="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
<div class="text-4xl mb-4">🌹</div>
<h4 class="text-xl font-bold text-secondary dark:text-primary mb-3">Rosehip Oil</h4>
<p class="text-slate-600 dark:text-slate-400">Packed with Vitamin A and C, it brightens the complexion and helps fade dark spots naturally.</p>
</div>
</div>
</div>
</section>
<!-- How to Use Section -->
<section class="py-20 bg-background-light dark:bg-background-dark">
<div class="max-w-7xl mx-auto px-4 md:px-10">
<div class="grid lg:grid-cols-2 gap-16 items-center">
<div class="grid grid-cols-2 gap-4">
<div class="rounded-3xl overflow-hidden h-64 shadow-lg">
<div class="w-full h-full bg-slate-200 flex items-center justify-center" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))">
<img class="w-full h-full object-cover" data-alt="Applying face cream in a morning routine" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChfwjK7q7Q5_1-enac3_55XZl1JcF4WVXfTotCHk2se_Y2Wtjjfx_4HCcddJFIteWbw8nsd5zvvBqCC15Hxs4OWer91XLsTAHyry7ANiPGJwkkh0LZseuW6bcUQUuYgNRjxKZSNfG29SKBHk4JqNnMWvQ0okMYSumDXMcsp-7KTi5QsgwlZHe5KjqJ0xkdhhyPAEvRzE7a0AQygDjsOrZzO48SqB1DXhdsd75p1yGwzXoyk5b-WSAuQW7U_m3_MeBi_yACJb6PiYQ"/>
</div>
</div>
<div class="rounded-3xl overflow-hidden h-64 mt-8 shadow-lg">
<div class="w-full h-full bg-slate-200 flex items-center justify-center" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))">
<img class="w-full h-full object-cover" data-alt="Peaceful morning ritual with skincare products" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZH728NA98YRmqOF1wn4A-aHRixQ_pfCjJBmrF4MZHM5Jy9JDrgbJcA9SsCs7QbkmL4vg2UgzUSitW3copiPpT6ts-hT15sVG6ms3c7l5WzQLIdmCzeFv-I2sDRo-1SEACXiuG9MBLn3VuT6Q3LNqccppXPwntL-133x7Frs6BDOSoN6kAVbJmsRNUpZKevDDkYci-GJi9xjVA_Qr24RAKbQr-y3_o3hXWOIdYCklP2rs9z-_0Z8_rP9z4aFUk_sTvNlEAZVdmIp0"/>
</div>
</div>
</div>
<div>
<h2 class="text-4xl font-black text-secondary dark:text-slate-100 mb-8">How to Incorporate into your Ritual</h2>
<div class="space-y-8">
<div class="flex gap-6">
<div class="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
<div>
<h5 class="text-lg font-bold mb-1">Cleanse</h5>
<p class="text-slate-600 dark:text-slate-400">Start with a clean, dry face. Use a gentle cleanser to remove all impurities.</p>
</div>
</div>
<div class="flex gap-6">
<div class="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
<div>
<h5 class="text-lg font-bold mb-1">Massage</h5>
<p class="text-slate-600 dark:text-slate-400">Apply a pea-sized amount to your fingertips and gently massage onto face and neck in upward circular motions.</p>
</div>
</div>
<div class="flex gap-6">
<div class="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
<div>
<h5 class="text-lg font-bold mb-1">Absorb</h5>
<p class="text-slate-600 dark:text-slate-400">Allow the cream to fully absorb for 2-3 minutes before applying sunscreen or makeup.</p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Testimonials -->
<section class="py-24 bg-white dark:bg-slate-900">
<div class="max-w-7xl mx-auto px-4 md:px-10">
<div class="text-center mb-16">
<h2 class="text-4xl font-black text-secondary dark:text-slate-100 mb-4">Voices of Radiance</h2>
<p class="text-slate-600 dark:text-slate-400">Real stories from our beloved community.</p>
</div>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
<div class="p-8 rounded-3xl bg-background-light dark:bg-background-dark border border-slate-100 dark:border-slate-800">
<div class="flex gap-1 text-primary mb-4">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
</div>
<p class="text-lg font-medium italic mb-6">"My skin hasn't felt this supple in decades. The Guggul extract really makes a difference in firming my jawline."</p>
<div class="flex items-center gap-4">
<div class="h-12 w-12 rounded-full bg-slate-200 overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Portrait of a satisfied customer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfJkDZlV205dyH3guDD00SNWeQ4frB0gYk9L97yzrXkfdzlKt_fTDSefgso_TQ2yWrjLIAFhy7w6UH1qxr3YqmNr-cSOICpqAhsp3pP1C88G0WVyPWF1-9IX29gsIiALak_iIRquokqNr5RD1Eqo2CaTHvzlVxPUmHN3VGFVkM0xMOl61zYsDEWRTJ6dLA8Vt6rbdDeoWCuJ84j0hz9l46s9TVJMbd2XnjWQ0Qb7--Hv6uo6-_7UTbA9IGdV_ECq__iWGu896NFfE"/>
</div>
<div>
<p class="font-bold">Eleanor M.</p>
<p class="text-xs text-slate-500 uppercase">Verified Purchase</p>
</div>
</div>
</div>
<div class="p-8 rounded-3xl bg-background-light dark:bg-background-dark border border-slate-100 dark:border-slate-800">
<div class="flex gap-1 text-primary mb-4">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
</div>
<p class="text-lg font-medium italic mb-6">"Finally an anti-ageing cream that doesn't feel heavy. It absorbs beautifully and the herbal scent is divine."</p>
<div class="flex items-center gap-4">
<div class="h-12 w-12 rounded-full bg-slate-200 overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Portrait of a satisfied customer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEWk7UOnWrBYETdk38x-pQMKhyF6AvqFJXEPM7XoWZQCrcUWSPkqQg8tcf1-eLnC74mR-CrJN4DsXXplGrYeh1-o2QfkwpaQl9v78C8Cxl7dQLyieUuyNju_hNn0b5o_vsOWYk34bS0WowJgZJciXOfgWeKO1otKgjSNScThbVqTHiaDGk7Aj0mPNsanLW227N90c_66XuFZy6sERzmxGTaUJAZQS3QjUwZWgIRGXMrz_A9a4uPe04W2Jg_liUFwn2PV5GMXp0l-M"/>
</div>
<div>
<p class="font-bold">Sarah K.</p>
<p class="text-xs text-slate-500 uppercase">Verified Purchase</p>
</div>
</div>
</div>
<div class="p-8 rounded-3xl bg-background-light dark:bg-background-dark border border-slate-100 dark:border-slate-800">
<div class="flex gap-1 text-primary mb-4">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">star</span>
</div>
<p class="text-lg font-medium italic mb-6">"Noticeable difference in the fine lines around my eyes after just 3 weeks. Truly a timeless miracle."</p>
<div class="flex items-center gap-4">
<div class="h-12 w-12 rounded-full bg-slate-200 overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Portrait of a satisfied customer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-yf4CwxHUIHQYFHb5Y5EAhvG6AngQVW5qZVTBobllDCgWqCl53K2n39h4Yahc3H49zfRIhZhlRNVCrMWim-wnXs_yS_SxO3b1xCpXXMhKAbeCjE0X4igxcr6d9bZATHg254utr1rLr2T4YaV-UV2d3Lq_EiolE3iuqxvB2WdapfkO3HcEIzoP4T01KNnveEzUPbMPiItX-fr8b7oax02inRzUQ089JJuCqrM_KBAjOqEgMr22NrS0_pEv8nZws0SwhGVNwzcY0Z8"/>
</div>
<div>
<p class="font-bold">Julianna R.</p>
<p class="text-xs text-slate-500 uppercase">Verified Purchase</p>
</div>
</div>
</div>
</div>
</div>
</section>`;

// Regex replacement function
function convertToJSX(html, themeColors, fontMappings) {
    let jsx = html;

    // Class replacements
    jsx = jsx.replace(/class=/g, "className=");

    // Self-closing tags
    jsx = jsx.replace(/<img(.*?)>/g, (match) => {
        if (!match.endsWith("/>")) return match.slice(0, -1) + " />";
        return match;
    });
    jsx = jsx.replace(/<input(.*?)>/g, (match) => {
        if (!match.endsWith("/>")) return match.slice(0, -1) + " />";
        return match;
    });
    jsx = jsx.replace(/<br>/g, "<br />");
    jsx = jsx.replace(/<hr(.*?)>/g, (match) => {
        if (!match.endsWith("/>")) return match.slice(0, -1) + " />";
        return match;
    });

    // Camel case attributes
    const attributes = ["stroke-linecap", "stroke-linejoin", "stroke-width", "fill-rule", "clip-rule"];
    attributes.forEach(attr => {
        const camel = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
        jsx = jsx.replace(new RegExp(attr + "=", "g"), camel + "=");
    });

    // Style conversions
    jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
        let styles = p1.split(';').filter(x => x.trim() !== '');
        let styleObjCode = [];
        styles.forEach(style => {
            let [key, val] = style.split(':').map(x => x.trim());
            if (key && val) {
                const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
                styleObjCode.push(`${camelKey}: "${val.replace(/"/g, "'")}"`);
            }
        });
        return `style={{ ${styleObjCode.join(', ')} }}`;
    });

    // Colors and fonts matching Tailwind arbitrary
    Object.keys(themeColors).forEach(k => {
        const regex = new RegExp(`\\b(bg|text|border|ring|shadow|fill)-${k}\\b`, "g");
        const val = themeColors[k];
        jsx = jsx.replace(regex, `$1-[${val}]`);
    });

    Object.keys(fontMappings).forEach(k => {
        const regex = new RegExp(`\\bfont-${k}\\b`, "g");
        const val = fontMappings[k];
        jsx = jsx.replace(regex, `font-['${val}']`);
    });

    return jsx;
}

const colorMap8 = {
    "primary": "#D4882E",
    "secondary": "#2E5339",
    "neutral-cream": "#FAF6F0",
    "background-light": "#f8f6f6",
    "background-dark": "#221610",
};

const fontMap8 = {
    "heading": "Playfair_Display',serif",
    "body": "DM_Sans',sans-serif"
};

const jsx8Raw = convertToJSX(p8Html, colorMap8, fontMap8);
const code8 = `import React, { useEffect } from 'react';
import AppHeader from '../../components/AppHeader';

const UVSafeSunscreen: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FAF6F0] text-slate-900 dark:bg-[#221610] dark:text-slate-100 font-['DM_Sans',sans-serif]">
            <AppHeader />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            ${jsx8Raw}
        </div>
    );
};

export default UVSafeSunscreen;
`;

const colorMap9 = {
    "primary": "#D4882E",
    "secondary": "#2E5339",
    "background-light": "#FAF6F0",
    "background-dark": "#221610",
};

const fontMap9 = {
    "display": "Public_Sans',sans-serif"
};

const jsx9Raw = convertToJSX(p9Html, colorMap9, fontMap9);
const code9 = `import React, { useEffect } from 'react';
import AppHeader from '../../components/AppHeader';

const TimelessAntiAgeing: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FAF6F0] dark:bg-[#221610] font-['Public_Sans',sans-serif] text-slate-900 dark:text-slate-100 min-h-screen">
            <AppHeader />
            ${jsx9Raw}
        </div>
    );
};

export default TimelessAntiAgeing;
`;

fs.writeFileSync('pages/products/UVSafeSunscreen.tsx', code8);
fs.writeFileSync('pages/products/TimelessAntiAgeing.tsx', code9);
console.log('Conversion successful!');

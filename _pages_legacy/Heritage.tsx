"use client";
import React, { useState, useEffect } from 'react';
import { subscribeToDocument } from '../lib/adminDb';
import LiveEditable from '../components/admin/LiveEditable';

const Heritage: React.FC = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeToDocument('site_content', 'heritage', (data) => {
      if (data) setContent(data);
    });
    return () => unsub();
  }, []);

  const heroHeadline = content?.heroHeadline || "A Legacy of Healing";
  const heroSubtext = content?.heroSubtext || "Honoring the visionary founder, Dr. Jammi Venkataramanayya. Over a century of bridging ancient Ayurvedic wisdom with the rigor of modern science to serve humanity.";
  const founderTitle = content?.founderTitle || "A Life Dedicated to Healing";
  const founderText1 = content?.founderText1 || "In the late 19th century, when modern medicine was still in its infancy in India, Dr. Jammi Venkataramanayya embarked on a mission to democratize the profound healing wisdom of Ayurveda.";
  const founderQuote = content?.founderQuote || "True healing occurs only when the ancient texts are honored with modern precision.";

  return (
    <div className="bg-background-light text-secondary transition-colors duration-300 font-body">
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] flex items-center justify-center bg-background-light overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590422744728-64c861219159?q=80&w=2670&auto=format&fit=crop')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/60 to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <p className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Est. 1890</p>
          <h1 className="font-display text-6xl md:text-8xl text-black leading-tight mb-6 font-extrabold">
            <LiveEditable collection="site_content" docId="heritage" field="heroHeadline">{heroHeadline}</LiveEditable>
          </h1>
          <p className="text-lg md:text-xl text-slate-100 max-w-3xl mx-auto leading-relaxed">
            <LiveEditable collection="site_content" docId="heritage" field="heroSubtext" multiline>{heroSubtext}</LiveEditable>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a href="#milestones" className="inline-block bg-secondary text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all shadow-lg hover:-translate-y-1">Explore Our Journey</a>
            <button className="border-2 border-secondary text-secondary px-8 py-4 rounded-full font-bold hover:bg-secondary hover:text-white transition-all">View Archival Gallery</button>
          </div>
        </div>
      </section>

      {/* The Founder Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative group">
          <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
          <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop" alt="Dr. Jammi Venkataramanayya" className="rounded-[2.5rem] w-full aspect-[3/4] object-cover shadow-2xl grayscale" />
          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white">
            <h3 className="text-xl font-bold text-secondary font-display mb-1">Dr. Jammi Venkataramanayya</h3>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">The Visionary Founder</p>
          </div>
        </div>
        <div className="order-1 lg:order-2 space-y-6">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">The Architect of Modern Ayurveda</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary leading-tight">
            <LiveEditable collection="site_content" docId="heritage" field="founderTitle">{founderTitle}</LiveEditable>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            <LiveEditable collection="site_content" docId="heritage" field="founderText1" multiline>{founderText1}</LiveEditable>
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            <LiveEditable collection="heritage" docId="main" field="founderText2" multiline>
              {content?.founderText2 || "Recognizing the need for standardization, he became one of the first practitioners to introduce scientific rigor into the preparation of Ayurvedic formulations, ensuring consistent quality and efficacy for every patient."}
            </LiveEditable>
          </p>
          <blockquote className="border-l-4 border-primary pl-6 py-2 my-8">
            <p className="text-xl font-display italic text-secondary leading-snug">
              "<LiveEditable collection="site_content" docId="heritage" field="founderQuote" multiline>{founderQuote}</LiveEditable>"
            </p>
          </blockquote>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="milestones" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">A Century of Milestones</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="relative flex flex-col gap-0">
            {/* Center Line */}
            <div className="absolute left-[20px] md:left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-slate-200"></div>

            {/* Timeline Items */}
            {[
              { year: '1890', title: 'Founding in Vijayanagaram', desc: 'Dr. Jammi Venkataramanayya begins his quest to modernize traditional healing practices with his first clinic.', field: 'm1' },
              { year: '1940', title: 'Tamil Nadu Govt Award', desc: 'Recognition for pioneering work in public health and standardized Ayurveda during a critical healthcare crisis.', field: 'm2' },
              { year: '1965', title: 'The First Manufacturing Unit', desc: 'Establishment of a dedicated facility ensuring all formulations meet strict clinical standards.', field: 'm3' },
              { year: '1990', title: 'Premier Institute Collaborations', desc: 'Jammi partners with technical institutes (IITs) to validate ancient molecules using modern analytics.', field: 'm4' },
              { year: '2025', title: 'A New Digital Frontier', desc: 'Bringing 128 years of clinical heritage to patients globally through advanced online consultation platforms.', field: 'm5' }
            ].map((milestone, idx) => (
              <div key={milestone.year} className={`relative flex flex-col md:flex-row gap-8 md:gap-12 mb-16 items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                {/* Mobile line dot connection */}
                <div className="absolute left-[20px] top-6 transform -translate-x-1/2 -translate-y-1/2 size-4 rounded-full bg-primary border-4 border-white md:hidden z-10 shadow-sm"></div>

                <div className={`md:w-1/2 text-left pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <span className="text-4xl lg:text-5xl font-extrabold text-[#E8D5B5] font-display opacity-50 block mb-2">{milestone.year}</span>
                </div>

                {/* Desktop line dot connection */}
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 size-5 rounded-full bg-white border-[5px] border-primary z-10 shadow-sm transition-transform hover:scale-125 duration-300"></div>

                <div className="md:w-1/2 pl-12 md:pl-0">
                  <div className={`bg-background-light p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative ${idx % 2 === 0 ? '' : 'md:ml-auto'}`}>
                    <h3 className="text-xl font-bold mb-2 text-secondary">
                      <LiveEditable collection="site_content" docId="heritage" field={`${milestone.field}Title`}>{milestone.title}</LiveEditable>
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      <LiveEditable collection="site_content" docId="heritage" field={`${milestone.field}Desc`} multiline>{milestone.desc}</LiveEditable>
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Archival Gallery */}
      <section className="py-24 bg-background-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-display text-4xl text-secondary font-bold mb-4">The Archival Gallery</h2>
              <div className="w-12 h-1 bg-primary rounded-full"></div>
            </div>
            <p className="text-slate-500 max-w-md text-right hidden md:block">Glimpses into the foundational days of Jammi Pharmaceuticals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl shadow-lg aspect-square">
              <img className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" src="https://images.unsplash.com/photo-1579308638162-8e12470762cb?q=80&w=2670&auto=format&fit=crop" alt="Sacred Manuscripts" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Circa 1905</p>
                <h3 className="text-white text-xl font-bold font-display">Sacred Formulations</h3>
                <p className="text-white/70 text-sm mt-2 line-clamp-2">Original handwritten notes documenting precise ingredient ratios for potent remedies.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[3/4] md:aspect-square">
              <img className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" src="https://images.unsplash.com/photo-1631557088921-665aa0808cf7?q=80&w=2670&auto=format&fit=crop" alt="Vintage Tincture Bottles" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Circa 1920</p>
                <h3 className="text-white text-xl font-bold font-display">Apothecary Dispensary</h3>
                <p className="text-white/70 text-sm mt-2 line-clamp-2">First-generation glass tincture bottles used for storing delicate active botanical extracts.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl shadow-lg aspect-square">
              <img className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2670&auto=format&fit=crop" alt="First Laboratory" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Circa 1965</p>
                <h3 className="text-white text-xl font-bold font-display">The First Laboratory</h3>
                <p className="text-white/70 text-sm mt-2 line-clamp-2">Our shift into standardized mass production while maintaining strict clinical protocols.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Heritage;

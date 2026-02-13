import React from 'react';
import { Lightbulb, ShieldCheck, Cpu, Network } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">About the Project</h1>
        <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-600 font-semibold">
          <Lightbulb size={20} />
          <span>SB-MED01 by Team Ideators</span>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Our Mission</h2>
        <p className="text-slate-600 leading-relaxed text-lg">
          SB-MED01 is a smart multi-organ blood analyzer designed to democratize healthcare diagnostics. 
          Our goal is to provide real-time, accurate biomarker tracking to enhance accessibility 
          and enable proactive medical intervention through continuous monitoring.
        </p>
      </section>

      {/* Core Features */}
      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Non-Invasive Sensing</h3>
          <p className="text-slate-500 text-sm">
            Advanced optical sensors capable of detecting glucose and metabolite levels without the need for needles, reducing patient discomfort and infection risk.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
            <Cpu size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">AI-Driven Diagnostics</h3>
          <p className="text-slate-500 text-sm">
            Powered by custom machine learning algorithms (Scikit-Learn/TensorFlow) to analyze trends, predict critical events, and filter noise from sensor data.
          </p>
        </div>
      </section>

      {/* Future Vision */}
      <section className="bg-slate-900 text-white rounded-xl p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Network className="text-emerald-400" size={24} />
            <h2 className="text-xl font-bold">Future Vision</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            We envision SB-MED01 integrating seamlessly with hospital Electronic Health Records (EHR) systems via FHIR standards. 
            Future iterations will include predictive analytics for early onset sepsis detection and renal failure alerts, 
            bridging the gap between home monitoring and professional critical care.
          </p>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      </section>
      
      <div className="mt-8 text-center text-slate-400 text-sm">
        © 2024 Team Ideators. All Rights Reserved.
      </div>
    </div>
  );
};

export default About;
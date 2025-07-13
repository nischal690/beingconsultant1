import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-black py-12">
        <style jsx>{`
          .venn-text {
            color: black !important;
          }
        `}</style>
        <div className="relative p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-10">About the <span className="italic">Gaurav</span> Advantage</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Diagram Image */}
        <div className="flex justify-center">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Screenshot_2025-06-27_070351-removebg-preview.png?alt=media&token=94acc93c-9109-49da-8eda-e4300ea92774"
            alt="Gaurav Advantage Diagram"
            width={400}
            height={400}
            className="object-contain h-[300px] md:h-[350px] w-auto"
            priority
          />
        </div>
        
        {/* Advantage Descriptions */}
        <div className="space-y-10">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold bg-[#8BA89F]/20 p-2">360° Coaching Perspective</h2>
            <p className="text-white/80">
              Unlike coaches who replicate their singular path, I identify and amplify your unique strengths. As a certified career coach with McKinsey experience, I architect personalized strategies that showcase your authentic value to firms.
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold bg-[#D8A7A7]/20 p-2">Expertise</h2>
            <p className="text-white/80">
              My active role in consulting recruitment provides rare insight into what firms truly seek beyond standard frameworks. This dual perspective ensures your preparation aligns precisely with current evaluation practices and market demands.
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold bg-[#C2B280]/20 p-2">Excellence Standard</h2>
            <p className="text-white/80">
              Having worked across 25+ countries and coached professionals from 55+ nations, I bring a truly global perspective to your preparation. This international insight translates into versatile approaches that succeed across diverse consulting environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}

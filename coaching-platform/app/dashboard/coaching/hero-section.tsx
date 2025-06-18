import React from 'react';

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
        {/* Venn Diagram */}
        <div className="relative h-[300px] md:h-[350px] w-full">
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 h-[180px] w-[180px] md:h-[200px] md:w-[200px] rounded-full bg-[#8BA89F]/70 flex items-center justify-center text-center p-4">
            <span className="font-bold text-sm md:text-base text-black" style={{color: 'black !important'}}>360° COACHING<br/>PERSPECTIVE</span>
          </div>
          
          <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 h-[180px] w-[180px] md:h-[200px] md:w-[200px] rounded-full bg-[#D8A7A7]/70 flex items-center justify-center text-center p-4">
            <span className="font-bold text-sm md:text-base text-black" style={{color: 'black !important'}}>EXPERTISE</span>
          </div>
          
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[180px] w-[180px] md:h-[200px] md:w-[200px] rounded-full bg-[#C2B280]/70 flex items-center justify-center text-center p-4">
            <span className="font-bold text-sm md:text-base text-black" style={{color: 'black !important'}}>EXCELLENCE<br/>STANDARD</span>
          </div>
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

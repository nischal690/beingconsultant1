import React from "react";
import { FaMagic } from "react-icons/fa";

export default function CareerTransitionPage() {
  return (
    <>
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="flex flex-col items-start space-y-8">
            <div className="flex items-center space-x-2 text-green-200 text-sm font-medium">
              <FaMagic className="text-green-400" />
              <span>Digital Career Transition Coach</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Achieve goals with <br /> tailored support
            </h1>
            <div className="flex flex-col items-center mt-2">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/coach-gaurav-new-image%20(1).png?alt=media&token=e655e9da-c918-4631-9553-5458c41b3462"
                alt="Coach Gaurav Profile"
                className="w-56 h-64 object-cover rounded-md shadow-lg border border-white/10 bg-black"
              />
              <span className="text-gray-300 text-sm mt-4 text-center">
                Find clarity, purpose, and motivation to <br /> achieve your goals effortlessly.
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-center">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/e1df2yODDLw9RAzGeU4vtjSrE0.jpg?alt=media&token=7792d52a-60b8-41ef-872c-4752742b6e1e"
              alt="Coaching Visual"
              className="w-80 h-96 object-cover rounded-3xl shadow-2xl border border-white/10"
            />
            <span className="text-gray-300 text-sm mt-4 text-center">
              I help individuals unlock their potential and <br /> create a life they truly love.
            </span>
          </div>
        </div>
      </div>

      {/* What I Offer Section */}
      <section className="bg-black py-20 px-2">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">What I Offer</h2>
          <p className="text-gray-300 mb-12 text-lg max-w-2xl mx-auto">
            Tailored coaching programs designed to help you grow and thrive in every aspect of life.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {/* Exit Planning & Readiness */}
            <div className="flex flex-col items-center">
              <span className="text-green-300 text-4xl mb-4">
                {/* Palm Tree Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 30V14M16 14c-3.866 0-7-3.134-7-7M16 14c3.866 0 7-3.134 7-7M16 14C7.163 14 2 8.837 2 8.837S8.837 2 16 2c7.163 0 14 6.837 14 6.837S24.837 14 16 14z" /></svg>
              </span>
              <h3 className="font-semibold text-lg text-white mb-2">Exit Planning & Readiness</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Switching roles or planning an exit? Schedule a call with our Ex-McK Coach and chart out a trajectory.
              </p>
            </div>
            {/* Career Coaching */}
            <div className="flex flex-col items-center">
              <span className="text-green-300 text-4xl mb-4">
                {/* Building Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 28V6a2 2 0 012-2h16a2 2 0 012 2v22M6 28h20M10 28V14m4 14V18m4 10V10m4 18V6" /></svg>
              </span>
              <h3 className="font-semibold text-lg text-white mb-2">Career Coaching</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Discover your strengths, refine your skills, and confidently pursue the career you've always wanted.
              </p>
            </div>
            {/* Career Transition */}
            <div className="flex flex-col items-center">
              <span className="text-green-300 text-4xl mb-4">
                {/* Arrow Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M24 8l4 4-4 4M28 12H12a8 8 0 100 16h8" /></svg>
              </span>
              <h3 className="font-semibold text-lg text-white mb-2">Career Transition</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Moving away from Consulting to Strategy, Management etc? Schedule a call with our Ex-McK Coach & chart out avenues
              </p>
            </div>
          </div>
          {/* Pricing Card */}
          <div className="flex justify-center">
            <div className="bg-white/95 rounded-xl shadow-2xl px-8 py-8 flex flex-col md:flex-row items-center md:items-start gap-8 max-w-3xl w-full">
              <div className="flex-1">
                <ul className="space-y-4 text-left">
                  <li className="flex items-center text-black font-semibold text-base">
                    <span className="mr-2 text-green-600">●</span> Personalised Session to Suit your needs
                  </li>
                  <li className="flex items-center text-black font-semibold text-base">
                    <span className="mr-2 text-green-600">●</span> Career Growth, Appraisal
                  </li>
                  <li className="flex items-center text-black font-semibold text-base">
                    <span className="mr-2 text-green-600">●</span> Career Transition, Exit
                  </li>
                  <li className="flex items-center text-black font-semibold text-base">
                    <span className="mr-2 text-green-600">●</span> Specific Professional Scenarios
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <span className="text-gray-700 text-sm mb-2">Duration 1 hour</span>
                <div className="flex items-end mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-black mr-2">$299</span>
                  <button className="bg-green-900 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md ml-2 transition">Book a session</button>
                </div>
                <span className="text-gray-500 text-xs">Price per Session</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-black py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent animate-gradient-x bg-gradient-to-r from-white via-gray-400 to-white"
            style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
          >
            Real stories of growth, success, and
          </h2>
          <p className="text-lg mb-8 text-white/80 font-medium tracking-wide">
            transformation through <span className="bg-gradient-to-r from-green-300 via-white to-green-300 bg-clip-text text-transparent animate-gradient-x">coaching</span>.
          </p>
        </div>
        {/* Improved testimonial carousel */}
        <div className="overflow-hidden relative max-w-6xl mx-auto py-8">
          {/* Enhanced glowing background effect */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="w-3/4 h-40 bg-gradient-to-r from-white/5 via-green-400/10 to-white/5 rounded-full blur-3xl mx-auto mt-12 animate-pulse opacity-30" />
            <div className="w-1/2 h-24 bg-gradient-to-r from-green-400/5 via-white/10 to-green-400/5 rounded-full blur-3xl mx-auto mt-24 animate-pulse opacity-20" style={{animationDelay: '1s'}} />
          </div>
          <div className="flex w-max animate-marquee gap-6 group hover:[animation-play-state:paused] relative z-10" style={{animationDuration: '40s'}}>
            {/* Redesigned testimonial cards */}
            {[...Array(2)].flatMap((_, idx) => [
              <div key={`t1-${idx}`} className="min-w-[220px] max-w-[220px] h-[380px] bg-black/60 border border-white/10 shadow-2xl rounded-2xl flex flex-col justify-between backdrop-blur-xl hover:border-white/30 transition-all duration-300 p-6 group/card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div>
                  <div className="flex text-green-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "The personalized guidance made all the difference. My mindset has completely shifted for the better. I found clarity in my career path."
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-white font-medium">Daniel W.</p>
                  <p className="text-gray-400 text-sm">Marketing Director</p>
                </div>
              </div>,
              <div key={`t2-${idx}`} className="min-w-[220px] max-w-[220px] h-[380px] bg-black/60 border border-white/10 shadow-2xl rounded-2xl flex flex-col justify-between backdrop-blur-xl hover:border-white/30 transition-all duration-300 p-6 group/card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div>
                  <div className="flex text-green-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "This coaching program helped me transition to a new role with confidence. The strategies I learned were invaluable for my growth."
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-white font-medium">Sarah K.</p>
                  <p className="text-gray-400 text-sm">Product Manager</p>
                </div>
              </div>,
              <div key={`t3-${idx}`} className="min-w-[220px] max-w-[220px] h-[380px] bg-black/60 border border-white/10 shadow-2xl rounded-2xl flex flex-col justify-between backdrop-blur-xl hover:border-white/30 transition-all duration-300 p-6 group/card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div>
                  <div className="flex text-green-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "The coaching sessions provided me with actionable insights that transformed my approach to leadership and team management."
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-white font-medium">Michael R.</p>
                  <p className="text-gray-400 text-sm">Team Lead</p>
                </div>
              </div>,
              <div key={`t4-${idx}`} className="min-w-[220px] max-w-[220px] h-[380px] bg-black/60 border border-white/10 shadow-2xl rounded-2xl flex flex-col justify-between backdrop-blur-xl hover:border-white/30 transition-all duration-300 p-6 group/card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div>
                  <div className="flex text-green-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "I was stuck in my career until I found this coaching program. Now I have a clear vision and the confidence to pursue my goals."
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-white font-medium">Jennifer L.</p>
                  <p className="text-gray-400 text-sm">Senior Analyst</p>
                </div>
              </div>,
              <div key={`t5-${idx}`} className="min-w-[220px] max-w-[220px] h-[380px] bg-black/60 border border-white/10 shadow-2xl rounded-2xl flex flex-col justify-between backdrop-blur-xl hover:border-white/30 transition-all duration-300 p-6 group/card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div>
                  <div className="flex text-green-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "The coaching experience was transformative. I gained valuable insights about myself and developed strategies that led to a successful career transition."
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-white font-medium">David T.</p>
                  <p className="text-gray-400 text-sm">Tech Consultant</p>
                </div>
              </div>
            ])}
          </div>
          {/* Marquee animation CSS */}
          <style>{`
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee 40s linear infinite;
  }
  .group:hover {
    animation-play-state: paused !important;
  }
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 6s ease-in-out infinite;
  }
  @keyframes gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`}</style>
        </div>

      </section>
    </>
  );
}

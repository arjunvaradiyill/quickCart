import React, { useState, useEffect } from 'react';

const Carousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 5;
  
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const goToSlide = (slideIndex) => {
    setActiveSlide(slideIndex);
  };
  
  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  // Auto-change slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1400px] h-[600px] w-full mx-auto my-8 px-4">
      <div id="indicators-carousel" className="relative h-full" data-carousel="static">
        <div className="relative h-full overflow-hidden rounded-2xl">
          {[
            "https://i.pinimg.com/736x/fc/58/e0/fc58e07dad2d9911c9920bec3ef4b427.jpg",
            "https://i.pinimg.com/736x/86/8d/7c/868d7c94abb81f1da6f52f7a1260a47a.jpg",
            "https://i.pinimg.com/736x/72/4d/6b/724d6bcd32a50ae4c74d9c8c92216bf9.jpg",
            "https://i.pinimg.com/736x/b5/e8/f4/b5e8f40f058cd41615d062827cf768ee.jpg",
            "https://i.pinimg.com/736x/cc/58/b9/cc58b9d019089db7475a60085e1b0121.jpg"
          ].map((src, i) => (
            <div 
              key={i} 
              className={i === activeSlide ? "duration-700 ease-in-out" : "hidden duration-700 ease-in-out"} 
              data-carousel-item={i === activeSlide ? "active" : ""}
            >
              <img 
                src={src} 
                className="absolute block w-full h-full object-cover object-center" 
                alt={`Slide ${i+1}`} 
              />
            </div>
          ))}
        </div>
        
        <div className="absolute z-30 flex space-x-4 -translate-x-1/2 bottom-8 left-1/2">
          {[0, 1, 2, 3, 4].map(i => (
            <button 
              key={i} 
              type="button" 
              className={`w-4 h-4 rounded-full ${i === activeSlide ? 'bg-white' : 'bg-white/70 hover:bg-white'}`} 
              aria-current={i === activeSlide ? "true" : "false"} 
              aria-label={`Slide ${i+1}`} 
              onClick={() => goToSlide(i)}
            ></button>
          ))}
        </div>
        
        <button 
          type="button" 
          className="absolute top-1/2 -translate-y-1/2 start-4 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50" 
          onClick={prevSlide}
        >
          <span className="inline-flex items-center justify-center w-8 h-8">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
            </svg>
          </span>
        </button>
        
        <button 
          type="button" 
          className="absolute top-1/2 -translate-y-1/2 end-4 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50" 
          onClick={nextSlide}
        >
          <span className="inline-flex items-center justify-center w-8 h-8">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Carousel; 
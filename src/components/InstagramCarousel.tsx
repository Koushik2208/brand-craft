import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface InstagramCarouselProps {
  slides: string[];
  topic: string;
}

export function InstagramCarousel({ slides, topic }: InstagramCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const downloadSlide = async (index: number) => {
    const slideElement = slideRefs.current[index];
    if (!slideElement) return;

    try {
      const canvas = await html2canvas(slideElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${topic.replace(/\s+/g, '-')}-slide-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Slide ${index + 1} downloaded!`);
      });
    } catch (error) {
      console.error('Error downloading slide:', error);
      toast.error('Failed to download slide');
    }
  };

  const downloadAllSlides = async () => {
    toast.info('Downloading all slides...');
    for (let i = 0; i < slides.length; i++) {
      await downloadSlide(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getBackgroundGradient = (index: number) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              ref={(el) => (slideRefs.current[index] = el)}
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: currentSlide === index ? 1 : 0,
                pointerEvents: currentSlide === index ? 'auto' : 'none',
                background: getBackgroundGradient(index),
              }}
            >
              <div className="w-full h-full flex items-center justify-center p-12">
                <div className="text-center">
                  <p className="text-white text-2xl font-bold leading-relaxed drop-shadow-lg">
                    {slide.replace(/^Slide \d+:\s*/i, '')}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === index
                    ? 'bg-white w-6'
                    : 'bg-white/50 w-1.5 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="absolute -top-3 -right-3 z-20">
          <Button
            size="sm"
            onClick={() => downloadSlide(currentSlide)}
            className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white rounded-full shadow-lg"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={downloadAllSlides}
          className="border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download All Slides ({slides.length})
        </Button>
      </div>
    </div>
  );
}

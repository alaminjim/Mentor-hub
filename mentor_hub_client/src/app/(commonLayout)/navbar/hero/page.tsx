"use client";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import img_1 from "../../../../../public/image/img-1.jpg";
import img_2 from "../../../../../public/image/img-2.jpg";
import img_3 from "../../../../../public/image/img-3.jpg";
import img_4 from "../../../../../public/image/img-4.jpg";

const slides = [{ src: img_1 }, { src: img_2 }, { src: img_3 }, { src: img_4 }];

export default function HeroCarousel() {
  return (
    <section className="relative w-full overflow-hidden mb-8 sm:mb-12 md:mb-16">
      <Carousel
        autoPlay
        infiniteLoop
        interval={4000}
        showThumbs={false}
        showStatus={false}
        swipeable
        emulateTouch
        renderArrowPrev={(clickHandler, hasPrev) =>
          hasPrev && (
            <button
              onClick={clickHandler}
              className="absolute left-2 sm:left-4 top-[35%] -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft size={28} className="text-white" />
            </button>
          )
        }
        renderArrowNext={(clickHandler, hasNext) =>
          hasNext && (
            <button
              onClick={clickHandler}
              className="absolute right-2 sm:right-4 top-[35%] -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight size={28} className="text-white" />
            </button>
          )
        }
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px]"
          >
            <Image
              src={slide.src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
      </Carousel>
    </section>
  );
}

"use client";

import Image from "next/image";
import { Star } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  image: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Israt Jahan",
    location: "Gulshan, Dhaka",
    rating: 5,
    quote:
      "Ran out of milk mid-recipe and honestly expected to just improvise. The doorbell rang before I'd finished chopping the onions. SwiftCart has genuinely changed how I plan meals — I don't stock up anymore, I just order when I need it.",
    image: "https://res.cloudinary.com/dttzvtkoo/image/upload/v1785079781/images_13_onrlkh.jpg",
  },
  {
    id: "t2",
    name: "Nusrat Jahan",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    quote:
      "I've stopped keeping a backup grocery list entirely. If SwiftCart says ten minutes, it's ten minutes — even on a rainy Tuesday evening when every other app is running two hours late.",
    image: "https://res.cloudinary.com/dttzvtkoo/image/upload/v1785078029/images_11_jkcqbv.jpg",
  },
  {
    id: "t3",
    name: "Jasika",
    location: "Banani, Dhaka",
    rating: 4,
    quote:
      "Ordered ice for a last-minute get-together, thinking it'd be a lost cause. It arrived still cold enough to matter. Small win, but that's really the whole pitch with this app.",
    image: "https://res.cloudinary.com/dttzvtkoo/image/upload/v1785078230/images_12_nt1n5t.jpg",
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating
              ? "fill-amber-500 text-amber-500"
              : "fill-transparent text-white/20"
          }
        />
      ))}
    </div>
  );
}

function TestimonialRow({
  t,
  reverse,
}: {
  t: Testimonial;
  reverse: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center gap-8 md:gap-14`}
    >
      {/* Image */}
      <div className="relative w-full max-w-[280px] aspect-[4/5] shrink-0 rounded-3xl overflow-hidden border border-white/10">
       <Image
  src={t.image}
  alt={t.name}
  fill
  unoptimized
  className="object-cover"
/>
      </div>

      {/* Text */}
      <div className="flex-1 text-center md:text-left">
        <StarRow rating={t.rating} />
        <p className="text-gray-800 text-lg sm:text-xl leading-relaxed mt-4">
          &ldquo;{t.quote}&rdquo;
        </p>
        <div className="mt-6">
          <p className=" font-semibold">{t.name}</p>
          <p className="text-gray-800 text-sm">{t.location}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className=" py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-amber-500 text-xs font-semibold tracking-[0.2em]">
            LIVE FROM DHAKA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold  mt-3">
            Every review starts with a clock.
          </h2>
          <p className="text-gray-800 mt-3 text-base sm:text-lg">
            We ask every customer one question first: how long did it take?
            Here&apos;s what they said next.
          </p>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {TESTIMONIALS.map((t, index) => (
            <TestimonialRow key={t.id} t={t} reverse={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
// app/(store)/_components/HeroBanner/BannerSlide.tsx
import Link from "next/link";

interface Props {
  title:      string;
  subtitle:   string;
  image:      string;
  link:       string;
  buttonText: string;
  active:     boolean;
}

export default function BannerSlide({ title, subtitle, image, link, buttonText, active }: Props) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-700 ${active ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
      <img src={image} alt={title} className="w-full h-full object-cover" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-lg space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base sm:text-lg text-white/80">{subtitle}</p>
            )}
            {link && (
              <Link
                href={link}
                className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-full
                  hover:bg-white/90 transition-colors text-sm"
              >
                {buttonText || "Shop Now"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
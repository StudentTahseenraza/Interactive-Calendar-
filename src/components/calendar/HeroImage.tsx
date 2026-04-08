import { MONTH_NAMES } from '@/lib/calendar-utils';
import janImg from '@/assets/months/january.jpg';
import febImg from '@/assets/months/february.jpg';
import marImg from '@/assets/months/march.jpg';
import aprImg from '@/assets/months/april.jpg';
import mayImg from '@/assets/months/may.jpg';
import junImg from '@/assets/months/june.jpg';
import julImg from '@/assets/months/july.jpg';
import augImg from '@/assets/months/august.jpg';
import sepImg from '@/assets/months/september.jpg';
import octImg from '@/assets/months/october.jpg';
import novImg from '@/assets/months/november.jpg';
import decImg from '@/assets/months/december.jpg';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroImageProps {
  year: number;
  month: number;
  direction: number;
}

const MONTH_IMAGES = [
  janImg, febImg, marImg, aprImg, mayImg, junImg,
  julImg, augImg, sepImg, octImg, novImg, decImg,
];

const HeroImage = ({ year, month, direction }: HeroImageProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-card aspect-[21/9] lg:aspect-[21/7] w-full">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.img
          key={`${year}-${month}`}
          src={MONTH_IMAGES[month]}
          alt={`${MONTH_NAMES[month]} ${year}`}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
          custom={direction}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
      <div className="absolute bottom-5 left-6 right-6">
        <motion.p
          key={`${year}-${month}-label`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl font-bold text-primary-foreground drop-shadow-lg"
        >
          {MONTH_NAMES[month]}
        </motion.p>
        <p className="font-body text-base text-primary-foreground/80 mt-1">{year}</p>
      </div>
    </div>
  );
};

export default HeroImage;
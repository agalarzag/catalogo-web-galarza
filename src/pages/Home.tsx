import Banner from '../components/home/Banner';
import CategoryGrid from '../components/home/CategoryGrid';
import BrandStrip from '../components/home/BrandStrip';

export default function Home() {
  return (
    <div className="animate-in fade-in duration-500">
      <Banner />
      <CategoryGrid />
      <BrandStrip />
    </div>
  );
}
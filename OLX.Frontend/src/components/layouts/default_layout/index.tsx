import { Header } from "./header";
import { Content } from "./content";
import { Footer } from "./footer";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { resetScroll } from "../../../redux/slices/appSlice";

const threshold = 100;

const DefaultLayout: React.FC = () => {
  const { pathname } = useLocation();
  const dispatcher = useAppDispatch()
  const scrollToTop = useAppSelector(state => state.app.scroll)
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleScroll = () => {
      const currentScrollY = containerRef.current?.scrollTop || 0;
      const scrollDiff = currentScrollY - lastScrollY.current;
      if (Math.abs(scrollDiff) >= threshold) {
        setVisible(scrollDiff < 0);
        lastScrollY.current = currentScrollY;
      }
    };
    containerRef.current?.addEventListener("scroll", handleScroll);
    return () => containerRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !scrollToTop) return;
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    dispatcher(resetScroll())
  }, [scrollToTop])

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, [pathname])
  
  return (
    <div ref={containerRef} className='w-full h-screen flex flex-col justify-stretch overflow-y-auto' >
      <Header className={`transition-all duration-700 ease-in-out ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`} />
      <Content />
      <Footer />
    </div>
  );
};

export default DefaultLayout;
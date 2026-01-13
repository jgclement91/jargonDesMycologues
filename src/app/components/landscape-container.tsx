"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";

type Props = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

const LandscapeContainer = ({ header, footer, children }: Props) => {
  const landscape = useMediaQuery("(max-height: 700px) and (orientation: landscape)");
  const [mounted, setMounted] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!landscape || !mounted) {
      setShowHeader(true);
      setShowFooter(true);
      return;
    }

    const handleScroll = () => {
      if (!scrollRef.current) return;

      const scrollY = scrollRef.current.scrollTop;
      const scrollHeight = scrollRef.current.scrollHeight;
      const clientHeight = scrollRef.current.clientHeight;

      const atTop = scrollY < 50;
      const atBottom = scrollY + clientHeight >= scrollHeight - 50;

      setShowHeader(atTop);
      setShowFooter(atBottom);

      lastScrollY.current = scrollY;
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      // Use setTimeout to ensure DOM is ready
      setTimeout(handleScroll, 100);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [landscape, mounted]);

  if (!mounted) {
    return (
      <div className="content h-full">
        <div className="overflow-y-auto h-full bg-gradient-to-b from-slate-50 to-white">
          {header}
          {children}
        </div>
        {footer}
      </div>
    );
  }

  if (!landscape) {
    return (
      <div className="content h-full">
        <div className="overflow-y-auto h-full bg-gradient-to-b from-slate-50 to-white">
          {header}
          {children}
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className="content h-full flex flex-col">
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showHeader ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {header}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white"
        style={{ minHeight: 0 }}
      >
        {children}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showFooter ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {footer}
      </div>
    </div>
  );
};

export default LandscapeContainer;



import { useEffect, useState, useRef } from 'react';

interface CounterProps {
  end: number;
  duration?: number; // duration in ms
  suffix?: string;
  prefix?: string;
}

export default function Counter({ end, duration = 1500, suffix = '', prefix = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const endValue = end;
    if (start === endValue) return;

    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * endValue);

      if (frame >= totalFrames) {
        setCount(endValue);
        clearInterval(counter);
      } else {
        setCount(currentValue);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [hasStarted, end, duration]);

  return (
    <span ref={elementRef} className="tabular-nums font-bold">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

import React, { useEffect } from 'react';

interface AdSenseAdProps {
  slot: string;
  format: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({ slot, format, className, style }) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("Erro ao carregar o AdSense:", e);
    }
  }, [slot]);

  return (
    <ins
      className={`adsbygoogle ${className || ''}`}
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-8327111075156089"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSenseAd;
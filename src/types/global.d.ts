declare module "*.css";

declare module "swiper/css";
declare module "swiper/css/navigation";
declare module "swiper/css/pagination";

export {};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
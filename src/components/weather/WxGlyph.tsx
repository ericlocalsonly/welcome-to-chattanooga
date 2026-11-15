import { Sun, Moon, CloudSun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog, Wind } from "lucide-react";
import type { WxIcon } from "@/lib/weather";
const MAP = { sun: Sun, moon: Moon, partly: CloudSun, cloud: Cloud, rain: CloudRain, storm: CloudLightning, snow: CloudSnow, fog: CloudFog, wind: Wind };
export function WxGlyph({ icon, className }: { icon: WxIcon; className?: string }) {
  const I = MAP[icon] ?? CloudSun;
  return <I aria-hidden className={className} />;
}

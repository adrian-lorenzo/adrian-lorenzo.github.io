import { useCallback, useEffect, useState } from "react";
import { VIEWPORT_FONT_CONFIG } from "../constants/animation";

export function useViewportFontSize() {
  const [fontSize, setFontSize] = useState("1.125rem");

  const calculateOptimalFontSize = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    const heightBasedSize = viewportHeight * VIEWPORT_FONT_CONFIG.viewportHeightRatio;
    const widthBasedSize = viewportWidth * VIEWPORT_FONT_CONFIG.viewportWidthRatio;
    const baseSize = Math.min(heightBasedSize, widthBasedSize);
    
    const clampedSize = Math.max(
      VIEWPORT_FONT_CONFIG.minimumFontSize,
      Math.min(VIEWPORT_FONT_CONFIG.maximumFontSize, baseSize)
    );
    
    setFontSize(`${clampedSize}px`);
  }, []);

  useEffect(() => {
    calculateOptimalFontSize();
    window.addEventListener("resize", calculateOptimalFontSize);
    return () => window.removeEventListener("resize", calculateOptimalFontSize);
  }, [calculateOptimalFontSize]);

  return fontSize;
}

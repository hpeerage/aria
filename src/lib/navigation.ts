/**
 * [ARIA] Navigation App URL Utility
 * v0.10.0
 * Handles URL scheme generation for various navigation apps.
 */

export interface NavTarget {
  name: string;
  lat: number;
  lng: number;
}

export type NavApp = 'google' | 'kakao' | 'naver' | 'tmap';

export const getNavURL = (app: NavApp, target: NavTarget): string => {
  const { name, lat, lng } = target;
  const encodedName = encodeURIComponent(name);

  switch (app) {
    case 'kakao':
      // KakaoNavi uses WGS84 for JavaScript-based calls
      return `kakaonavi://navigate?name=${encodedName}&coordType=wgs84&x=${lng}&y=${lat}`;
    
    case 'naver':
      return `nmap://navigation?dlat=${lat}&dlng=${lng}&dname=${encodedName}&appname=com.hpeerage.aria`;
    
    case 'tmap':
      // TMap uses goalx (lng) and goaly (lat)
      return `tmap://route?goalname=${encodedName}&goalx=${lng}&goaly=${lat}`;
    
    case 'google':
    default:
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
};

export const openNavApp = (app: NavApp, target: NavTarget) => {
  const url = getNavURL(app, target);
  
  if (app === 'google') {
    window.open(url, '_blank');
    return;
  }

  // Mobile App Schemes might fail if app not installed.
  // We can attempt a fallback, but browser-to-app behavior varies.
  window.location.href = url;
};

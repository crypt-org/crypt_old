const MOBILE_VIEW_WIDTH: number = 934;

export function isMobileView(): boolean {
  return window.innerWidth <= MOBILE_VIEW_WIDTH;
}
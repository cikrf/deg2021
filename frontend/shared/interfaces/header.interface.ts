import { UrlSegment } from '@angular/router';

export enum PageType {
  Default,
  Service,
}
export interface Header {
  title: string;
  subtitle?: string;
  link?: string | string[] | UrlSegment | UrlSegment[];
  isShow?: boolean;
  pageType?: PageType;
}

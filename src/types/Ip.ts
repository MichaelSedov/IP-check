export interface IpRow {
  address: string;
  loading: boolean;
  location: string | null;
  localTime: string | null;
  countryCode: string | null;
  error?: string | null;
  intervalId?: number | null;
}
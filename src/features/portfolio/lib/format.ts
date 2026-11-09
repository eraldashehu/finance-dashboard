import dayjs from 'dayjs';

const eur0 = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 });

export const money = (n: number): string => eur0.format(n);
export const money2 = (n: number): string => eur2.format(n);
export const moneyShort = (n: number): string => `€${compact.format(n)}`;
export const pct = (n: number, digits = 1): string => `${n > 0 ? '+' : ''}${n.toFixed(digits)}%`;
export const shortDate = (iso: string): string => dayjs(iso).format('D MMM');
export const longDate = (iso: string): string => dayjs(iso).format('D MMM YYYY');

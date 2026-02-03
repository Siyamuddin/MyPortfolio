export interface Theme {
  bg: string;
  bgLight: string;
  primary: string;
  text_primary: string;
  text_secondary: string;
  card: string;
  card_light?: string;
  button: string;
  white?: string;
  black?: string;
  text_black?: string;
}

export type ThemeMode = 'light' | 'dark';

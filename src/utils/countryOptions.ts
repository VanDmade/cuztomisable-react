// utils/countryOptions.ts
import { DropdownOption } from '../components/form/Dropdown';

type RawCountry = {
  label: string;
  code: string;
  dialCode: number;
};

export function countryOptions<T = number>(countries: RawCountry[]): DropdownOption<T>[] {
  return countries.map((c) => ({
    label: c.label,
    description: c.code,
    rightText: `+${c.dialCode}`,
    selectedText: `+${c.dialCode}`,
    value: String(c.dialCode) as T,
  }));
}

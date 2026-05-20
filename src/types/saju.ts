export type SajuFormPayload = {
  name: string;
  gender: "남" | "여";
  birthDate: string;
  birthTime: string;
  isTimeUnknown: boolean;
};

export type SajuFormInput = {
  name: string;
  gender: "남" | "여";
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthTime: string;
  isTimeUnknown: boolean;
};

export function toSajuFormPayload(data: SajuFormInput): SajuFormPayload {
  return {
    name: data.name,
    gender: data.gender,
    birthDate: `${data.birthYear}-${String(data.birthMonth).padStart(2, "0")}-${String(data.birthDay).padStart(2, "0")}`,
    birthTime: data.birthTime,
    isTimeUnknown: data.isTimeUnknown,
  };
}

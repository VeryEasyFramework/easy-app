import { EasyFieldType } from "../../../../../vef-types/mod.ts";

export function isDifferent(
  fieldType: EasyFieldType,
  oldValue: any,
  newValue: any,
) {
  switch (fieldType) {
    case "ListField":
      return JSON.stringify(oldValue) !== JSON.stringify(newValue);
    case "DataField":
    case "TextField":
      console.log(fieldType);
      console.log(oldValue, newValue);
      return oldValue !== newValue;
    default:
      if (oldValue === newValue) {
        return false;
      }
  }

  return true;
}

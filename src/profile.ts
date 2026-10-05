export type Profile = {
  name: string;
  goals: string[];
  language: string;
  level: string;
  minutes: string;
  complete: boolean;
  lessons: number;
};
const defaultProfile: Profile = {
  name: "",
  goals: [],
  language: "Arabic",
  level: "Just starting",
  minutes: "5 minutes",
  complete: false,
  lessons: 0,
};
export function readProfile(): Profile {
  try {
    const value = JSON.parse(localStorage.getItem("shams-profile") || "null");
    return value && typeof value.name === "string"
      ? { ...defaultProfile, ...value }
      : defaultProfile;
  } catch {
    return defaultProfile;
  }
}
export function saveProfile(profile: Profile) {
  try {
    localStorage.setItem("shams-profile", JSON.stringify(profile));
  } catch {
    /* Preview remains usable when browser storage is unavailable. */
  }
}

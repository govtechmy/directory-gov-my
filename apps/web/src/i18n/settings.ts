export const fallbackLng = "en-GB"
export const languages = [fallbackLng, "ms-MY"]
export const defaultNS = "common"
export const cookieName = "i18next"

export function getOptions (lng = fallbackLng, ns: string | string[] = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}
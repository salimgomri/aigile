/** Année de début de carrière terrain de Salim Gomri — source unique pour tout le site. */
export const SALIM_CAREER_START_YEAR = 2003

export function getSalimYearsExperience(referenceDate = new Date()): number {
  return referenceDate.getFullYear() - SALIM_CAREER_START_YEAR
}

export function salimYearsTerrainFr(years = getSalimYearsExperience()): string {
  return `${years} ans de terrain`
}

export function salimYearsTerrainEn(years = getSalimYearsExperience()): string {
  return `${years} years in the field`
}

export function salimYearsExperienceFr(years = getSalimYearsExperience()): string {
  return `${years} ans d'expérience terrain`
}

export function salimYearsExperienceEn(years = getSalimYearsExperience()): string {
  return `${years} years of field experience`
}

export function salimYearsExpertiseFr(years = getSalimYearsExperience()): string {
  return `${years} ans expertise Agile`
}

export function salimYearsExpertiseEn(years = getSalimYearsExperience()): string {
  return `${years} years Agile expertise`
}

export function salimYearsExpertiseSalimFr(years = getSalimYearsExperience()): string {
  return `${years} ans expertise Salim Gomri`
}

export function salimJobTitleFr(years = getSalimYearsExperience()): string {
  return `Agile Coach · ${years} ans expérience`
}

export function getBookDescription(lang: 'fr' | 'en', years = getSalimYearsExperience()): string {
  if (lang === 'fr') {
    return `Le premier guide complet pour implémenter l'Agile augmenté par l'IA dans votre organisation. ${years} ans d'expérience terrain distillés en un système actionnable.`
  }
  return `The first comprehensive guide to implementing AI-augmented Agile in your organization. ${years} years of field experience distilled into an actionable system.`
}

export function getHeroBookSlideBody(lang: 'fr' | 'en', years = getSalimYearsExperience()): string {
  if (lang === 'fr') {
    return `Le premier guide complet pour implémenter le Scrum augmenté par l'IA dans votre équipe. ${years} ans de terrain, condensés en un système actionnable.`
  }
  return `The first complete guide to implementing AI-augmented Scrum in your team. ${years} years in the field, distilled into an actionable system.`
}

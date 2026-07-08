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

export function getAboutBioHtml(lang: 'fr' | 'en', years = getSalimYearsExperience()): string {
  if (lang === 'fr') {
    return `Avec <strong>${years} années</strong> d'expérience dans l'accompagnement de la transformation digitale, Salim apporte une vision révolutionnaire à l'industrie : « Les entreprises qui prospèrent ne sont pas les plus « agiles » ou les plus « expertes en IA » : elles sont AIgile. » Son travail fait le pont entre les méthodologies agiles traditionnelles et la réalité augmentée par l'IA des équipes de développement modernes.`
  }
  return `With <strong>${years} years</strong> of experience coaching digital transformation, Salim brings a revolutionary insight to the industry: "The companies who thrive aren't the most 'agile' or the most 'AI-savvy': they're AIgile." His work bridges the gap between traditional agile methodologies and the AI-enhanced reality of modern development teams.`
}

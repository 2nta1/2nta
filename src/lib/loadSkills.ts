export interface SkillGroups { tech: string[]; languages: string[]; soft: string[]; }

export async function loadFullSkills(): Promise<Record<string, SkillGroups>> {
  try {
    const res = await fetch('/skills-full.json');
    if (!res.ok) throw new Error('failed');
    return (await res.json()) as Record<string, SkillGroups>;
  } catch {
    return {};
  }
}

export const registerCategories = ['folk','traditional','ensemble','opera','narrative','dance','oral','craft'];
export const registerSources = {
  2006: 'https://www.ihchina.cn/zhengce_details/11546',
  2008: 'https://www.ihchina.cn/zhengce_details/11664.html',
  2011: 'https://www.ihchina.cn/zhengce_details/11663',
  2014: 'https://www.ihchina.cn/zhengce_details/11662.html',
  2021: 'https://www.gov.cn/gbgl/92e7fad3d97742f1b1b2beb1fda9c049/files/8525ced0638e4480a1368790d9433924.pdf',
};

export function buildRegistry(registry, origins) {
  const entries = registry.registrations.map(entry => {
    const origin = origins[entry.code];
    return {
      ...entry,
      aliases: [entry.pinyin, entry.code, ...Object.values(entry.applicant),
        ...entry.regions.flatMap(region => Object.values(registry.regions[region].name))],
      origin,
      time: origin?.time || null,
      location: origin?.location || null,
      registered: true,
    };
  });
  const projects = new Map();
  for (const entry of entries) {
    if (entry.origin && !projects.has(entry.code)) projects.set(entry.code,entry);
  }
  return {entries, datedProjects:[...projects.values()], regions:registry.regions};
}

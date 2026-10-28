import { MetadataRoute } from 'next';

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

// Only public, indexable content pages. Account and tracking pages
// (/connexion, /inscription, /suivi, /dashboard, /admin) are noindex.
const pages: Entry[] = [
  { path: '', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/reserver', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/services/transport-aeroportuaire', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/services/transport-medical', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/services/occasions-personnelles', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/estimation-tarif', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/tarifs', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/guides/transport-cpam', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/guides/comment-reserver', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/legal/conditions', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/legal/confidentialite', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://taxi-leblanc.fr';
  const lastModified = new Date();

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

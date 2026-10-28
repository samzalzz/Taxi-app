import { MetadataRoute } from 'next';

const baseUrl = 'https://taxi-leblanc.fr';

// Pages publiques indexables uniquement.
// Exclues volontairement : /connexion, /inscription, /suivi (noindex),
// /legal/* (noindex), /dashboard, /admin, /api.
const pages: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/reserver', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/services/transport-aeroportuaire', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/services/transport-medical', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/services/occasions-personnelles', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/estimation-tarif', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/tarifs', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/guides/transport-cpam', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/guides/comment-reserver', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

import type { MetadataRoute } from 'next';
import { projects, getProjectSlug } from '@/data/projects';
import { SITE_URL, getIndexablePaths } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return getIndexablePaths().map((path) => {
    const priority =
      path === '/'
        ? 1
        : path.startsWith('/projects/') && path !== '/projects'
          ? 0.85
          : path === '/projects'
            ? 0.9
            : 0.75;

    const changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] =
      path === '/' ? 'weekly' : path.startsWith('/projects/') ? 'monthly' : 'monthly';

    let lastModified = now;
    if (path.startsWith('/projects/')) {
      const slug = path.replace('/projects/', '');
      const project = projects.find((item) => getProjectSlug(item) === slug);
      if (project?.lastUpdated) {
        lastModified = new Date(project.lastUpdated);
      }
    }

    return {
      url: new URL(path, SITE_URL).toString(),
      lastModified,
      changeFrequency,
      priority,
    };
  });
}

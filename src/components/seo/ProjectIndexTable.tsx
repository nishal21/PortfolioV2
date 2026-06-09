import Link from 'next/link';
import { seoProjectRows } from '@/data/seo-content';
import { CREATOR_NAME } from '@/lib/seo';

export default function ProjectIndexTable() {
  return (
    <div className="studio-seo-table-wrap">
      <table className="studio-seo-table">
        <caption className="sr-only">Projects by {CREATOR_NAME}</caption>
        <thead>
          <tr>
            <th scope="col">Project</th>
            <th scope="col">Category</th>
            <th scope="col">Status</th>
            <th scope="col">Portfolio page</th>
          </tr>
        </thead>
        <tbody>
          {seoProjectRows.map((row) => (
            <tr key={row.slug}>
              <th scope="row">{row.name}</th>
              <td>{row.category}</td>
              <td>{row.status}</td>
              <td>
                <Link href={`/projects/${row.slug}`} className="text-[var(--studio-accent)] hover:underline">
                  /projects/{row.slug}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

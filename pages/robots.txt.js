export async function getServerSideProps({ res }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /client/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
}

export default function RobotsTxt() {
  return null;
} 
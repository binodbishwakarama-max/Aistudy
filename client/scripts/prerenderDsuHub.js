/**
 * DSU Hub Static Prerendering Script
 *
 * Runs at build time after `vite build` to generate fully rendered,
 * content-rich static HTML files for every DSU Hub route:
 * - /dsu-hub
 * - /dsu-hub/[branch]
 * - /dsu-hub/[branch]/[semester]
 * - /dsu-hub/[branch]/[semester]/[subject]
 *
 * Each generated HTML file contains pre-baked <title>, <meta description>,
 * canonical tags, Open Graph / Twitter tags, JSON-LD structured data,
 * and the complete semantic HTML content inside <div id="root">.
 *
 * This ensures 100% crawlability and instant indexing for Googlebot on first byte!
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DSU_BRANCHES } from '../src/data/dsuHubData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.resolve(DIST_DIR, 'index.html');
const SITEMAP_PATH = path.resolve(DIST_DIR, 'sitemap.xml');
const PUBLIC_SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');
const BASE_URL = 'https://www.mindflowlearn.co.in';

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error(`❌ Template not found at ${TEMPLATE_PATH}. Run 'vite build' first.`);
  process.exit(1);
}

const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

const sitemapUrls = [
  { url: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
  { url: `${BASE_URL}/dsu-hub`, priority: '0.9', changefreq: 'daily' },
  { url: `${BASE_URL}/demo`, priority: '0.8', changefreq: 'weekly' },
  { url: `${BASE_URL}/privacy`, priority: '0.3', changefreq: 'monthly' },
  { url: `${BASE_URL}/terms`, priority: '0.3', changefreq: 'monthly' },
];

function generateHtml({ title, description, canonicalUrl, ogType = 'website', jsonLd, bodyContent }) {
  let html = templateHtml;

  // 1. Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

  // 2. Replace or inject Meta Description
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${description}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${description}" />\n</head>`);
  }

  // 3. Inject / Replace Canonical Tag
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // 4. Inject OpenGraph & Twitter tags
  const ogTags = `
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:image" content="${BASE_URL}/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${BASE_URL}/og-image.png" />
  ${jsonLd ? `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>` : ''}
`;
  html = html.replace('</head>', `${ogTags}\n</head>`);

  // 5. Inject Pre-rendered Body Content inside <div id="root">
  html = html.replace(
    /<div id="root">.*?<\/div>/s,
    `<div id="root">${bodyContent}</div>`
  );

  return html;
}

function writeStaticRoute(routePath, html) {
  const targetDir = path.join(DIST_DIR, routePath);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
}

console.log('⚡ Starting DSU Hub Static HTML Prerendering...');
let prerenderedCount = 0;

// =========================================================================
// 1. Prerender Root /dsu-hub
// =========================================================================
{
  const title = 'DSU Hub — Previous Year Question Papers & Exam Notes | MindFlow';
  const description = 'Free branch-wise previous year question papers (PYQs), passing strategies, and high-yield module guidance for Dayananda Sagar University (DSU) engineering students.';
  const canonicalUrl = `${BASE_URL}/dsu-hub`;

  const bodyContent = `
  <div style="max-width: 1000px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
    <div style="margin-bottom: 24px;">
      <span style="background: rgba(37,99,235,0.1); color: #2563eb; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;">🎓 Dayananda Sagar University Archive</span>
      <span style="background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; margin-left: 8px; text-transform: uppercase;">Beta v1.0</span>
      <h1 style="font-size: 32px; font-weight: 800; margin-top: 12px; color: #0f172a;">DSU Question Papers &amp; Exam Notes <span style="font-size: 14px; background: #2563eb; color: #ffffff; padding: 2px 8px; border-radius: 6px; vertical-align: super;">BETA</span></h1>
      <p style="color: #64748b; font-size: 15px; max-width: 700px; line-height: 1.6;">
        Free, unblocked access to branch-wise previous year question papers (PYQs), passing strategies, and high-yield module guidance for DSU engineering semesters.
      </p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 16px; font-size: 12px; color: #64748b; margin-top: 12px;">
        💡 <strong>Beta Notice:</strong> Exam guidance notes &amp; high-yield syllabus breakdowns are live. Additional previous year question paper PDFs are actively being added.
      </div>
    </div>

    <h2 style="font-size: 20px; font-weight: 700; margin-top: 32px; margin-bottom: 16px;">Engineering Branches (${DSU_BRANCHES.length})</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
      ${DSU_BRANCHES.map((b) => `
        <div style="border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: 700; color: #2563eb; font-size: 12px;">${b.shortName}</span>
            <span style="font-size: 11px; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; color: #475569;">${b.badge || 'Core'}</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 8px 0;">
            <a href="/dsu-hub/${b.slug}" style="color: #0f172a; text-decoration: none;">${b.name}</a>
          </h3>
          <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0 0 16px 0;">${b.description}</p>
          <a href="/dsu-hub/${b.slug}" style="font-size: 12px; font-weight: 600; color: #2563eb; text-decoration: none;">Browse Semesters →</a>
        </div>
      `).join('')}
    </div>
  </div>
  `;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'DSU Hub - Dayananda Sagar University Question Paper Archive',
    url: canonicalUrl,
    description,
    provider: {
      '@type': 'SoftwareApplication',
      name: 'MindFlow',
      url: BASE_URL,
    },
  };

  const html = generateHtml({ title, description, canonicalUrl, jsonLd, bodyContent });
  writeStaticRoute('dsu-hub', html);
  prerenderedCount++;
}

// =========================================================================
// 2. Iterate Branches, Semesters & Subjects
// =========================================================================
for (const branch of DSU_BRANCHES) {
  // A. Branch Landing Page
  const branchUrl = `${BASE_URL}/dsu-hub/${branch.slug}`;
  sitemapUrls.push({ url: branchUrl, priority: '0.8', changefreq: 'weekly' });

  const branchTitle = `${branch.name} (${branch.shortName}) Question Papers & Notes — DSU Hub | MindFlow`;
  const branchDesc = `Dayananda Sagar University ${branch.name} previous year question papers (PYQs), semester-wise notes, and passing strategies.`;

  const branchBody = `
  <div style="max-width: 1000px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
    <nav style="font-size: 12px; color: #64748b; margin-bottom: 16px;">
      <a href="/dsu-hub" style="color: #2563eb; text-decoration: none;">DSU Hub</a> &gt; <span>${branch.shortName}</span>
    </nav>
    <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${branch.name}</h1>
    <p style="color: #64748b; font-size: 14px; margin-bottom: 32px; line-height: 1.6;">${branch.description} Select your semester below:</p>

    <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">Semesters</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
      ${branch.semesters.map((s) => `
        <div style="border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; background: #ffffff;">
          <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 8px 0;">
            <a href="/dsu-hub/${branch.slug}/${s.number}" style="color: #0f172a; text-decoration: none;">Semester ${s.number}</a>
          </h3>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 12px 0;">${s.subjects.length} Subjects Available</p>
          <a href="/dsu-hub/${branch.slug}/${s.number}" style="font-size: 12px; font-weight: 600; color: #2563eb; text-decoration: none;">View Subjects &amp; Papers →</a>
        </div>
      `).join('')}
    </div>
  </div>
  `;

  writeStaticRoute(`dsu-hub/${branch.slug}`, generateHtml({
    title: branchTitle,
    description: branchDesc,
    canonicalUrl: branchUrl,
    bodyContent: branchBody,
  }));
  prerenderedCount++;

  // B. Semesters
  for (const sem of branch.semesters) {
    const semUrl = `${BASE_URL}/dsu-hub/${branch.slug}/${sem.number}`;
    sitemapUrls.push({ url: semUrl, priority: '0.8', changefreq: 'weekly' });

    const semTitle = `Semester ${sem.number} ${branch.shortName} PYQs & Notes — Dayananda Sagar University | DSU Hub`;
    const semDesc = `Semester ${sem.number} question papers and exam study guides for ${branch.name} at DSU. Includes ${sem.subjects.map((s) => s.code).join(', ')}.`;

    const semBody = `
    <div style="max-width: 1000px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
      <nav style="font-size: 12px; color: #64748b; margin-bottom: 16px;">
        <a href="/dsu-hub" style="color: #2563eb; text-decoration: none;">DSU Hub</a> &gt;
        <a href="/dsu-hub/${branch.slug}" style="color: #2563eb; text-decoration: none;">${branch.shortName}</a> &gt;
        <span>Semester ${sem.number}</span>
      </nav>
      <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
        ${branch.name} — Semester ${sem.number} Question Papers
      </h1>
      <p style="color: #64748b; font-size: 14px; margin-bottom: 32px; line-height: 1.6;">
        All subjects, exam patterns, and previous year mid-term and end-sem question papers for DSU Semester ${sem.number}.
      </p>

      <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">Subjects (${sem.subjects.length})</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        ${sem.subjects.map((sub) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; background: #ffffff;">
            <div style="font-size: 12px; font-weight: 700; color: #2563eb; margin-bottom: 4px;">${sub.code} • ${sub.credits} Credits</div>
            <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 8px 0;">
              <a href="/dsu-hub/${branch.slug}/${sem.number}/${sub.slug}" style="color: #0f172a; text-decoration: none;">${sub.name}</a>
            </h3>
            ${sub.guidance ? `<p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0 0 12px 0;">${sub.guidance.notes}</p>` : ''}
            <a href="/dsu-hub/${branch.slug}/${sem.number}/${sub.slug}" style="font-size: 12px; font-weight: 600; color: #2563eb; text-decoration: none;">View Question Papers &amp; Guidance →</a>
          </div>
        `).join('')}
      </div>
    </div>
    `;

    writeStaticRoute(`dsu-hub/${branch.slug}/${sem.number}`, generateHtml({
      title: semTitle,
      description: semDesc,
      canonicalUrl: semUrl,
      bodyContent: semBody,
    }));
    prerenderedCount++;

    // C. Subject Pages
    for (const sub of sem.subjects) {
      const subUrl = `${BASE_URL}/dsu-hub/${branch.slug}/${sem.number}/${sub.slug}`;
      sitemapUrls.push({ url: subUrl, priority: '0.9', changefreq: 'weekly' });

      const yearsList = sub.pyqs && sub.pyqs.length > 0
        ? [...new Set(sub.pyqs.map((p) => p.year))].sort((a, b) => b - a).join(', ')
        : 'recent years';

      const subTitle = `${sub.name} (${sub.code}) PYQs — ${branch.shortName} Semester ${sem.number} | DSU Hub | MindFlow`;
      const subDesc = `Previous year question papers for ${sub.name} (${sub.code}, ${branch.shortName} Semester ${sem.number}) at Dayananda Sagar University. Includes ${yearsList} + exam guidance.`;

      const subBody = `
      <div style="max-width: 1000px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
        <nav style="font-size: 12px; color: #64748b; margin-bottom: 16px;">
          <a href="/dsu-hub" style="color: #2563eb; text-decoration: none;">DSU Hub</a> &gt;
          <a href="/dsu-hub/${branch.slug}" style="color: #2563eb; text-decoration: none;">${branch.shortName}</a> &gt;
          <a href="/dsu-hub/${branch.slug}/${sem.number}" style="color: #2563eb; text-decoration: none;">Semester ${sem.number}</a> &gt;
          <span>${sub.code}</span>
        </nav>

        <div style="margin-bottom: 24px;">
          <span style="background: rgba(37,99,235,0.1); color: #2563eb; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; font-family: monospace;">${sub.code}</span>
          <span style="font-size: 12px; color: #64748b; margin-left: 8px;">Dayananda Sagar University • ${branch.name} (Semester ${sem.number})</span>
          <h1 style="font-size: 30px; font-weight: 800; color: #0f172a; margin-top: 8px;">${sub.name}</h1>
        </div>

        ${sub.guidance ? `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
            <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px;">💡 DSU Exam Strategy &amp; Guidance</h2>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 16px;">${sub.guidance.notes}</p>
            ${sub.guidance.passingTips ? `
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px 16px; font-size: 13px; color: #166534; margin-bottom: 16px;">
                <strong>High-Yield Passing Strategy:</strong> ${sub.guidance.passingTips}
              </div>
            ` : ''}
            ${sub.guidance.highYieldTopics && sub.guidance.highYieldTopics.length > 0 ? `
              <div style="margin-top: 16px;">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 8px;">Most Repeated Question Topics:</span>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${sub.guidance.highYieldTopics.map((t) => `<span style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px 10px; font-size: 12px; color: #334155;">${t}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">📄 Previous Year Question Papers (${sub.pyqs ? sub.pyqs.length : 0})</h2>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px;">
          ${(sub.pyqs || []).map((p) => `
            <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #ffffff; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 2px 8px; border-radius: 4px;">${p.examType.toUpperCase()} • ${p.year}</span>
                <h3 style="font-size: 15px; font-weight: 700; margin: 4px 0 0 0; color: #0f172a;">${p.title}</h3>
              </div>
              <a href="${p.fileUrl}" target="_blank" rel="noopener noreferrer" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600;">View PDF ↗</a>
            </div>
          `).join('')}
        </div>

        <div style="background: linear-gradient(135deg, #eff6ff, #f8fafc); border: 1px solid #bfdbfe; border-radius: 16px; padding: 24px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 4px 0; color: #1e3a8a;">Turn ${sub.code} Notes into AI Flashcards</h3>
            <p style="font-size: 13px; color: #3b82f6; margin: 0;">Upload your ${sub.name} lecture slides to generate spaced repetition study cards in seconds.</p>
          </div>
          <a href="/register?subject=${encodeURIComponent(sub.code)}" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; white-space: nowrap;">Start Free →</a>
        </div>
      </div>
      `;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: sub.name,
        courseCode: sub.code,
        description: subDesc,
        provider: {
          '@type': 'CollegeOrUniversity',
          name: 'Dayananda Sagar University (DSU)',
          sameAs: 'https://www.dsu.edu.in',
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'Blended',
        },
      };

      writeStaticRoute(`dsu-hub/${branch.slug}/${sem.number}/${sub.slug}`, generateHtml({
        title: subTitle,
        description: subDesc,
        canonicalUrl: subUrl,
        jsonLd,
        bodyContent: subBody,
      }));
      prerenderedCount++;
    }
  }
}

// =========================================================================
// 3. Generate Complete Sitemap XML
// =========================================================================
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${item.changefreq || 'weekly'}</changefreq>
    <priority>${item.priority || '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(SITEMAP_PATH, sitemapXml, 'utf-8');
fs.writeFileSync(PUBLIC_SITEMAP_PATH, sitemapXml, 'utf-8');

console.log('======================================================');
console.log(`✅ Prerendered ${prerenderedCount} static HTML pages for DSU Hub!`);
console.log(`✅ Generated dynamic sitemap with ${sitemapUrls.length} indexed URLs at ${SITEMAP_PATH}`);
console.log('======================================================\n');

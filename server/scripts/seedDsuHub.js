/**
 * DSU Hub Database Seeder Script
 * Inserts branches, semesters, subjects, guidance notes, and sample PYQ records
 * into Supabase PostgreSQL tables using the service role key.
 *
 * Usage:
 *   npm run seed:dsu-hub
 *   or: node scripts/seedDsuHub.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const { DSU_BRANCHES } = require('../data/dsuHubData');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in server/.env to seed database.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDsuHub() {
  console.log('🚀 Starting DSU Hub database seeding...');
  console.log(`📦 Loaded ${DSU_BRANCHES.length} branches from dataset.`);

  let totalBranches = 0;
  let totalSemesters = 0;
  let totalSubjects = 0;
  let totalPyqs = 0;
  let totalGuidance = 0;

  for (const branchData of DSU_BRANCHES) {
    // 1. Upsert Branch
    const { data: branch, error: branchError } = await supabase
      .from('branches')
      .upsert(
        {
          name: branchData.name,
          slug: branchData.slug,
          description: branchData.description,
        },
        { onConflict: 'slug' }
      )
      .select()
      .single();

    if (branchError) {
      console.error(`❌ Failed to upsert branch ${branchData.name}:`, branchError.message);
      continue;
    }
    totalBranches++;
    console.log(`  🏢 Branch [${branchData.shortName}]: ${branchData.name}`);

    // 2. Iterate Semesters
    for (const semData of branchData.semesters) {
      const { data: semester, error: semError } = await supabase
        .from('semesters')
        .upsert(
          {
            branch_id: branch.id,
            number: semData.number,
          },
          { onConflict: 'branch_id,number' }
        )
        .select()
        .single();

      if (semError) {
        console.error(`    ❌ Failed to upsert semester ${semData.number}:`, semError.message);
        continue;
      }
      totalSemesters++;

      // 3. Iterate Subjects
      for (const subData of semData.subjects) {
        const { data: subject, error: subError } = await supabase
          .from('subjects')
          .upsert(
            {
              semester_id: semester.id,
              name: subData.name,
              code: subData.code,
              slug: subData.slug,
              credits: subData.credits || 4,
            },
            { onConflict: 'semester_id,code' }
          )
          .select()
          .single();

        if (subError) {
          console.error(`      ❌ Failed to upsert subject ${subData.code}:`, subError.message);
          continue;
        }
        totalSubjects++;

        // 4. Upsert Guidance Notes
        if (subData.guidance) {
          const { error: guidanceError } = await supabase
            .from('subject_guidance')
            .upsert(
              {
                subject_id: subject.id,
                notes: subData.guidance.notes,
                passing_tips: subData.guidance.passingTips,
                high_yield_topics: subData.guidance.highYieldTopics,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'subject_id' }
            );

          if (guidanceError) {
            console.error(`        ⚠️ Guidance notes error for ${subData.code}:`, guidanceError.message);
          } else {
            totalGuidance++;
          }
        }

        // 5. Upsert PYQ records
        if (subData.pyqs && subData.pyqs.length > 0) {
          for (const pyqData of subData.pyqs) {
            const { error: pyqError } = await supabase
              .from('pyqs')
              .upsert(
                {
                  subject_id: subject.id,
                  year: pyqData.year,
                  exam_type: pyqData.examType,
                  title: pyqData.title,
                  file_url: pyqData.fileUrl,
                }
              );

            if (pyqError) {
              console.error(`        ⚠️ PYQ error for ${subData.code} (${pyqData.year}):`, pyqError.message);
            } else {
              totalPyqs++;
            }
          }
        }
      }
    }
  }

  console.log('\n======================================================');
  console.log('✅ DSU Hub Seeding Complete!');
  console.log(`   🏢 Branches seeded: ${totalBranches}`);
  console.log(`   📚 Semesters linked: ${totalSemesters}`);
  console.log(`   📖 Subjects created: ${totalSubjects}`);
  console.log(`   💡 Guidance notes: ${totalGuidance}`);
  console.log(`   📄 PYQ papers linked: ${totalPyqs}`);
  console.log('======================================================\n');
}

seedDsuHub().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});

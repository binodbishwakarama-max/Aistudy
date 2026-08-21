const express = require('express');
const { DSU_BRANCHES } = require('../data/dsuHubData');
const supabase = require('../utils/db');
const { logger } = require('../utils/logger');

const router = express.Router();

// Helper to look up branch in memory
const findBranch = (slug) => DSU_BRANCHES.find((b) => b.slug.toLowerCase() === (slug || '').toLowerCase());

// 1. GET all branches
router.get('/branches', async (_req, res) => {
  try {
    // Attempt to query Supabase if populated, else return static seed data
    if (supabase) {
      const { data, error } = await supabase.from('branches').select('*').order('name');
      if (!error && data && data.length > 0) {
        return res.json({ branches: data, source: 'database' });
      }
    }

    const branches = DSU_BRANCHES.map((b) => ({
      name: b.name,
      shortName: b.shortName,
      slug: b.slug,
      codePrefix: b.codePrefix,
      description: b.description,
      badge: b.badge,
      totalSemesters: b.semesters.length,
      totalSubjects: b.semesters.reduce((acc, s) => acc + s.subjects.length, 0),
    }));

    res.json({ branches, source: 'static' });
  } catch (error) {
    logger.error('Error fetching DSU branches', { reason: error.message });
    res.status(500).json({ error: 'Failed to retrieve DSU branches.' });
  }
});

// 2. GET branch details & semesters
router.get('/:branchSlug', async (req, res) => {
  try {
    const { branchSlug } = req.params;
    const branch = findBranch(branchSlug);

    if (!branch) {
      return res.status(404).json({ error: `Branch '${branchSlug}' not found.` });
    }

    const payload = {
      ...branch,
      semesters: branch.semesters.map((s) => ({
        number: s.number,
        subjectCount: s.subjects.length,
        subjects: s.subjects.map((sub) => ({
          name: sub.name,
          code: sub.code,
          slug: sub.slug,
          credits: sub.credits,
          pyqCount: sub.pyqs ? sub.pyqs.length : 0,
          hasGuidance: Boolean(sub.guidance),
        })),
      })),
    };

    res.json({ branch: payload });
  } catch (error) {
    logger.error('Error fetching branch details', { reason: error.message });
    res.status(500).json({ error: 'Failed to retrieve branch details.' });
  }
});

// 3. GET semester subjects
router.get('/:branchSlug/:semesterNum', async (req, res) => {
  try {
    const { branchSlug, semesterNum } = req.params;
    const branch = findBranch(branchSlug);

    if (!branch) {
      return res.status(404).json({ error: `Branch '${branchSlug}' not found.` });
    }

    const num = parseInt(semesterNum, 10);
    const semester = branch.semesters.find((s) => s.number === num);

    if (!semester) {
      return res.status(404).json({ error: `Semester ${semesterNum} for '${branch.name}' not found.` });
    }

    res.json({
      branch: {
        name: branch.name,
        shortName: branch.shortName,
        slug: branch.slug,
      },
      semester: {
        number: semester.number,
        subjects: semester.subjects.map((sub) => ({
          name: sub.name,
          code: sub.code,
          slug: sub.slug,
          credits: sub.credits,
          pyqCount: sub.pyqs ? sub.pyqs.length : 0,
          hasGuidance: Boolean(sub.guidance),
        })),
      },
    });
  } catch (error) {
    logger.error('Error fetching semester subjects', { reason: error.message });
    res.status(500).json({ error: 'Failed to retrieve semester subjects.' });
  }
});

// 4. GET subject details, guidance notes & PYQs
router.get('/:branchSlug/:semesterNum/:subjectCode', async (req, res) => {
  try {
    const { branchSlug, semesterNum, subjectCode } = req.params;
    const branch = findBranch(branchSlug);

    if (!branch) {
      return res.status(404).json({ error: `Branch '${branchSlug}' not found.` });
    }

    const num = parseInt(semesterNum, 10);
    const semester = branch.semesters.find((s) => s.number === num);

    if (!semester) {
      return res.status(404).json({ error: `Semester ${semesterNum} not found.` });
    }

    const target = subjectCode.toLowerCase();
    const subject = semester.subjects.find(
      (s) => s.code.toLowerCase() === target || s.slug.toLowerCase() === target
    );

    if (!subject) {
      return res.status(404).json({ error: `Subject '${subjectCode}' not found.` });
    }

    res.json({
      branch: {
        name: branch.name,
        shortName: branch.shortName,
        slug: branch.slug,
      },
      semester: {
        number: semester.number,
      },
      subject,
    });
  } catch (error) {
    logger.error('Error fetching subject details', { reason: error.message });
    res.status(500).json({ error: 'Failed to retrieve subject details.' });
  }
});

module.exports = router;

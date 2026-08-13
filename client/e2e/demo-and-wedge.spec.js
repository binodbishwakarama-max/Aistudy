import { test, expect } from '@playwright/test';

test.describe('MindFlow wedge + demo loop', () => {
  test('landing shows active recall positioning', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Structured Active Recall for Complex Coursework.' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Try Live Demo Deck/i }).first()).toBeVisible();
  });

  test('demo mode loads flashcards without signup', async ({ page }) => {
    await page.goto('/demo/flashcards');
    await expect(page.getByTestId('flashcard-question')).toHaveText('What is the CAP theorem?');
  });

  test('demo flashcard flip and rate flow', async ({ page }) => {
    await page.goto('/demo/flashcards');
    await expect(page.getByTestId('flashcard-question')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(page.getByText('Consistency, Availability, and Partition tolerance')).toBeVisible();
    await page.keyboard.press('3');
    await expect(page.getByTestId('flashcard-question')).toHaveText('What problem does Raft solve?');
  });

  test('demo quiz tab works', async ({ page }) => {
    await page.goto('/demo/quizzes');
    await expect(page.getByTestId('quiz-question')).toContainText('During a partition');
  });
});

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Shield size={28} className="text-[var(--accent)]" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>

        <p className="text-sm text-[var(--text-muted)] mb-8">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">1. Introduction</h2>
            <p>
              MindFlow ("we", "our", "us") is an AI-powered study assistant built for students.
              This Privacy Policy explains how we collect, use, and protect your information when
              you use our platform at <strong>mindflowlearn.co.in</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Email address and password (managed securely via Supabase Auth).
              </li>
              <li>
                <strong>Study Content:</strong> Lecture notes, PDFs, and text you upload for flashcard and quiz generation.
              </li>
              <li>
                <strong>Usage Data:</strong> Study session statistics, quiz scores, flashcard review history, and XP/level progress.
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, screen size, and IP address (used only for rate limiting and security).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To generate personalized flashcards, quizzes, and study materials using AI.</li>
              <li>To power the spaced repetition engine and adaptive quiz difficulty.</li>
              <li>To track your study progress, streaks, and gamification stats.</li>
              <li>To improve the platform and fix bugs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">4. AI Processing & Third-Party Services</h2>
            <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 mb-4">
              <p className="font-medium text-[var(--text-primary)] mb-2">⚠️ Important Disclosure</p>
              <p>
                When you upload study content or request AI-generated flashcards/quizzes, your content
                is sent to external AI APIs for processing:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Google Gemini API</strong> — Primary AI provider for text generation and embeddings.</li>
                <li><strong>Groq API (Llama 3)</strong> — Fallback AI provider when Gemini is unavailable.</li>
              </ul>
              <p className="mt-2 text-sm">
                These services process your text to generate study materials. Please review their respective
                privacy policies for information on how they handle data.
              </p>
            </div>
            <p>We also use:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Supabase</strong> — Database, authentication, and vector storage.</li>
              <li><strong>Vercel</strong> — Frontend hosting and deployment.</li>
              <li><strong>Render</strong> — Backend server hosting.</li>
              <li><strong>Upstash</strong> — Optional Redis queue for background job processing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">5. Data Storage & Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your data is stored securely in Supabase (PostgreSQL) with Row Level Security (RLS) policies.</li>
              <li>Passwords are never stored by us — authentication is handled entirely by Supabase Auth.</li>
              <li>API communications are encrypted via HTTPS.</li>
              <li>We implement rate limiting to prevent abuse and protect the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access your personal data through the app's dashboard and settings.</li>
              <li>Delete your study sets, flashcards, and quiz history at any time.</li>
              <li>Request deletion of your account and all associated data by contacting us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">7. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. If you delete your account,
              all your personal data and study content will be permanently removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">8. Children's Privacy</h2>
            <p>
              MindFlow is designed for college and university students. We do not knowingly collect
              personal information from children under 13 years of age.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Significant changes will be
              communicated through the app. Continued use of MindFlow after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">10. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy or your data, please reach out
              to us at the MindFlow team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

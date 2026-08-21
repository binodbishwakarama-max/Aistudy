import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfService = () => {
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
          <FileText size={28} className="text-[var(--accent)]" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>

        <p className="text-sm text-[var(--text-muted)] mb-8">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using MindFlow ("the Service") at <strong>mindflowlearn.co.in</strong>,
              you agree to be bound by these Terms of Service. If you do not agree to these terms,
              please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">2. Description of Service</h2>
            <p>
              MindFlow is an AI-powered study platform that helps students convert lecture notes and
              PDFs into flashcards, quizzes, and spaced repetition study materials. The Service uses
              artificial intelligence to generate educational content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">3. AI-Generated Content Disclaimer</h2>
            <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4">
              <p className="font-medium text-[var(--text-primary)] mb-2">⚠️ Important</p>
              <p>
                MindFlow uses AI models (Google Gemini and Groq/Llama 3) to generate flashcards, quiz
                questions, and study summaries. While we strive for accuracy:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>AI-generated content <strong>may contain errors, inaccuracies, or hallucinations</strong>.</li>
                <li>Generated study materials should be <strong>verified against your official course materials</strong>.</li>
                <li>MindFlow is a <strong>study aid, not a replacement</strong> for attending lectures or reading textbooks.</li>
                <li>We are <strong>not responsible for academic outcomes</strong> based on AI-generated content.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">4. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide a valid email address to create an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>One account per person — sharing accounts is not permitted.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">5. Acceptable Use</h2>
            <p>You agree <strong>not</strong> to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Upload copyrighted materials you do not have rights to use.</li>
              <li>Attempt to abuse, overload, or exploit the AI generation features.</li>
              <li>Use automated tools (bots, scrapers) to access the Service.</li>
              <li>Reverse-engineer, hack, or attempt to gain unauthorized access to the backend.</li>
              <li>Use the Service for any illegal or unethical purpose.</li>
              <li>Share or redistribute AI-generated content commercially.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">6. Rate Limits & Fair Usage</h2>
            <p>
              To ensure a fair experience for all students, MindFlow enforces rate limits on AI
              generation features. Excessive or abusive usage may result in temporary restrictions
              on your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">7. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Content you upload remains yours — we do not claim ownership of your study materials.</li>
              <li>AI-generated flashcards and quizzes are created for your personal educational use.</li>
              <li>The MindFlow brand, design, and codebase are proprietary.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">8. Service Availability</h2>
            <p>
              MindFlow is provided "as is" without warranty. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Uninterrupted or error-free service availability.</li>
              <li>Accuracy or completeness of AI-generated content.</li>
              <li>Compatibility with all devices or browsers.</li>
            </ul>
            <p className="mt-2">
              We may temporarily suspend the Service for maintenance, updates, or due to
              third-party API outages beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">9. Limitation of Liability</h2>
            <p>
              MindFlow and its creators shall not be liable for any indirect, incidental, or
              consequential damages arising from your use of the Service, including but not limited
              to academic outcomes, data loss, or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms.
              You may delete your account at any time through the app settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">11. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of MindFlow after any
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">12. Contact</h2>
            <p>
              For questions about these Terms, please reach out to the MindFlow team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

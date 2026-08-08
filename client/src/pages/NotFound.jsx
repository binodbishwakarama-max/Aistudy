import React from 'react';
import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
    <p className="font-heading text-6xl font-bold tracking-tight text-[var(--text-muted)]">404</p>
    <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight">Page not found</h1>
    <p className="mt-3 max-w-sm text-[var(--text-secondary)]">
      That route doesn’t exist. Head back home and continue studying.
    </p>
    <Link to="/dashboard" className="mt-8">
      <Button leftIcon={MoveLeft}>Back to home</Button>
    </Link>
  </div>
);

export default NotFound;

import React from 'react';
import LucideIcon from '../common/LucideIcon';

export default function SupportSearch({ value, onChange }) {
  return (
    <section className="support-hero">
      <div>
        <h2>How can we help?</h2>
        <p>Search guides, troubleshooting steps, and assessment best practices.</p>
      </div>
      <label className="search">
        <LucideIcon name="search" />
        <input
          placeholder="Search support articles"
          value={value}
          onChange={onChange}
        />
      </label>
    </section>
  );
}

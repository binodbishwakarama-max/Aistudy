import React from 'react';

const BrandMark = ({ className = '' }) => (
  <span aria-hidden="true" className={`brand-mark ${className}`.trim()}>
    <span className="brand-mark-inner">M</span>
  </span>
);

export default BrandMark;

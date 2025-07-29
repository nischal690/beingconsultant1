"use client";

import React, { useEffect } from 'react';

export default function StoryFrame() {
  useEffect(() => {
    // Add a style tag to hide scrollbars on iframes
    const style = document.createElement('style');
    style.textContent = `
      iframe::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Clean up on unmount
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <iframe
      src="https://convex-founders-898475.framer.app/community-app"
      className="w-full h-full border-0"
      style={{
        width: '1400px',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE and Edge */
      }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

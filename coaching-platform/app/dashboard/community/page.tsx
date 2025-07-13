import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community | Being Consultant',
  description: 'Join our vibrant community of consultants',
};

export default function CommunityPage() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <iframe
        src="https://convex-founders-898475.framer.app/community-app"
        className="w-full h-full border-0"
        style={{ width: '1400px' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

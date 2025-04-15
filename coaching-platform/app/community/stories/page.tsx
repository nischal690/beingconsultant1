import React from 'react';

export default function StoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Community Stories</h1>
      <p className="text-lg mb-4">
        Explore inspiring stories from our community members.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stories content will go here */}
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p>We're collecting inspiring stories from our community. Check back soon!</p>
        </div>
      </div>
    </div>
  );
}
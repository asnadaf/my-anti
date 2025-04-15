"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'popular', label: 'Popular' },
  { id: 'under-30', label: 'Under $30' },
  { id: 'multi-device', label: 'Multi-Device' },
];

const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Product categories">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            selectedCategory === category.id
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white dark:bg-card text-gray-700 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-accent"
          )}
          onClick={() => onCategoryChange(category.id)}
          role="tab"
          aria-selected={selectedCategory === category.id}
          aria-controls={`${category.id}-tabpanel`}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryBar; 
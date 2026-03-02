"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  borderRadius = "0.75rem",
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-200/80 ${className}`}
      style={{
        width: width ?? "100%",
        height: height ?? "1rem",
        borderRadius: borderRadius,
      }}
    />
  );
};

export const CompanyCardSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in duration-500">
    <Skeleton height="12rem" borderRadius="0" />
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1 pr-4">
          <Skeleton height="1.5rem" width="80%" />
          <Skeleton height="1rem" width="60%" />
        </div>
        <Skeleton height="2rem" width="4rem" borderRadius="1rem" />
      </div>
      <Skeleton height="3rem" width="100%" />
      <div className="flex gap-2">
        <Skeleton height="1.5rem" width="4rem" borderRadius="1rem" />
        <Skeleton height="1.5rem" width="4rem" borderRadius="1rem" />
      </div>
      <div className="flex gap-3 pt-2">
        <Skeleton height="3rem" className="flex-1" borderRadius="1rem" />
        <Skeleton height="3rem" className="flex-1" borderRadius="1rem" />
      </div>
    </div>
  </div>
);

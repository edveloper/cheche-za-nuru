"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StoryPost } from "@/lib/story-content";
import { deleteStoryAction } from "./form-actions";

type TabType = "blog" | "photos" | "videos" | "voices";

type VoiceSubmission = {
  id: string;
  display_name: string;
  role_label: string;
  quote: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type StoryGallery = {
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  published_at: string | null;
};

type VideoStory = {
  slug: string;
  title: string;
  summary: string;
  status: string;
  published_at: string | null;
};

import { StoriesDashboard } from "./dashboard";

export default function AdminStoriesPage() {
  return <StoriesDashboard />;
}

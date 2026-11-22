import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/lib/data/site-config";
import { getTemplateBySlug } from "@/lib/data/templates";
import CreateTrackerClient from "./components/CreateTrackerClient";
import { SheetContextProvider } from "./context/context";

const CREATE_TITLE = "Create Habit Tracker Sheet";
const CREATE_DESCRIPTION =
  "Design your custom 21, 30, 60, 90, or 365-day habit challenge. Choose habits, customize labels, preview sheets, and download PDFs or track online.";

export const metadata: Metadata = {
  title: CREATE_TITLE,
  description: CREATE_DESCRIPTION,
  alternates: {
    canonical: "/create_tracker",
  },
  openGraph: {
    type: "website",
    title: `${CREATE_TITLE} | Habitora`,
    description: CREATE_DESCRIPTION,
    url: "/create_tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: `${CREATE_TITLE} | Habitora`,
    description: CREATE_DESCRIPTION,
  },
};

export default async function CreateTrackerPage({searchParams,}: {searchParams: Promise<{ template?: string }>;}) {
  const { template: templateSlug } = await searchParams;
  const matchedTemplate = getTemplateBySlug(templateSlug);

  return (
   <SheetContextProvider>
     <CreateTrackerClient
      defaultHabits={
        matchedTemplate ? matchedTemplate.habits : SITE_CONFIG.defaultHabits
      }
      // initialName={matchedTemplate ? matchedTemplate.title : ""}
      initialDuration={matchedTemplate ? matchedTemplate.durationDays : 30}
    />
   </SheetContextProvider>
  );
}

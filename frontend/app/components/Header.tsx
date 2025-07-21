import Link from "next/link";
import { settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import SanityLogo from "@/app/ui/sanity-logo";
import ScrollableHeader from "./ScrollableHeader";

export default async function Header() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
  });

  return <ScrollableHeader settings={settings} />;
}

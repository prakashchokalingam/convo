/**
 * Marketing Layout
 * 
 * This layout applies to all marketing pages (/marketing/*).
 * No authentication required for marketing content.
 * 
 * Context verification is now handled by the path structure itself:
 * - All files in app/marketing/* are automatically marketing context
 * - No complex context detection needed
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Marketing layout - no auth required, minimal overhead
  return <>{children}</>;
}

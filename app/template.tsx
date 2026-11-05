// Page transitions used to fade + blur the whole page in on every navigation,
// which hid the content (and delayed the largest paint) for ~0.5 s. Content now
// renders immediately; sections keep their own scroll reveals.
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

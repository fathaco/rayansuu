/** Avoid stale cached shell for this route after deploys. */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function MyReservationsLayout({ children }: { children: React.ReactNode }) {
  return children
}

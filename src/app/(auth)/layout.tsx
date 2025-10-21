import AuthLayout from '@/core/components/layouts/AuthLayout'

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
}

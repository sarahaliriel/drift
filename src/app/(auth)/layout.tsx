import type { ReactNode } from "react";

import { AuthLayout as SharedAuthLayout } from "@/features/auth/components/AuthLayout";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <SharedAuthLayout>{children}</SharedAuthLayout>;
}

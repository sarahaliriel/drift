import type { ReactNode } from "react";

import { AuthLayout as SharedAuthLayout } from "@/components/auth/AuthLayout";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <SharedAuthLayout>{children}</SharedAuthLayout>;
}

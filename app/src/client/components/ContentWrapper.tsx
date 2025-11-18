import { ReactNode } from "react";
export default function ContentWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 md:mt-16 max-w-7xl mx-auto">
      <div className="mx-6 md:mx-8 pb-24">{children}</div>
    </div>
  );
}

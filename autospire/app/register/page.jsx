import { Suspense } from "react";
import RegisterForm from "@/components/Auth/RegisterForm";

export const metadata = { title: "Create account — Autospire" };

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
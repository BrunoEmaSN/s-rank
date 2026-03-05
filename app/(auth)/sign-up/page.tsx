import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { SignUpForm } from "./sign-up-form";

export default async function SignUpPage() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");
  return <SignUpForm />;
}

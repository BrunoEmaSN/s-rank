import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");
  return <SignInForm />;
}

import { redirect } from "next/navigation";
import { ExploreContent } from "./ExploreContent";
import { getSession } from "@/lib/auth-server";

export default async function ExplorePage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const user = session.user as {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
  return <ExploreContent user={user} />;
}

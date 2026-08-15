import { Banner } from "@/components/sections/banner";
import { Highlights } from "@/components/sections/highlights";

export default async function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Banner />
      <Highlights />
    </main>
  );
}

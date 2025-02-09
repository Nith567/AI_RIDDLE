import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CompetitionEntryDialog } from "./Dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
export function Body() {
  const router = useRouter();
  function handleRedirect() {
    router.push("competitions");
  }

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                AI-Riddle-Quest
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Participate, compete, and win in an exciting decentralized
                AI-Riddle-Quest contest on Arbitrum
              </p>
            </div>
            <div className="space-x-4 bg-slate-600 text-black">
              <Button onClick={handleRedirect} variant="outline">
                View Contests
              </Button>
            </div>
          </div>
          <div className="mt-12 flex justify-center">
            <CompetitionEntryDialog />
          </div>
        </div>
      </section>
    </main>
  );
}

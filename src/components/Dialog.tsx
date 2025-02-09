"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import { deployContract } from "../../utils/contractdeploy";
import { useAccount } from "wagmi";
import { useToast } from "../../hooks/use-toast";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  BaseError,
} from "wagmi";
export function CompetitionEntryDialog() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("");
  const [entryCost, setEntryCost] = useState("");
  const [scoreToWin, setScoreToWin] = useState(0);
  const router = useRouter();

  const account = useAccount();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
       const res = await deployContract(
        account.address,
        theme,
         entryCost,
         scoreToWin
       );
      console.log("nowdeployed ", res);
      toast({
        title: "successfully Deployed",
        description: "You have successfully deployed contract.",
      });
      const contestData = {
        theme,
        entryCost,
        scoreToWin,
        contractAddress: res,
      };
      const response = await axios.post("/api/contest", contestData);
      console.log("data", response.data);

      router.push(`/contests/${response.data}`);
    } catch (error) {
      console.error("Error submitting contest:", error);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-600 hover:bg-cyan-700 text-white">
          Enter Competition
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Competition</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Input
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Enter competition theme"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryCost">Entry Cost</Label>
            <Input
              id="entryCost"
              value={entryCost}
              onChange={(e) => setEntryCost(e.target.value)}
              placeholder="Enter cost in $"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scoreToWin">Score to Win</Label>
            <Input
              id="scoreToWin"
              type="number"
              value={scoreToWin}
              onChange={(e) => setScoreToWin(Number(e.target.value))}
              placeholder="Enter minimum score to win"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Entry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

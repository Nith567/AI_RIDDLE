"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAccount } from "wagmi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  BaseError,
} from "wagmi";
import { chainQuestContract } from "../../../../contract/abi";
import { publicClient } from "@/components/Providers";
import { parseEther } from "viem";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "../../../../hooks/use-toast";
interface contestParams {
  params: {
    contestId: string;
  };
}
export default function ContestDetails({ params }: contestParams) {
  const [contestData, setContestData] = useState<any>(null);
  const [answer, setAnswer] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { contestId } = params;
  const { toast } = useToast();

  const account = useAccount();
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Define the return type for estimateFee
  const estimateFee = async (): Promise<bigint> => {
    const data = await publicClient.readContract({
      address: contestData.contractAddress as `0x${string}`,
      abi: chainQuestContract.abi,
      functionName: "estimateFee",
      args: [11],
    });
    //@ts-ignore
    return data;
  };
  const checkScore = async () => {
    const data = await publicClient.readContract({
      address: contestData.contractAddress as `0x${string}`,
      abi: chainQuestContract.abi,
      functionName: "RiddleScore",
      args: [account?.address],
    });
    //@ts-ignore
    const formattedScore = data.toString(); // Convert BigInt to string
    console.log("score is", formattedScore);

    setScore(formattedScore); // Set the score as a string
    //@ts-ignore
    setScore(formattedScore);
    toast({
      title: "score ",
      description: `Your score is ${formattedScore}`,
      action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
    });
  };

  async function Contest() {
    try {
      console.log(answer);
      const fee = await estimateFee();
      writeContract({
        address: contestData.contractAddress as `0x{string}`,
        abi: chainQuestContract.abi,
        functionName: "participateRiddle",
        args: [11, answer],
        value: fee,
      });
      toast({
        title: "Contest Entered",
        description: "You have successfully entered the contest.",
      });
    } catch (error) {
      console.error("error", error);
    }
  }

  async function claimPrize() {
    try {
      writeContract({
        address: contestData.contractAddress,
        abi: chainQuestContract.abi,
        functionName: "claimPrize",
        args: [],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function deposit() {
    try {
      writeContract({
        address: contestData.contractAddress,
        abi: chainQuestContract.abi,
        functionName: "deposit",
        args: [],
        value: parseEther(contestData.entryCost),
      });
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (!contestId) return;
    const fetchContestData = async () => {
      try {
        const response = await axios.get(`/api/contests/${contestId}`);
        setContestData(response.data);
      } catch (error) {
        console.error("Error fetching contest data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContestData();
  }, [contestId]);

  if (loading) return <div>Loading...</div>;

  if (!contestData) return <div>Contest not found</div>;

  return (
    <div className="max-w-4xl mx-auto min-h-screen p-8 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 rounded-xl shadow-2xl space-y-8 text-white">
      <h1 className="text-5xl font-extrabold text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200">
        AI-Riddle-Quest Competition
      </h1>
      <div className="space-y-4 bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
        <div className="flex justify-between items-center">
          <strong className="md:text-xl font-semibold text-blue-200">
            Theme (Riddle):
          </strong>
          <span className="text-gray-100 text-lg">{contestData.theme}</span>
        </div>
        <div className="flex justify-between items-center">
          <strong className="text-xl font-semibold text-blue-200">
            Entry Cost:
          </strong>
          <span className="text-gray-100 text-lg">
            ${contestData.entryCost}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <strong className="text-xl font-semibold text-blue-200">
            Score to Win:
          </strong>
          <span className="text-gray-100 text-lg">
            {contestData.scoreToWin}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <strong className="text-xl font-semibold text-blue-200">
            Contract Address:
          </strong>
          <span className="text-gray-100 text-lg font-mono">
            {contestData.contractAddress}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <div className="flex items-center space-x-4 w-full max-w-lg">
          <Label
            htmlFor="answer"
            className="text-xl font-semibold text-blue-200"
          >
            Enter your answer:
          </Label>
          <Input
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            required
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex space-x-6">
          <Button
            onClick={Contest}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Enter Contest
          </Button>
          <Button
            onClick={claimPrize}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
          >
            Claim Prize
          </Button>
        </div>
        <div className="flex space-x-6">
          <Button
            onClick={deposit}
            className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-8 py-4 rounded-xl shadow-lg hover:from-teal-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105"
          >
            Deposit
          </Button>
          <Button
            onClick={checkScore}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
          >
            Check Score: <span className="ml-2 font-bold">{score}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

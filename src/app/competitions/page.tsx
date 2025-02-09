"use client";
import React, { useState, useEffect } from "react";
import { chainQuestContract } from "../../../contract/abi";
import { useRouter } from "next/navigation";
import axios from "axios";
interface ChainQuest {
  id: string;
  createdAt: Date;
  contractAddress: string;
  theme: string;
  entryCost: string;
  scoreToWin: number;
}

function Competitions() {
  const [users, setUsers] = useState<ChainQuest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/contest");
        const data = await response.data;
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleContests = async (contestId: string) => {
    try {
      router.push(`/contests/${contestId}`);
    } catch (error) {
      console.error("error", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          View All Competitions
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((chainQuest) => (
            <div
              key={chainQuest.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="space-y-4">
                <p className="text-gray-800 font-semibold text-lg">
                  Theme:{" "}
                  <span className="text-indigo-600">{chainQuest.theme}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Entry Fee:{" "}
                  <span className="font-medium text-gray-800">
                    {chainQuest.entryCost} ETH
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Joined:{" "}
                  <span className="font-medium text-gray-800">
                    {new Date(chainQuest.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleContests(chainQuest.id)}
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
              >
                Join Competition
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Competitions;

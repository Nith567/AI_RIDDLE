import { NextRequest, NextResponse } from "next/server";
import prismadb from "../../../../../lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { contestId: string } }
) {
  try {
    const { contestId } = params;
    const contest = await prismadb.quest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return new NextResponse("Contest not found", { status: 404 });
    }

    console.log("Contest data: ", contest);
    return NextResponse.json(contest);
  } catch (error) {
    console.log("Error fetching contest: ", error);
    return new NextResponse("Internal error: ", { status: 500 });
  }
}

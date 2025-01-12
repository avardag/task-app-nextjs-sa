import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

//fetch logs for card modal(gets only latest three)
export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }, //cardId as in [cardId]
) {
  try {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        orgId,
        entityId: params.cardId,
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });
    return NextResponse.json(auditLogs);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

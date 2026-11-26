"use client";

import React from "react";
import { Button, Card, CardContent } from "@heroui/react";
import { Receipt } from "lucide-react";
import type { ITransaction } from "@/types/transaction.type";

interface IRecentTransfersCardProps {
  transfers: ITransaction[];
  onViewReceipt: (txn: ITransaction) => void;
  onViewAll: () => void;
}

export default function RecentTransfersCard({
  transfers,
  onViewReceipt,
  onViewAll,
}: IRecentTransfersCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground">
            Recent Transfers
          </h2>
          <Button
            size="sm"
            variant="outline"
            onPress={onViewAll}
            className="h-7 text-xs font-medium"
          >
            View Full History
          </Button>
        </div>

        {transfers.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            No recent transfers found.
          </p>
        ) : (
          <div className="divide-y divide-border text-sm">
            {transfers.map((txn) => (
              <div
                key={txn.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-foreground select-all">
                    {txn.transactionId}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    To:{" "}
                    <span className="font-semibold text-foreground">
                      {txn.receiverAccount || "—"}
                    </span>{" "}
                    •{" "}
                    {txn.createdAt
                      ? new Date(txn.createdAt).toLocaleDateString("en-BD", {
                          dateStyle: "medium",
                        })
                      : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground">
                    ৳{Number(txn.amount ?? 0).toLocaleString("en-BD")}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => onViewReceipt(txn)}
                    className="gap-1.5 text-xs font-medium"
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    <span>Receipt</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

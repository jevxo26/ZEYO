"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomBudgetBannerProps {
  onOpenCalculator?: () => void;
}

export default function CustomBudgetBanner({
  onOpenCalculator,
}: CustomBudgetBannerProps) {
  return (
    <Card className="mx-4 my-6 sm:mx-8 sm:my-8 border-0 bg-gradient-to-br from-[#4C2A9C] via-[#3A3FB0] to-[#2454C7] text-card-foreground ring-0 shadow-lg">
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-xl">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
            Need a custom budget?
          </CardTitle>
          <CardDescription className="mt-3 text-sm sm:text-base text-indigo-100/80 leading-relaxed">
            Use our Smart Event Calculator to get an instant estimate for
            your specific guest count, menu preferences, and decor
            requirements.
          </CardDescription>
        </div>

        <CardAction>
          <Button
            size="lg"
            onClick={onOpenCalculator}
            className="bg-white text-[#3A3FB0] hover:bg-indigo-50 focus-visible:ring-white/50"
          >
            Open Calculator
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
}
// src/components/AffordabilityPanel.jsx
import React from "react";
import { Euro } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function AffordabilityPanel({
  requiredFunds,
  currentSavings,
  monthlySavings,
  targetYear,
  inflationAdjustment,
}) {
  const currentYear = new Date().getFullYear();
  const remaining = Math.max(requiredFunds - currentSavings, 0);
  const monthsNeeded =
    monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : null;

  return (
    <Card className="border-2 border-orange-100 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Euro className="w-5 h-5 text-orange-600" />
          Affordability Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">
          Required personal funds:{" "}
          <span className="font-semibold">
            €{requiredFunds?.toLocaleString() || 0}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Current savings:{" "}
          <span className="font-semibold">
            €{currentSavings?.toLocaleString() || 0}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Monthly savings:{" "}
          <span className="font-semibold">
            €{monthlySavings?.toLocaleString() || 0}
          </span>
        </p>
        {monthsNeeded !== null && (
          <p className="text-sm text-gray-600">
            Time needed at this rate:{" "}
            <span className="font-semibold">
              {Math.ceil(monthsNeeded / 12)} years
            </span>
          </p>
        )}
        <p className="text-sm text-gray-600">
          Target year (with decisions):{" "}
          <span className="font-semibold">{targetYear}</span>
        </p>
        <p className="text-xs text-gray-500">
          Inflation assumption: ~{inflationAdjustment}% total until purchase.
        </p>
      </CardContent>
    </Card>
  );
}

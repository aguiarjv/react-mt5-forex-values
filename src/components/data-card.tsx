import { MoveRight, Settings, TriangleAlert, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SymbolData } from "@/definitions/symbol";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface DataCardProps {
  symbolData: SymbolData;
  symbolIndex: number;
  handleUpdateVolume: (index: number, volume: number) => void;
  handleUpdatePointsRange: (index: number, pointsRange: number[]) => void;
  handleDeleteSymbol: (index: number) => void;
}

export function DataCard({
  symbolData,
  symbolIndex,
  handleUpdateVolume,
  handleUpdatePointsRange,
  handleDeleteSymbol,
}: DataCardProps) {
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number(event.target.value);
    handleUpdateVolume(symbolIndex, volume);
  };

  const handlePointChange = (pointIndex: number, newValue: number) => {
    const nextPointsRange = symbolData.pointsRange.map((value, i) => {
      if (i == pointIndex) {
        return newValue;
      } else {
        return value;
      }
    });
    handleUpdatePointsRange(symbolIndex, nextPointsRange);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <span className="text-md font-bold">{symbolData.symbol}</span>
            <Settings className="size-5" />
          </div>

          <div className="flex flex-row items-center gap-2">
            <Label className="text-md font-semibold">Volume</Label>
            <Input
              className="w-20"
              defaultValue={symbolData.volume ? symbolData.volume : undefined}
              type="number"
              min={symbolData.volumeMin ? symbolData.volumeMin : undefined}
              max={100}
              step={symbolData.volumeMin ? symbolData.volumeMin : undefined}
              disabled={symbolData.volumeMin ? false : true}
              onChange={handleVolumeChange}
            />
            <p className="text-md font-semibold">Units</p>
          </div>
          <X
            className="size-6 hover:bg-primary hover:text-red-700 hover:border hover:rounded-md"
            onClick={() => handleDeleteSymbol(symbolIndex)}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex flex-row items-center gap-4">
          <p className="text-sm font-bold">Points</p>
          {!symbolData.ask ? (
            <div className="self-center mx-auto flex flex-row items-center gap-2 text-yellow-500">
              <TriangleAlert />
              <p>Check symbol name or MT5 connection</p>
            </div>
          ) : (
            <div className="self-center mx-auto flex flex-row items-center gap-2 text-purple-400">
              <p className="text-sm font-semibold">Current ASK:</p>
              <p className="text-md font-semibold">
                {symbolData.ask.toLocaleString("en-Us", {
                  maximumFractionDigits: symbolData.decimalPoints
                    ? symbolData.decimalPoints
                    : 5,
                  minimumFractionDigits: symbolData.decimalPoints
                    ? symbolData.decimalPoints
                    : 5,
                })}{" "}
              </p>
            </div>
          )}
        </div>
        {symbolData.pointsRange.map((value, pointIndex) => (
          <div key={pointIndex} className="flex flex-row items-center gap-4">
            <Input
              className="w-20"
              defaultValue={value}
              type="number"
              min={10}
              max={100000}
              step={10}
              onChange={(e) =>
                handlePointChange(pointIndex, Number(e.target.value))
              }
            />

            {symbolData.tradeTickPreviousValue && (
              <MoveRight className="size-7" />
            )}

            {symbolData.tradeTickPreviousValue && symbolData.volume && (
              <p className="text-md font-semibold">
                USD{" "}
                {(
                  symbolData.tradeTickPreviousValue *
                  value *
                  symbolData.volume
                ).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}{" "}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

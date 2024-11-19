import { CirclePlus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { SymbolData } from "@/definitions/symbol";

interface AddSymbolProps {
  handleCreateSymbol: (newSymbol: SymbolData) => void;
}

export function AddSymbol({ handleCreateSymbol }: AddSymbolProps) {
  const [symbolName, setSymbolName] = useState("");
  const [status, setStatus] = useState("");
  const [pointsArr, setPointsArr] = useState([10, 20, 30, 40]);

  const handlePointChange = (index: number, newValue: number) => {
    const nextPointsArr = pointsArr.map((v, i) => {
      if (i == index) {
        return Math.trunc(newValue);
      } else {
        return v;
      }
    });
    setPointsArr(nextPointsArr);
  };

  const handleConfirm = () => {
    if (symbolName == "") {
      setStatus("error");
      return;
    }
    const newSymbol: SymbolData = {
      symbol: symbolName,
      volume: null,
      volumeMin: null,
      pointsRange: pointsArr,
      tradeTickValue: null,
      tradeTickPreviousValue: null,
      ask: null,
      decimalPoints: null,
    };
    handleCreateSymbol(newSymbol);
    setStatus("success");
  };

  return (
    <Dialog
      onOpenChange={() => {
        setStatus("");
        setSymbolName("");
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <CirclePlus />
          <span>Add New Symbol</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Symbol</DialogTitle>
          <DialogDescription>
            Enter the name of a symbol to be added to the watch list
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="symbol" className="text-md">
            Symbol
          </Label>
          <Input
            id="symbol"
            type="text"
            required
            value={symbolName}
            onChange={(e) => setSymbolName(e.target.value.toUpperCase())}
          />
          {status == "error" && (
            <p className="text-red-500">Symbol name is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-md">Points</Label>
          {pointsArr.map((v, i) => (
            <Input
              key={i}
              type="number"
              step="10"
              min="10"
              max="100000"
              required
              value={v}
              onChange={(e) => handlePointChange(i, Number(e.target.value))}
            />
          ))}
        </div>
        {status == "success" && (
          <p className="text-green-500">New symbol successfully added!</p>
        )}
        <DialogFooter>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

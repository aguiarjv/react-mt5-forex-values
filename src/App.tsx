import { useEffect, useRef, useState } from "react";
import { AddSymbol } from "./components/add-new-symbol";
import { DataCard } from "./components/data-card";
import { ThemeProvider } from "./components/theme-provider";
import { SymbolData, WsSymbolData } from "./definitions/symbol";

const webSocketServer = "ws://localhost:8000/ws";

const defaultValues: SymbolData[] = [
  {
    symbol: "USDJPY",
    volumeMin: null,
    volume: null,
    pointsRange: [30, 60, 90, 120],
    tradeTickValue: null,
    tradeTickPreviousValue: null,
    ask: null,
    decimalPoints: null,
  },
  {
    symbol: "USDCHF",
    volumeMin: null,
    volume: null,
    pointsRange: [30, 60, 90, 120],
    tradeTickValue: null,
    tradeTickPreviousValue: null,
    ask: null,
    decimalPoints: null,
  },
  {
    symbol: "USDCAD",
    volumeMin: null,
    volume: null,
    pointsRange: [30, 60, 90, 120],
    tradeTickValue: null,
    tradeTickPreviousValue: null,
    ask: null,
    decimalPoints: null,
  },
  {
    symbol: "EURJPY",
    volumeMin: null,
    volume: null,
    pointsRange: [30, 60, 90, 120],
    tradeTickValue: null,
    tradeTickPreviousValue: null,
    ask: null,
    decimalPoints: null,
  },
  {
    symbol: "GBPJPY",
    volumeMin: null,
    volume: null,
    pointsRange: [30, 60, 90, 120],
    tradeTickValue: null,
    tradeTickPreviousValue: null,
    ask: null,
    decimalPoints: null,
  },
];

function App() {
  const [symbolsData, setSymbolsData] = useState(defaultValues);

  const handleUpdateVolume = (index: number, volume: number) => {
    const nextData = symbolsData.map((data, i) => {
      if (i == index) {
        return {
          ...data,
          volume: volume,
        };
      } else {
        return data;
      }
    });
    setSymbolsData(nextData);
  };

  const handleUpdatePointsRange = (index: number, pointsRange: number[]) => {
    const nextData = symbolsData.map((data, i) => {
      if (i == index) {
        return {
          ...data,
          pointsRange: pointsRange,
        };
      } else {
        return data;
      }
    });
    setSymbolsData(nextData);
  };

  const handleDeleteSymbol = (index: number) => {
    const nextData = symbolsData.filter((_, i) => i != index);
    setSymbolsData(nextData);
  };

  const handleCreateSymbol = (newSymbol: SymbolData) => {
    setSymbolsData([...symbolsData, { ...newSymbol }]);
  };

  const symbolsRef = useRef(symbolsData);

  useEffect(() => {
    symbolsRef.current = symbolsData;
  }, [symbolsData]);

  useEffect(() => {
    const ws = new WebSocket(webSocketServer);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      updateSymbolsData(data);
    };

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(symbolsRef.current.map((data) => data.symbol)));
      }
    }, 3000);

    const updateSymbolsData = (webSocketData: WsSymbolData[]) => {
      const nextData = symbolsRef.current.map((data) => {
        const wsInfo = webSocketData.find(
          (wsData) => wsData.symbol == data.symbol,
        );
        if (wsInfo) {
          const updatedSymbolData: SymbolData = { ...data };
          updatedSymbolData.ask = wsInfo.ask;
          updatedSymbolData.decimalPoints = wsInfo.decimal_points;
          updatedSymbolData.tradeTickValue = wsInfo.trade_tick_value;
          updatedSymbolData.volumeMin = wsInfo.volume_min;
          if (updatedSymbolData.volume == null) {
            updatedSymbolData.volume = wsInfo.volume_min;
          }
          if (wsInfo.trade_tick_value != null) {
            updatedSymbolData.tradeTickPreviousValue = wsInfo.trade_tick_value;
          }

          return updatedSymbolData;
        } else {
          return data;
        }
      });
      setSymbolsData(nextData);
    };

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="p-12 px-16 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">
            MT5 Symbols USD Values by Points
          </h1>
          <AddSymbol handleCreateSymbol={handleCreateSymbol} />
        </div>
        <div className="grid grid-cols-3 gap-4 ">
          {symbolsData.map((data, symbolIndex) => (
            <DataCard
              key={symbolIndex}
              symbolIndex={symbolIndex}
              symbolData={data}
              handleUpdateVolume={handleUpdateVolume}
              handleUpdatePointsRange={handleUpdatePointsRange}
              handleDeleteSymbol={handleDeleteSymbol}
            />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
import { Server } from "lucide-react";
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

interface ConfigButtonProps {
  currentServer: string;
  handleChangeServer: (serverAddress: string) => void;
}

export function ConfigButton({
  currentServer,
  handleChangeServer,
}: ConfigButtonProps) {
  const [serverAddress, setServerAddress] = useState(currentServer);

  const handleConfirm = () => {
    handleChangeServer(serverAddress);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Server />
          <span>Server Config</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Server Address</DialogTitle>
          <DialogDescription>
            Enter the address of the new server to fetch data from
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="serverAddress" className="text-md">
            Server Address
          </Label>
          <Input
            id="serverAddress"
            type="text"
            required
            value={serverAddress}
            onChange={(e) => setServerAddress(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

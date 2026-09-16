import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstallBar() {
  return null;
}

export function InstallButton() {
  return (
    <Button size="sm" variant="secondary" asChild>
      <a href="/HARDSTYLE.zip" download="HARDSTYLE.zip">
        <Download className="size-4" aria-hidden />
        Download
      </a>
    </Button>
  );
}

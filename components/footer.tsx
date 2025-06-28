import Link from "next/link";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="border-t mt-8 pt-6 pb-24 text-sm flex justify-between">
      <p>Adrian Lam</p>
      <Button
        variant="link"
        effect="hoverUnderline"
        asChild
        className="text-cyan-500 hover:text-cyan-600 after:bg-cyan-600"
      >
        <Link
          href="https://github.com/adriandlam/adriandlamcom"
          className="text-cyan-500 hover:text-cyan-600 hover:underline underline-offset-2"
        >
          Source
        </Link>
      </Button>
    </footer>
  );
}

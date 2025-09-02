import Link from "next/link";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface SubheaderProps {
  title: string;
  buttonTitle: string;
  buttonLink: string;
  ClickIcon: React.ComponentType<any>;
}

export default function Subheader({
  title,
  buttonTitle,
  buttonLink,
  ClickIcon,
}: SubheaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 font-headline">
        {title}
      </h1>
      <Link href={buttonLink}>
        <Button>
          <ClickIcon className='h-4 w-4 mr-2'/>
          {buttonTitle}
        </Button>
      </Link>
    </div>
  );
}

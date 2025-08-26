
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow } from 'lucide-react';
import Link from 'next/link';

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"></path>
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.11-5.52c-2.17 1.45-4.92 2.3-8.78 2.3-6.76 0-12.47-4.55-14.5-10.64H2.3v5.68C6.36 42.4 14.7 48 24 48z"></path>
        <path fill="#FBBC05" d="M9.5 28.66c-.52-1.56-.82-3.25-.82-5.02s.3-3.46.82-5.02V12.9H2.3C.82 15.98 0 19.86 0 24s.82 8.02 2.3 11.1l7.2-5.74z"></path>
        <path fill="#EA4335" d="M24 9.49c3.52 0 6.52 1.21 8.94 3.48l6.3-6.3C35.91 2.84 30.48 0 24 0 14.7 0 6.36 5.6 2.3 11.1l7.2 5.72C11.53 14.04 17.24 9.49 24 9.49z"></path>
    </svg>
);


export default function GetStartedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <div className="w-full max-w-sm">
            <div className="flex justify-center mb-6">
                <Link href="/" className="flex items-center gap-2">
                    <Workflow className="w-10 h-10 text-primary" />
                    <span className="text-3xl font-bold font-headline">FlowForge</span>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Get Started</CardTitle>
                    <CardDescription>Sign in to your account to continue.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button variant="outline">
                        <GoogleIcon className="mr-2 h-5 w-5" />
                        Sign in with Google
                    </Button>
                    <Button variant="outline">
                        <GitHubIcon className="mr-2 h-5 w-5" />
                        Sign in with GitHub
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

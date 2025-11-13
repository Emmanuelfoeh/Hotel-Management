import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your account details and role information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium text-muted-foreground">
                Name
              </div>
              <div className="text-base">
                {session.user.firstName} {session.user.lastName}
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="text-sm font-medium text-muted-foreground">
                Email
              </div>
              <div className="text-base">{session.user.email}</div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="text-sm font-medium text-muted-foreground">
                Role
              </div>
              <div className="text-base capitalize">
                {session.user.role.toLowerCase()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the theme toggle in the header to switch between light and
              dark mode.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

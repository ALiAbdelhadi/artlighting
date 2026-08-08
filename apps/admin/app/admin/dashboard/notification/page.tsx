import DashboardHeader from "@/components/dashboard-header";
import { requireAdminOrRedirect } from "@/lib/auth";
import { Container } from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellDot } from "lucide-react";

const NotificationPage = async () => {
  await requireAdminOrRedirect();

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <DashboardHeader Route="Notification" />
      <div className="mt-8">
        <Container>
          <Card className="glass-surface rounded-2xl max-w-lg">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BellDot className="h-5 w-5" />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Not built yet — there's no transactional email or in-app notification
                system wired up in this project. This page is a placeholder until that's
                scoped.
              </p>
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default NotificationPage;

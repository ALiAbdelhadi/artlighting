"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check } from "lucide-react";
import { createStaffAccount, updateAdminRole, revokeAdminAccess } from "@/lib/actions/staff";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

function generateSecurePassword(length = 20) {
  const charset =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => charset[b % charset.length]).join("");
}

export default function TeamManager({
  admins,
  currentAdminId,
}: {
  admins: Admin[];
  currentAdminId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"owner" | "staff">("staff");
  const [copied, setCopied] = useState(false);
  const [lastCreated, setLastCreated] = useState<{ email: string; password: string } | null>(
    null
  );

  function run(fn: () => Promise<unknown>, msg: string) {
    startTransition(async () => {
      try {
        await fn();
        toast.success(msg);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function handleGeneratePassword() {
    setPassword(generateSecurePassword());
  }

  function handleCreate() {
    if (!name || !email || !password) {
      toast.error("Fill in name, email, and password");
      return;
    }
    startTransition(async () => {
      try {
        await createStaffAccount({ email, name, password, role });
        setLastCreated({ email, password });
        setName("");
        setEmail("");
        setPassword("");
        setRole("staff");
        toast.success("Account created");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create account");
      }
    });
  }

  return (
    <Container>
      <Card className="max-w-xl mb-6 glass-surface rounded-2xl">
        <CardHeader>
          <CardTitle>Add a team member</CardTitle>
          <p className="text-sm text-muted-foreground">
            This is the only way a new admin account gets created — there's no public sign-up
            anymore. Share the generated password with them over a secure channel (not email/chat
            in plain text if you can help it).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="flex gap-2">
              <Input value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="button" variant="outline" onClick={handleGeneratePassword}>
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Minimum 12 characters.</p>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as "owner" | "staff")}>
              <SelectTrigger className="max-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff (no price/discount access)</SelectItem>
                <SelectItem value="owner">Owner (full access)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button disabled={isPending} onClick={handleCreate}>
            Create account
          </Button>

          {lastCreated && (
            <div className="border rounded-lg p-3 bg-muted/40 space-y-1">
              <p className="text-sm font-medium">
                Created {lastCreated.email} — copy this password now, it won&apos;t be shown again:
              </p>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-background border rounded px-2 py-1 flex-1 overflow-x-auto">
                  {lastCreated.password}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={async () => {
                    await navigator.clipboard.writeText(lastCreated.password);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-surface rounded-2xl">
        <CardHeader>
          <CardTitle>Admins ({admins.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between border rounded-lg p-2">
              <div>
                <p className="font-medium">
                  {admin.name}{" "}
                  {admin.id === currentAdminId && (
                    <span className="text-xs text-muted-foreground">(you)</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{admin.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={admin.role === "owner" ? "default" : "secondary"}>
                  {admin.role}
                </Badge>
                {admin.id !== currentAdminId && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() =>
                        run(
                          () =>
                            updateAdminRole(
                              admin.id,
                              admin.role === "owner" ? "staff" : "owner"
                            ),
                          "Role updated"
                        )
                      }
                    >
                      Make {admin.role === "owner" ? "staff" : "owner"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => run(() => revokeAdminAccess(admin.id), "Access revoked")}
                    >
                      Revoke
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
}

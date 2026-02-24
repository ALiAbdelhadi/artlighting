import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    const { role, password } = await req.json();

    const user = await currentUser();
    const { userId } = await auth();

    if (!userId || !user) {
        return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const isAdminEmail = user.emailAddresses?.[0]?.emailAddress === process.env.ADMIN_EMAIL;
    const isAdminCredentials =
        role === process.env.ADMIN_NAME && password === process.env.ADMIN_PASSWORD;

    if (!isAdminEmail || !isAdminCredentials) {
        return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ success: true });
}

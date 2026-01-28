export async function POST(req: Request) {
    const { role, password } = await req.json();

    if (role === process.env.ADMIN_NAME && password === process.env.ADMIN_PASSWORD) {
        return Response.json({ success: true });
    } else {
        return Response.json({ success: false });
    }
}

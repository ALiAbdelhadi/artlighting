import { NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(
    request: Request,
    { params }: { params: { ProductId: string } }
) {
    const { ProductId } = params;

    try {
        const configuration = await db.configuration.findFirst({
            where: { ProductId: ProductId },
            orderBy: { updatedAt: 'desc' },
        });

        if (configuration) {
            return NextResponse.json(configuration);
        } else {
            return NextResponse.json({ message: 'Configuration not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching configuration:', error);
        return NextResponse.json({ message: 'Error fetching configuration' }, { status: 500 });
    }
}
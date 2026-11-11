import { getAuth } from '@/lib/auth';
export const runtime = 'nodejs';
export async function GET(request: Request) { return getAuth().handler(request); }
export async function POST(request: Request) { return getAuth().handler(request); }

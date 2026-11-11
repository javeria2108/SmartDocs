import { liveblocks } from '@/lib/liveblocks';
import { currentUser } from '@/lib/session';
export async function POST() {
  const user = await currentUser();
  if (!user) return Response.json({ message: 'Authentication required' }, { status: 401 });
  const { status, body } = await liveblocks.identifyUser({ userId: user.id, groupIds: [] }, { userInfo: user });
  return new Response(body, { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

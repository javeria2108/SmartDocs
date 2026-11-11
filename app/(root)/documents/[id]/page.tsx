import CollaborativeRoom from '@/components/CollaborativeRoom';
import { getDocument } from '@/lib/actions/room.actions';
import { findUsers } from '@/lib/users';
import { requirePageUser } from '@/lib/session';
import { canAccessDocument } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function Document({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requirePageUser();
  const room = await getDocument(id);
  if (!room) redirect('/');
  const users = await findUsers(Object.keys(room.usersAccesses));
  const usersData = users.filter((item): item is User => Boolean(item)).map(item => ({
    ...item,
    userType: (room.metadata.creatorId === item.id ? 'creator' : canAccessDocument(room, item.id, 'write') ? 'editor' : 'viewer') as UserType,
  }));
  const currentUserType: UserType = room.metadata.creatorId === user.id ? 'creator' : canAccessDocument(room, user.id, 'write') ? 'editor' : 'viewer';
  return <main className="flex w-full flex-col items-center"><CollaborativeRoom roomId={id} roomMetadata={room.metadata as RoomMetadata} users={usersData} currentUserType={currentUserType} /></main>;
}

'use server';
import { requireUser } from '../session';
import { findUsers } from '../users';
import { liveblocks } from '../liveblocks';
import { assertDocumentAccess } from '../permissions';

export async function getUsers({ userIds }: { userIds: string[] }) {
  const user = await requireUser();
  if (!Array.isArray(userIds) || userIds.length > 100 || userIds.some(id => typeof id !== 'string' || id.length > 128)) throw new Error('Invalid user lookup.');
  const { data: rooms } = await liveblocks.getRooms({ userId: user.id });
  const allowed = new Set([user.id, ...rooms.flatMap(room => Object.keys(room.usersAccesses))]);
  const users = await findUsers(userIds.filter(id => allowed.has(id)));
  const byId = new Map(users.filter((item): item is User => Boolean(item)).map(item => [item.id, item]));
  return userIds.map(id => byId.get(id));
}

export async function getDocumentUsers({ roomId, text }: { roomId: string; currentUser?: string; text: string }) {
  const user = await requireUser();
  const room = await liveblocks.getRoom(roomId);
  assertDocumentAccess(room, user.id);
  const users = await findUsers(Object.keys(room.usersAccesses));
  const query = text.slice(0, 100).toLowerCase();
  return users.filter((item): item is User => Boolean(item && item.id !== user.id && (item.email.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)))).map(item => item.id);
}

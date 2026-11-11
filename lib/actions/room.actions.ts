'use server';
import { nanoid } from 'nanoid';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUser } from '../session';
import { findUserByEmail } from '../users';
import { assertDocumentAccess, canAccessDocument } from '../permissions';

export async function createDocument() {
  const user = await requireUser();
  const room = await liveblocks.createRoom(nanoid(), {
    metadata: { creatorId: user.id, email: user.email, title: 'Untitled' },
    usersAccesses: { [user.id]: ['room:write'] }, defaultAccesses: [],
  });
  revalidatePath('/');
  return room;
}
export async function getDocument(roomId: string) {
  const user = await requireUser();
  const room = await liveblocks.getRoom(roomId);
  return canAccessDocument(room, user.id) ? room : null;
}
export async function getDocuments() {
  const user = await requireUser();
  return liveblocks.getRooms({ userId: user.id });
}
export async function updateDocument(roomId: string, title: string) {
  const user = await requireUser();
  assertDocumentAccess(await liveblocks.getRoom(roomId), user.id, 'write');
  if (typeof title !== 'string' || !title.trim() || title.length > 200) throw new Error('Use a title between 1 and 200 characters.');
  const room = await liveblocks.updateRoom(roomId, { metadata: { title: title.trim() } });
  revalidatePath('/'); revalidatePath('/documents/' + roomId);
  return room;
}
export async function updateDocumentAccess({ roomId, email, userType }: ShareDocumentParams) {
  const user = await requireUser();
  const existing = await liveblocks.getRoom(roomId);
  assertDocumentAccess(existing, user.id, 'owner');
  if (userType !== 'editor' && userType !== 'viewer') throw new Error('Choose editor or viewer access.');
  const collaborator = await findUserByEmail(email);
  if (!collaborator) throw new Error('Ask this person to create a SmartDocs account first.');
  if (collaborator.id === existing.metadata.creatorId) throw new Error('The document owner must keep owner access.');
  const permissions: AccessType = userType === 'editor' ? ['room:write'] : ['room:read', 'room:presence:write'];
  const room = await liveblocks.updateRoom(roomId, { usersAccesses: { [collaborator.id]: permissions } });
  await liveblocks.triggerInboxNotification({ userId: collaborator.id, kind: '$documentAccess', subjectId: nanoid(), roomId,
    activityData: { userType, title: 'You have been granted ' + userType + ' access to the document by ' + user.name, updatedBy: user.name, avatar: user.avatar, email: user.email },
  });
  revalidatePath('/documents/' + roomId);
  return room;
}
export async function removeCollaborator({ roomId, email }: { roomId: string; email: string }) {
  const user = await requireUser();
  const room = await liveblocks.getRoom(roomId);
  assertDocumentAccess(room, user.id, 'owner');
  const collaborator = await findUserByEmail(email);
  if (!collaborator || !room.usersAccesses[collaborator.id]) throw new Error('Collaborator not found.');
  if (collaborator.id === room.metadata.creatorId) throw new Error('The document owner cannot be removed.');
  const updated = await liveblocks.updateRoom(roomId, { usersAccesses: { [collaborator.id]: null } });
  revalidatePath('/documents/' + roomId);
  return updated;
}
export async function deleteDocument(roomId: string) {
  const user = await requireUser();
  assertDocumentAccess(await liveblocks.getRoom(roomId), user.id, 'owner');
  await liveblocks.deleteRoom(roomId);
  revalidatePath('/'); redirect('/');
}

type RoomPermissions = { metadata: { creatorId?: unknown }; usersAccesses: Record<string, readonly string[] | null> };
export type DocumentAccess = 'read' | 'write' | 'owner';

export function canAccessDocument(room: RoomPermissions, userId: string, access: DocumentAccess = 'read') {
  if (room.metadata.creatorId === userId) return true;
  if (access === 'owner') return false;
  const permissions = room.usersAccesses[userId] || [];
  return permissions.includes('room:write') || (access === 'read' && permissions.includes('room:read'));
}

export function assertDocumentAccess(room: RoomPermissions, userId: string, access: DocumentAccess = 'read') {
  if (!canAccessDocument(room, userId, access)) throw new Error('You do not have permission to perform this action.');
}

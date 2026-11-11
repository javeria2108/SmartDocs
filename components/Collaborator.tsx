import Image from 'next/image';
import React, { useState } from 'react'
import UserTypeSelector from './UserTypeSelector';
import { Button } from './ui/button';
import { removeCollaborator, updateDocumentAccess } from '@/lib/actions/room.actions';
import { useRouter } from 'next/navigation';

const Collaborator = ({ roomId, creatorId, collaborator, email }: CollaboratorProps) => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [userType, setUserType] = useState(collaborator.userType || 'viewer');
  const [loading, setLoading] = useState(false);

  const shareDocumentHandler = async (type: string) => {
    setLoading(true);

    try { await updateDocumentAccess({
      roomId,
      email,
      userType: type as UserType,
    });
    setError(''); router.refresh(); }
    catch { setError('Unable to update access.'); }
    finally { setLoading(false); }
  }

  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);

    try { await removeCollaborator({ roomId, email }); setError(''); router.refresh(); }
    catch { setError('Unable to remove this collaborator.'); }
    finally { setLoading(false); }
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-3">
      {error && <p role="alert" className="w-full text-sm text-red-300">{error}</p>}
      <div className="flex gap-2">
        <Image
          src={collaborator.avatar}
          alt={collaborator.name}
          width={36}
          height={36}
          className="size-9 rounded-full"
        />
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-blue-100">
              {loading && 'updating...'}
            </span>
          </p>
          <p className="text-sm font-light text-blue-100">
            {collaborator.email}
          </p>
        </div>
      </div>

      {creatorId === collaborator.id ? (
        <p className="text-sm text-blue-100">Owner</p>
      ): (
        <div className="flex items-center">
          <UserTypeSelector
            userType={userType as UserType}
            setUserType={setUserType || 'viewer'}
            onClickHandler={shareDocumentHandler}
          />
          <Button type="button" onClick={() => removeCollaboratorHandler(collaborator.email)}>
            Remove
          </Button>
        </div>
      )}
    </li>
  )
}

export default Collaborator

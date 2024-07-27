import { useOthers } from '@liveblocks/react/suspense';
import Image from 'next/image';

// Define a type for User Info if you don't already have one
type IUserInfo = {
  id: string;
  avatar: string;
  name: string;
  color: string;
};

const ActiveCollaborators = () => {
  const others = useOthers();

  // Type guard to filter and assert the type
  const collaborators = others.map((other) => other.info).filter((info): info is IUserInfo => {
    return info !== undefined && 
           typeof info.id === 'string' &&
           typeof info.avatar === 'string' &&
           typeof info.name === 'string' &&
           typeof info.color === 'string';
  });

  return (
    <ul className="collaborators-list">
      {collaborators.map(({ id, avatar, name, color }) => (
        <li key={id}>
          <Image 
            src={avatar}
            alt={name}
            width={100}
            height={100}
            className='inline-block size-8 rounded-full ring-2 ring-dark-100'
            style={{border: `3px solid ${color}`}}
          />
        </li>
      ))}
    </ul>
  )
}

export default ActiveCollaborators;

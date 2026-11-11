import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth } from './auth';
import { publicUser } from './users';

export async function currentUser(): Promise<User | null> {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return session ? publicUser(session.user) : null;
}
export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) throw new Error('Please sign in to continue.');
  return user;
}
export async function requirePageUser(): Promise<User> {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  return user;
}

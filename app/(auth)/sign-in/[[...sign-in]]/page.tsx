import { AuthForm } from '@/components/AuthForm';
import { currentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
export default async function AuthPage() {
  if (await currentUser()) redirect('/');
  return <main className="auth-page px-4 py-10"><AuthForm mode="sign-in" /></main>;
}

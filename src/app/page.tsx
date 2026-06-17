import { redirect } from 'next/navigation';

// Root "/" redirects to /login (middleware handles the auth logic)
export default function RootPage() {
  redirect('/login');
}

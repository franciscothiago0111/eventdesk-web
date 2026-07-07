import { LoginForm } from './_components/login-form';

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">eventdesk</h1>
      <LoginForm />
    </div>
  );
}

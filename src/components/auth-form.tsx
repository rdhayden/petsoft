import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type AuthFormProps = {
  submitLabel: 'Sign up' | 'Log in';
};

export default function AuthForm({ submitLabel }: AuthFormProps) {
  console.log('AuthForm rendered with submitLabel:', submitLabel);
  return (
    <form>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" />
      </div>
      <div className="mb-4 mt-2 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" />
      </div>

      <Button className="w-full">{submitLabel}</Button>
    </form>
  );
}

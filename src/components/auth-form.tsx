'use client';

import { logIn, signUp } from '@/actions/actions';
import { Input } from './ui/input';
import { Label } from './ui/label';
import AuthFormButton from './auth-form-btn';
import { useFormState } from 'react-dom';

type AuthFormProps = {
  submitLabel: 'Sign up' | 'Log in';
};

export default function AuthForm({ submitLabel }: AuthFormProps) {
  const [signUpError, dispatchSignUp] = useFormState(signUp, undefined);
  const [logInError, dispatchLogIn] = useFormState(logIn, undefined);
  
  // Note server actions typically applied with the action attribute
  // rather than onSubmit, because onSubmit requires client side events 
  // and javascript, action calls an endpoint on the server so you get 
  // 'progressive enhancement', the form is available immediately you don't 
  // need to wait for JS to load

  // we would probably want to redirect to the page the user was actually trying to access
  // when they got redirected to the login page or to the dashbaord 
  // if coming directly to the login page. If you get redirected the login page URL will
  // include a callbackUrl parameter in the URL
  // So we could replace the logIn function in action with a function that 
  // that calls login and uses useRouter on the client side to route to the  URL the user was 
  // originally trying to access

  return (
    <form action={submitLabel === 'Log in' ? dispatchLogIn : dispatchSignUp}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required maxLength={100}/>
      </div>
      <div className="mb-4 mt-2 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" name="password" id="password" required maxLength={100}/>
      </div>

      <AuthFormButton submitLabel={submitLabel} />

      {signUpError &&
        <p className="mt-2 text-sm text-red-500">{signUpError.message}</p>
      }
      {logInError &&
        <p className="mt-2 text-sm text-red-500">{logInError.message}</p>
      }
    </form>
  );
}

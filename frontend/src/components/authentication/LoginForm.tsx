import React, { FormEventHandler, useRef } from "react";
import Link from "next/link";
import Button from "../helper/Button";
import TextFiled from "../helper/TextField";
import { AuthData } from "./Authentication";

type Props = {
  onSubmit: (data: AuthData) => void;
  loading: boolean;
};

function LoginForm({ onSubmit, loading }: Props) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data = {
      email: emailRef.current?.value ?? "",
      password: passwordRef.current?.value ?? "",
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={submitHandler}>
      <TextFiled border ref={emailRef} type="email" name="email" />
      <TextFiled border ref={passwordRef} type="password" name="password" />
      <div className="flex justify-between mt-2">
        <Link href="/authentication/signup" className="text-primary-light">
          Create an account?
        </Link>
        <Button loading={loading} type="submit">
          Login
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;

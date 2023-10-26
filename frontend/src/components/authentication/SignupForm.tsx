import React, { FormEventHandler, useRef } from "react";
import TextFiled from "../helper/TextField";
import Link from "next/link";
import Button from "../helper/Button";
import { AuthData, AuthType } from "./Authentication";

type Props = {
  onSubmit: (data: AuthData) => void;
  loading: boolean;
};

function SignupForm({ onSubmit, loading }: Props) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data = {
      name: nameRef.current?.value,
      email: emailRef.current?.value ?? "",
      password: passwordRef.current?.value ?? "",
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={submitHandler}>
      <TextFiled border ref={nameRef} name="name" />
      <TextFiled border ref={emailRef} type="email" name="email" />
      <TextFiled
        border
        min={6}
        ref={passwordRef}
        type="password"
        name="password"
      />
      <div className="flex justify-between mt-2">
        <Link href="/authentication/login" className="text-primary-light">
          Already have a account?
        </Link>
        <Button loading={loading} type="submit">
          Signup
        </Button>
      </div>
    </form>
  );
}

export default SignupForm;

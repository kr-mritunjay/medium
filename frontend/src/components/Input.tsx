// components/Input.tsx
import { SignupInput } from "@mritunjaykr160/medium-common";
import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  const postInput = useState<SignupInput>({
    email: "",
    password: "",
    name: "",
  });
  return (
    <div className="mb-4">
      <label htmlFor={props.id} className="block font-medium mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;

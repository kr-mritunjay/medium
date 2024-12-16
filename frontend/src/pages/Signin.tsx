import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../config";

export const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signin`,
        formData
      );
      console.log(response);
      const jwt = response.data.token;
      console.log(jwt);
      localStorage.setItem("jwt", jwt);
      navigate("/blogs");
    } catch (err) {
      const error = err as AxiosError;
      // console.error("Error during sign-up:", error);
      if (error.response?.status == 500) alert("User doesn't exist!");
      else alert("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <p className="mb-4">
          Don't have an account?{" "}
          <button
            onClick={handleCreateAccount}
            className="text-blue-500 hover:underline"
          >
            Create one
          </button>
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            label="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

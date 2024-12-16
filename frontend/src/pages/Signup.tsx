import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../config";

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignIn = () => {
    navigate("/signin");
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
      // console.log(formData);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        formData
      );
      console.log(response);
      const jwt = response.data.token;
      // console.log(jwt);
      localStorage.setItem("jwt", jwt);
      navigate("/blogs");
    } catch (err) {
      const error = err as AxiosError;
      // console.error("Error during sign-up:", error);
      if (error.response?.status == 500) alert("User already exist!");
      else alert("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create an account</h1>
        <p className="mb-4">
          Already have an account?{" "}
          <button
            onClick={handleSignIn}
            className="text-blue-500 hover:underline"
          >
            Sign In
          </button>
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          <Input
            label="Email"
            id="email"
            type="email"
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
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

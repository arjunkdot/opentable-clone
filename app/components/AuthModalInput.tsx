import React from "react";

interface AuthModalInputProps {
  inputs: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    password: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSignIn: boolean;
}

export default function AuthModalInput({
  inputs,
  handleInputChange,
  isSignIn,
}: AuthModalInputProps) {
  return (
    <div>
      {!isSignIn && (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border rounded px-2 py-3 w-[49%]"
            placeholder="First Name"
            value={inputs.firstName}
            onChange={handleInputChange}
            name="firstName"
          />
          <input
            type="text"
            className="border rounded px-2 py-3 w-[49%]"
            placeholder="Last Name"
            value={inputs.lastName}
            onChange={handleInputChange}
            name="lastName"
          />
        </div>
      )}
      <div className="my-3 flex justify-between text-sm">
        <input
          type="email"
          className="border rounded px-2 py-3 w-full"
          placeholder="Email"
          value={inputs.email}
          onChange={handleInputChange}
          name="email"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          type="password"
          className="border rounded px-2 py-3 w-full"
          placeholder="Password"
          value={inputs.password}
          onChange={handleInputChange}
          name="password"
        />
      </div>
      {!isSignIn && (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="phone"
            className="border rounded px-2 py-3 w-[49%]"
            placeholder="Phone"
            value={inputs.phone}
            onChange={handleInputChange}
            name="phone"
          />
          <input
            type="text"
            className="border rounded px-2 py-3 w-[49%]"
            placeholder="City"
            value={inputs.city}
            onChange={handleInputChange}
            name="city"
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { EventHandler, useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModalInput from "./AuthModalInput";
import useAuth from "../../hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signin, signup } = useAuth();
  const { loading, data, error } = useContext(AuthenticationContext);

  const renderContent = (signInContent: string, signUpContent: string) => {
    return isSignIn ? signInContent : signUpContent;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const [disabled, setDisabled] = useState(true);

  const handleClick = () => {
  
    if (isSignIn) {
      signin({ email: inputs.email, password: inputs.password, handleClose });
    } else {
      signup({
        email: inputs.email,
        password: inputs.password,
        phone: inputs.phone,
        city: inputs.city,
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        handleClose,
      });
    }
  };

  useEffect(() => {
    if (isSignIn) {
      if (inputs.email && inputs.password) {
        return setDisabled(false);
      }
    } else {
      if (
        inputs.email &&
        inputs.password &&
        inputs.firstName &&
        inputs.lastName &&
        inputs.city &&
        inputs.phone
      ) {
        return setDisabled(false);
      }
    }

    setDisabled(true);
  }, [inputs]);

  return (
    <div>
      <button
        onClick={handleOpen}
        className={`${renderContent(
          "bg-blue-400 text-white ",
          ""
        )} border p-1 px-4 rounded mr-3`}>
        {renderContent("Sign in", "Sign Up")}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          {loading ? (
            <div className="pt-24 px-2 h-[600px] flex justify-center">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <div className="p-2 h-[600px]">
              <div className="m-auto">
                <p className="text-2xl font-light text-center mb-3">
                  {renderContent(
                    "Log into your account.",
                    "Create your OpenTable account."
                  )}
                </p>
                <AuthModalInput
                  inputs={inputs}
                  handleInputChange={handleInputChange}
                  isSignIn={isSignIn}
                />
                <button
                  type="submit"
                  className="uppercase bg-red-600 text-white p-3 rounded text-sm w-full mb-10 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={disabled || loading}
                  onClick={handleClick}>
                  {renderContent("Sign in", "Create account")}
                </button>
                {error && <Alert severity="error">{error}</Alert>}
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}

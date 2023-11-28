import axios from "axios";
import { useContext } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";
import { deleteCookie } from "cookies-next";

const useAuth = () => {

    const { setAuthState } = useContext(AuthenticationContext);

    const signin = async ({ email, password, handleClose }: { email: string, password: string, handleClose: () => void }) => {

        setAuthState({
            data: null,
            error: null,
            loading: true
        });

        try {
            const response = await axios.post("/api/auth/signin", {
                email,
                password
            });

            if (!response) throw Error("Email or password is invalid.")

            setAuthState({
                data: response.data,
                error: null,
                loading: false
            });

            handleClose();

        } catch (error: any) {
            setAuthState({
                data: null,
                error: error.response.data.errorMessage,
                loading: false
            });
        }
    }
    const signup = async ({ email,
        password,
        firstName,
        lastName,
        city,
        phone,
        handleClose }:
        {
            email: string,
            password: string,
            firstName: string,
            lastName: string,
            city: string, phone:
            string, handleClose: () => void
        }) => {
        setAuthState({
            data: null,
            error: null,
            loading: true
        });

        try {
            const response = await axios.post("/api/auth/signup", {
                email,
                password,
                firstName,
                lastName,
                city,
                phone,
            });


            setAuthState({
                data: response.data,
                error: null,
                loading: false
            });

            handleClose();

        } catch (error: any) {
            setAuthState({
                data: null,
                error: error.response.data.errorMessage,
                loading: false
            });
        }
    }


    const signout = () => {
        deleteCookie("jwt");
        setAuthState({
            data: null,
            error: null,
            loading: false
        })
    }

    return {
        signin,
        signup,
        signout
    }
};

export default useAuth;
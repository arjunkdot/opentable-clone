import axios from "axios";

const useAuth = () => {
    const baseURL = "http://localhost:3000";
   
    const signin = async ({ email, password }: { email: string, password: string }) => {
        try {
            const response = await axios.post(`${baseURL}/api/auth/signin`, {
                email,
                password
            });

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
    const signup = async () => { }


    return {
        signin,
        signup
    }
};

export default useAuth;
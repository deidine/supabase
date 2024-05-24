import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"; // Importing useForm hook
import supabase from "./config/supabaseClient";

const Signup = () => {
  const { register, handleSubmit } = useForm(); // Destructuring the useForm hook

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async ( data:any) => {
    const {email,password}=data
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (!error && data) {
        setMsg("Registration Successful. Check your email to confirm your account");
      }
    } catch (error) {
      setErrorMsg("Error in Creating Account");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="max-w-sm mx-auto">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit(handleSignup )}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email",{ required: true })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
        
                 {...register("password",{ required: true })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
             </div>
            <div className="mb-6">
            </div>
            <div className="text-center">
              <button
                disabled={loading}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="text-center mt-4">
        Already a User? <Link to="/login" className="text-blue-500">Login</Link>
      </div>
    </>
  );
};

export default Signup;

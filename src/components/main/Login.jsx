import axios from "axios";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserDetail } from "../../redux/userSlice";
import { baseUrl } from "../../utils/constant";

// const url = "http://localhost:8009/api/user/login";
const url = `${baseUrl}/api/user/login`;

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    // console.log(data);
    const dataa = await axios.post(url, data).then((res) => {
      reset();
      // console.log(res.data.user);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      dispatch(setUserDetail(res.data.user));
      navigate("/");
      return res.data;
    });
    // console.log(dataa);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="bg-light p-8 rounded shadow-md w-96">
        <h2 className="text-primary text-lg font-thin mb-1">
          Let&apos;s Connect
        </h2>
        <h2 className="text-primary text-2xl font-semibold mb-6">Login Here</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              {...register("email", { required: "*email is required" })}
              className="mt-1 text-dark bg-secondary p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
            />
            <small className=" text-red-700">{errors?.email?.message}</small>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              {...register("password", { required: "*password is required" })}
              className="mt-1 text-dark bg-secondary p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
            />
            <small className=" text-red-700">{errors?.password?.message}</small>
          </div>
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:border-primary"
          >
            Login
          </button>
          <p className=" text-xs text-dark text-center mt-4">
            Don&apos;t have an account?{" "}
            <strong
              className=" text-primary cursor-pointer"
              onClick={() => navigate("/user/signup")}
            >
              Sign Up
            </strong>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

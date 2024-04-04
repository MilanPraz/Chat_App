import girl from "../../assets/girl.jpg";
import boy1 from "../../assets/boy1.jpg";
import boy2 from "../../assets/boy2.jpg";
import boy3 from "../../assets/boy3.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { setUserDetail } from "../../redux/userSlice";
import { baseUrl } from "../../utils/constant";

const url = `${baseUrl}/`;

function LeftBoard({ fetchMessages }) {
  const [toggle, setToggle] = useState(false);
  const [picture, setPicture] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.user.value);
  // console.log(userDetail);
  // console.log("yooooooooo");
  // const {
  //   isLoading,
  //   data: users,
  //   error,
  // } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: async () => fetchData(),
  // });
  // console.log(error);
  // console.log(users);
  // console.log(userDetail);
  // const { _id: id } = userDetail;
  // console.log(id);
  // console.log("helo");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseUrl}/api/chat/${userDetail?._id}`
        );
        // console.log(response.data);
        setChatUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        // console.error("Error fetching chat data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userDetail?._id]);

  function handleTriggerInput() {
    inputRef.current.click();
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setPicture(file);
  }

  async function handleSubmitImage() {
    const fd = new FormData();

    fd.append("pic", picture);
    fd.append("id", userDetail?._id);
    // console.log(userDetail?._id);
    fetch(`${baseUrl}/api/changeimage`, {
      method: "PUT",
      body: fd,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        dispatch(setUserDetail(data));
      })
      .catch((error) => console.log("Error:", error));

    // console.log(...fd);
    setToggle(false);
  }
  // const { pic } = userDetail;
  // console.log(chatUsers);

  return (
    <div className=" container mx-auto px-4 relative">
      {toggle === true && (
        <div className=" h-auto p-4 flex flex-col items-center justify-center w-1/2 md:w-full bg-primary absolute rounded-md top-20 ">
          {picture ? (
            <img
              className=" rounded-full object-cover  object-top w-40 h-40"
              alt="profile picture"
              src={URL.createObjectURL(picture)}
            />
          ) : null}
          <label
            onClick={() => handleTriggerInput()}
            className=" mt-4  cursor-pointer hover:border-purple-700  text-xs  p-4 rounded-md border-2 border-dotted border-secondary"
            htmlFor="file"
          >
            Change Profile Picture
          </label>
          <input
            onChange={handleImageChange}
            ref={inputRef}
            accept=".jpeg, .png, .jpg, .webp"
            type="file"
            className=" hidden"
          ></input>
          <button
            onClick={() => handleSubmitImage()}
            className=" bg-secondary px-2 py-1 rounded-md mt-4 text-dark text-xs hover:scale-110 transition-transform duration-300 ease-in-out hover:drop-shadow-lg  hover:text-primary"
          >
            Save
          </button>
        </div>
      )}
      <div
        onClick={() => setToggle(!toggle)}
        className=" flex justify-around items-center  bg-slate-400 py-4 rounded-2xl  shadow-slate-500 shadow-md"
      >
        <img
          src={`${url}${userDetail?.pic}`}
          className=" w-12 h-12 rounded-full border-2 border-primary p-[2px] object-cover object-top"
        />
        <div>
          <h3 className=" text-lg">{userDetail?.name}</h3>
          <p className=" text-sm font-light">My Account</p>
        </div>
      </div>

      <div className=" mt-8">
        <h2 className=" text-primary text-xl">Messages</h2>
        <hr className=" h-[1px] rounded-3xl mb-8 mt-1 outline-none border-none w-full bg-primary" />
        <div className=" flex flex-col gap-4 items-left pl-8">
          {isLoading === true ? <h2>Loading...</h2> : null}
          {chatUsers?.length === 0 && (
            <h2 className=" text-xl font-semibold text-dark text-center my-2">
              No Converstions
            </h2>
          )}
          {chatUsers?.map((user, index) => (
            <div
              onClick={() => fetchMessages(user.chatId, user)}
              key={index}
              className=" flex justify-around gap-8 items-center border-b-[0.5px] border-slate-500  pb-2"
            >
              <img
                src={`${url}${user.user.pic}`}
                className=" grow-0 w-12 h-12 rounded-full border-2 border-primary p-[2px] object-cover object-top"
              />
              <div className=" grow">
                <h3 className=" text-lg">{user.user.name}</h3>
                <p className=" text-sm font-light">{user.user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeftBoard;

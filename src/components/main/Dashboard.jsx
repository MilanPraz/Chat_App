import axios from "axios";
import LeftBoard from "../sub/LeftBoard";
import MiddleBoard from "../sub/middleBoard";
import { useEffect, useRef, useState } from "react";
import RightBoard from "../sub/RightBoard";
import { useSelector } from "react-redux";
// const url = "http://localhost:8009/api";
import { io } from "socket.io-client";
import { baseUrl } from "../../utils/constant";

function Dashboard() {
  const [messages, setMessgaes] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [receiverOnline, setReceiverOnline] = useState(false);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [menu, setMenu] = useState("chat");
  const messageRef = useRef(null);

  const userDetail = useSelector((state) => state.user.value);
  console.log(messages);
  async function fetchMessages(id, ReceiverUser) {
    setMessgaes({});
    setLoading(true);
    // console.log(id);
    // console.log(ReceiverUser);
    handleMenu("message");
    await axios.get(`${baseUrl}/api/message/${id}`).then((res) => {
      setLoading(false);
      // console.log(res.data);
      setMessgaes({ messages: res.data, receiver: ReceiverUser });
    });
  }

  async function fetchConvo(id, ReceiverUser) {
    setMessgaes({});
    setLoading(true);
    handleMenu("message");
    // console.log(id);
    // console.log(userDetail._id);
    // console.log(ReceiverUser);
    await axios
      .get(`${baseUrl}/api/message/${id}`, {
        params: {
          senderId: userDetail?._id,
          receiverId: ReceiverUser.user._id,
        },
      })
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        setMessgaes({ messages: res.data, receiver: ReceiverUser });
      });
  }
  const token = localStorage.getItem("token");
  // console.log(userDetail?._id);
  // console.log(myid);
  useEffect(() => {
    axios
      .get(
        `${baseUrl}/api/user`,

        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setSocket(io(`${baseUrl}`));
  }, []);
  // console.log(socket);
  // console.log(userDetail?._id);
  useEffect(() => {
    if (userDetail?._id) {
      socket?.emit("addUser", userDetail?._id);
      socket?.on("getUsers", (users) => {
        console.log("active users", users);
        const receiver = users.find(
          (user) => user?.userId === messages?.receiver?.user?._id
        );
        if (receiver === undefined) {
          setReceiverOnline(false);
        } else {
          setReceiverOnline(true);
        }
        console.log(receiver);
      });
    }
    socket?.on("getMessage", (data) => {
      console.log("khoi tw");
      console.log(data);
      console.log(data.userDetail);

      setMessgaes((prev) => {
        const isDuplicate = prev.messages.some(
          (msg) =>
            msg.user._id === data.userDetail._id && msg.message === data.message
        );
        console.log(prev);
        console.log("duplicateeeeeeeeeeeeee", isDuplicate);
        if (!isDuplicate) {
          return {
            ...prev,
            messages: [
              ...prev.messages,
              { user: data.userDetail, message: data.message },
            ],
          };
        }
        return prev;
      });
    });
  }, [socket, userDetail?._id, messages]);
  // console.log(messages?.receiver);
  console.log(messages);
  console.log(receiverOnline);
  //to scroll down to latest messgae
  useEffect(() => {
    console.log(messageRef?.current?.scrollIntoView());
  }, [messages?.messages]);

  function handleMenu(menuTitle) {
    if (menuTitle === "chat") {
      setMenu("chat");
    }
    if (menuTitle === "message") {
      setMenu("message");
    }
    if (menuTitle === "people") {
      setMenu("people");
    }
  }

  return (
    <>
      <section className=" w-screen flex md:flex-row flex-col">
        <div className=" md:hidden fixed top-0  bg-light z-40 w-full drop-shadow-lg  block">
          <div className=" flex gap-10 py-4 font-semibold text-gray-400 items-center justify-center">
            <span
              onClick={() => handleMenu("chat")}
              className={` ${
                menu === "chat" ? "text-primary" : null
              } cursor-pointer   `}
            >
              Messages
            </span>
            <span
              onClick={() => handleMenu("message")}
              className={` ${
                menu === "message" ? "text-primary" : null
              } cursor-pointer`}
            >
              Chat Room
            </span>
            <span
              onClick={() => handleMenu("people")}
              className={` ${
                menu === "people" ? "text-primary" : null
              }  cursor-pointer`}
            >
              People
            </span>
          </div>
        </div>
        <section className=" w-full hidden md:flex ">
          <div className=" w-full md:w-[25%] bg-dark pt-4  h-screen md:h-screen">
            <LeftBoard fetchMessages={fetchMessages} />
          </div>
          <div className="w-full md:w-[50%] bg-slate-300">
            <MiddleBoard
              socket={socket}
              isLoading={isLoading}
              messages={messages}
              messageRef={messageRef}
            />
          </div>
          <div
            className=" w-full md:w-[25%]   bg-dark
          "
          >
            <RightBoard fetchConvo={fetchConvo} users={users} />
          </div>
        </section>
        {/* for mobile view */}
        <section className=" w-full flex flex-col md:hidden mt-14 ">
          {menu === "chat" && (
            <div className=" w-full md:w-[25%] bg-dark pt-4  h-screen md:h-screen">
              <LeftBoard fetchMessages={fetchMessages} />
            </div>
          )}
          {menu === "message" && (
            <div className="w-full md:w-[50%]  bg-slate-300">
              <MiddleBoard
                receiverOnline={receiverOnline}
                socket={socket}
                isLoading={isLoading}
                messages={messages}
                messageRef={messageRef}
              />
            </div>
          )}
          {menu === "people" && (
            <div
              className=" w-full md:w-[25%]   bg-dark
          "
            >
              <RightBoard fetchConvo={fetchConvo} users={users} />
            </div>
          )}
        </section>
      </section>
    </>
  );
}

export default Dashboard;

import girl from "../../assets/girl.jpg";
import "../../App.css";
import { FiSend } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/constant";

const url = `${baseUrl}/`;

function MiddleBoard({
  messages,
  isLoading,
  socket,
  messageRef,
  receiverOnline,
}) {
  const [messgae, setMessgae] = useState("");

  const userDetail = useSelector((state) => state.user.value);

  // console.log(messages.receiver?.chatId || "new");
  // console.log(messages.receiver?.user?._id);
  // console.log(messgae);
  // console.log(userDetail?._id);
  async function handleSubmit(e) {
    socket?.emit("sendMessage", {
      chatId: messages?.receiver?.chatId,
      message: messgae,
      senderId: userDetail._id,
      receiverId: messages?.receiver?.user?._id,
    });
    e.preventDefault();
    await axios
      .post(`${baseUrl}/api/message`, {
        chatId: messages?.receiver?.chatId || "new",
        message: messgae,
        senderId: userDetail._id,
        receiverId: messages?.receiver?.user?._id,
      })
      .then((res) => {
        // console.log(res.data);
        setMessgae("");
      })
      .catch((err) => console.log(err));
  }
  // console.log(messages);
  // console.log(isLoading);
  useEffect(() => {
    // console.log(messageRef?.current?.scrollIntoView());
  }, []);

  return (
    <div className=" container mx-auto px-4 flex flex-col justify-around h-[95vh]  ">
      {!messages?.receiver ? null : (
        <div className=" flex gap-4 items-center mt-4 mb-4  drop-shadow-lg bg-dark px-2 py-2 rounded-full">
          <div className=" grow-0">
            <img
              src={`${url}${messages.receiver?.user?.pic}`}
              className=" w-14 h-14 object-cover object-top rounded-full"
            />
          </div>
          <div className="grow">
            <h2 className=" text-lg">{messages.receiver?.user?.name}</h2>
            <p className=" text-xs">Friend</p>
          </div>
          <div
            className={` h-4 w-4 rounded-full  mr-4 ${
              receiverOnline === true ? "bg-green-700" : "bg-slate-400"
            }`}
          ></div>
        </div>
      )}
      <div className="scrollbar-hide  h-[450px] md:h-96  rounded-2xl  mb-4  w-full overflow-scroll ">
        <div className="  flex flex-col gap-3">
          {messages?.messages?.length > 0 ? (
            messages?.messages?.map(({ message, user }, index) => {
              // const userId = id.toString();
              // console.log(typeof user);
              // console.log(user);
              // console.log(message);
              if (userDetail._id === user._id) {
                return (
                  <div key={index}>
                    <div
                      key={index}
                      className=" max-w-[50%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-2 text-xs "
                    >
                      {message}
                    </div>
                    <div ref={messageRef}></div>
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <div
                      key={index}
                      className=" max-w-[50%]  bg-secondary rounded-b-xl rounded-tr-xl mr-auto text-xs text-dark  p-2"
                    >
                      {message}
                    </div>
                    <div ref={messageRef}></div>
                  </div>
                );
              }
            })
          ) : isLoading === true ? (
            <h2 className=" text-center mt-20 font-semibold text-2xl text-dark mx-auto">
              Loading...
            </h2>
          ) : (
            <div className=" text-center text-dark  mt-[10%]">
              <h2>No messages or No Conversation Selected</h2>
            </div>
          )}
        </div>
      </div>
      <div>
        {!messages?.receiver ? null : (
          <form
            onSubmit={(e) => handleSubmit(e)}
            className=" flex items-center justify-between gap-2 "
          >
            <input
              value={messgae}
              onChange={(e) => setMessgae(e.target.value)}
              placeholder=" Type a messgae..."
              className=" bg-secondary text-dark text-xs outline-none p-2 w-full rounded-full  drop-shadow-md"
            />
            <button
              type="submit"
              className={` bg-white p-3  rounded-full ${
                !messgae && "pointer-events-none"
              }`}
            >
              <FiSend className=" text-primary self-center" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default MiddleBoard;

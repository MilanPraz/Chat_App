import "../../App.css";
const url = "http://localhost:8009/";

function RightBoard({ users, fetchConvo }) {
  // console.log(users);
  return (
    <div className="scrollbar-hide   pb-16 px-8 h-[100vh] overflow-y-auto ">
      <h2 className="  text-primary my-8">People</h2>
      <div className="  flex flex-col gap-4">
        {users?.map((user, index) => (
          <div
            onClick={() => fetchConvo("new", { user })}
            key={index}
            className=" flex justify-around gap-8 items-center border-b-[0.5px] border-slate-500  pb-2"
          >
            <img
              src={`${url}${user.pic}`}
              className=" grow-0 w-12 h-12 rounded-full border-2 border-primary p-[2px] object-cover object-top"
            />
            <div className=" grow">
              <h3 className=" text-lg">{user?.name}</h3>
              <p className=" text-sm font-light">{user?.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RightBoard;

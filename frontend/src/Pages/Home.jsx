import Sidebar from "../Components/Sidebar"
import { useEffect, useRef, useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "../Components/Header";
import { ChatData } from "../context/ChatContext";
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { LoadingBig, LoadingSmall } from "../Components/Loading";
import { IoMdSend } from "react-icons/io";
const Home = () => {
  const [isOpen,setIsOpen]=useState(true);

  const toggleSidebar=()=>{
    setIsOpen(!isOpen);
  }
  const{fetchResponse,messages,prompt,setPrompt,newRequestLoading,loading,chats}=ChatData();
  const submitHandler=(e)=>{
    e.preventDefault();
    fetchResponse();
  }
  const messageContainerRef=useRef();
  useEffect(() => {
    if(messageContainerRef.current){
      messageContainerRef.current.scrollTo({
        top:messageContainerRef.current.scrollHeight,
        behaviour:"smooth"
      })
    }
  

  }, [messages])
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar}/>
      <div className="flex flex-1 flex-col">
        <button onClick={toggleSidebar} className="md:hidden p-4 bg-gray-800 text-2xl"><GiHamburgerMenu /></button>
        <div className="flex-1 p-6 mb-20 d:mb-0">
          <Header/>
          {
            loading?<LoadingBig/>:
            <div className="flex-1 p-6 max-h-[750px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar" ref={messageContainerRef}>
            {
              messages && messages.length>0? messages.map((element,index)=>(
                <div key={index}>
                  <div className="mb-4 p-4 rounded bg-blue-700 text-white flex gap-1">
                  <div className="bg-white p-2 rounded-full text-black text-2xl h-10">
                  <CgProfile />
                  </div>
                  {element.question}
                  </div>

                  <div className="mb-4 p-4 rounded bg-gray-700 text-white flex gap-1">
                  <div className="bg-white p-2 rounded-full text-black text-2xl h-10">
                  <FaRobot />
                  </div>
                  <p dangerouslySetInnerHTML={{__html:element.answer  }}></p>
                  </div>
                </div>
              )):(<p>No Chat Yet</p>

              )}
              {newRequestLoading && <LoadingSmall/>}
          </div>
          }
        </div>
      </div>
          {
            chats && chats.length===0?"":
            <div className="fixed bottom-0 right-0 left-auto p-4 bg-gray-900 w-full md:w-[75%]">
            <form onSubmit={submitHandler} className="flex justify-center items-center">
              <input className="flex-grow p-4 bg-gray-700 rounded-l text-white outline-none" type="text" placeholder="Enter a Prompt Here" value={prompt} onChange={e=>setPrompt(e.target.value)} required />
              <button className="p-4 bg-gray-700 rounded-r text-2xl text-white"><IoMdSend /></button>
            </form>
          </div>
          }
    </div>
  )
}

export default Home

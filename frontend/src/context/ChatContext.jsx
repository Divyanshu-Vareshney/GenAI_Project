import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const ChatContext = createContext();
import { server } from '../main.jsx'
import toast from "react-hot-toast";


export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [newRequestLoading, setNewRequestLoading] = useState(false);
    const [createLod, setCreateLod] = useState(false);
    const [chats, setChats] = useState([]);
    const [selected,setSelected]=useState(null);
    const [loading,setLoading]=useState(false);

    async function fetchResponse() {
        if (!selected) {
            console.error("No selected chat available");
            return;
        }
        if (prompt === "") {
            return alert("Write Prompt");
        }
    
        setNewRequestLoading(true);
        setPrompt("");
    
        try {
            const response = await axios({
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBbK9Eg_CHcKnxYWUpL02L9xg-22dYpa4M",
                method: "post",
                data: { contents: [{ parts: [{ text: prompt }] }] }
            });
    
            const message = {
                question: prompt,
                answer: response.data.candidates[0].content.parts[0].text,
            };
    
            setMessages((prev) => [...prev, message]);
            setNewRequestLoading(false);
    
            // Validate selected before making POST request
            if (!selected) {
                console.error("No selected chat available for saving message");
                return;
            }
    
            await axios.post(
                `${server}/api/chat/${selected}`,
                {
                    question: prompt,
                    answer: response.data.candidates[0].content.parts[0].text,
                },
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );
        } catch (error) {
            console.error("Error posting data to backend:", error.response?.data || error.message);
            alert("Something went wrong");
            setNewRequestLoading(false);
        }
    }

    async function fetchChats() {
        try {
            const { data } = await axios.get(`${server}/api/chat/all`, {
                headers: {
                    token: localStorage.getItem("token"),
                }
            })
            setChats(data);
            setSelected(data[0]._id);
        } catch (error) {
            console.log(error);

        }
    }

    async function createChat() {
        setCreateLod(true);
        try {
            const { data } = await axios.post(`${server}/api/chat/new`, {}, {
                headers: {
                    token:localStorage.getItem("token")
                }
            });
            fetchChats();
            setCreateLod(false)
        } catch (error) {
            toast.error("Something went wrong");
            setCreateLod(false);
            console.log(error);

        }

    }



    async function fetchMessages(){
        setLoading(true);
        try {
            const {data}=await axios.get(`${server}/api/chat/${selected}`,{
                headers:{
                    token:localStorage.getItem("token"),
                }
            })
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            
        }
    }
    async function deleteChat(id) {
        try {
            const {data}=await axios.delete(`${server}/api/chat/${id}`,{
                headers:{
                    token:localStorage.getItem("token")
                }
            })
            toast.success(data.message);
            fetchChats();
            window.location.reload();
            
        } catch (error) {
            toast.error("something went wrong")
            console.log(error);
            
        }
    }


    useEffect(() => {
        fetchChats()
    }, []);
    
    useEffect(()=>{
        fetchMessages();
    },[selected]);

    return <ChatContext.Provider value={{ fetchResponse,
         messages, 
         prompt,
         setPrompt, 
         newRequestLoading, 
         chats, 
         createChat, 
         createLod,
        selected,
        setSelected,
        loading,
        setLoading,
        deleteChat,
        fetchChats
    }}>{children}</ChatContext.Provider>
}
export const ChatData = () => useContext(ChatContext);
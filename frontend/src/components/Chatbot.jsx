const Icon = ({ name, size = 20 }) => {
    const icons = {
        sparkle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>,
        send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
        close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    };
    return icons[name] || null;
};

const Chatbot = ({ dark, colors }) => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([{ from: "bot", text: "👋 Hi! I'm your AI study assistant. Ask me anything about your questions or concepts!", time: new Date() }]);
    const [chatInput, setChatInput] = useState("");
    const [botTyping, setBotTyping] = useState(false);
    const chatRef = useRef(null);
   
     // Scroll chat
    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages, botTyping]);

    // Load chat history on open
    useEffect(() => {
        if (chatOpen && messages.length === 1) {
            chatbotAPI.getHistory().then(r => {
                const hist = r.data.data.messages || [];
                if (hist.length > 0) {
                    setMessages([messages[0], ...hist.map(m => ({ from: m.role === "user" ? "user" : "bot", text: m.content, time: new Date(m.timestamp) }))]);
                }
            }).catch(() => { });
        }
    }, [chatOpen]);


};
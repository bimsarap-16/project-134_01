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

     const sendMessage = async () => {
        if (!chatInput.trim()) return;
        const text = chatInput.trim();
        setMessages(m => [...m, { from: "user", text, time: new Date() }]);
        setChatInput("");
        setBotTyping(true);
        try {
            const res = await chatbotAPI.ask(text);
            setMessages(m => [...m, { from: "bot", text: res.data.data.reply.replace(/\*\*/g, ""), time: new Date() }]);
        } catch (e) {
            setMessages(m => [...m, { from: "bot", text: e.response?.data?.message || "Sorry, AI is temporarily unavailable.", time: new Date() }]);
        } finally { setBotTyping(false); }
    };

         return (
        <>
            {/* CHAT BUTTON */}
            {!chatOpen && (
                <button onClick={() => setChatOpen(true)} style={{ position: "fixed", bottom: 28, right: 28, zIndex: 200, width: 60, height: 60, borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", cursor: "pointer", fontSize: 26, boxShadow: "0 8px 32px rgba(59,130,246,0.5)", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-ring 3s ease-in-out infinite" }}>
                    💡
                </button>
            )}

            {/* CHAT WINDOW */}
            {chatOpen && (
                <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 200, width: 380, height: 550, borderRadius: 28, background: dark ? "rgba(17,24,39,0.98)" : "linear-gradient(135deg, #f0f9ff, #e0f2fe)", border: "none", backdropFilter: "blur(24px)", boxShadow: "0 24px 80px rgba(59,130,246,0.2)", display: "flex", flexDirection: "column", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                    <div style={{ padding: "18px 20px", borderBottom: "none", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(14,165,233,0.1))", borderRadius: "24px 24px 0 0" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#3b82f6,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💡</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: colors.text }}>AI Assistant</div>
                            <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ width: 6, height: 6, borderRadius: 3, background: "#10b981", display: "inline-block" }} />Online
                            </div>
                        </div>
                        <div onClick={() => setChatOpen(false)} style={{ cursor: "pointer", color: "rgba(59,130,246,0.6)", padding: 4 }}>
                            <Icon name="close" size={20} />
                        </div>
                    </div>
                    <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: "flex", flexDirection: msg.from === "user" ? "row-reverse" : "row", gap: 8, alignItems: "flex-end", animation: "fadeIn 0.3s ease" }}>
                                {msg.from === "bot" && <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#3b82f6,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>💡</div>}
                                <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.from === "user" ? "#bae6fd" : "#ffffff", border: "none", color: msg.from === "user" ? "#0369a1" : colors.text, fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap", boxShadow: msg.from === "bot" ? "0 2px 8px rgba(0,0,0,0.04)" : "none" }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {botTyping && (
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#3b82f6,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💡</div>
                                <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: colors.surfaceAlt || colors.bg, display: "flex", gap: 4, alignItems: "center" }}>
                                    {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: colors.accent, animation: "bounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ padding: "16px 20px", borderTop: "none", display: "flex", gap: 10 }}>
                        <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask about any concept..." style={{ flex: 1, padding: "10px 16px", borderRadius: 12, background: "#ffffff", border: "none", color: colors.text, fontSize: 13.5, outline: "none", fontFamily: "'Calibri', sans-serif" }} />
                        <button onClick={sendMessage} style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(135deg,${colors.accent},#2563eb)`, border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                            <Icon name="send" size={20} />
                        </button>
                    </div>
                </div>
            )}
            
        </>
    );

};
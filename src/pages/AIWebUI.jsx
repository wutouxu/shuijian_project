import React, { useState, useRef, useEffect } from "react";

/**
 * AIWebUI - 极简 ChatGPT 风格页面（React）
 * 特点：
 * 1) 使用 EventSource 连接同源后端 `api/chat/stream`，支持流式渲染；
 * 2) 采用"相对且不以 / 开头"的接口路径，自动适配后端 context-path；
 * 3) 无第三方 UI 依赖，便于被后端直接托管（前后端不分离）。
 */
export default function AiWebUI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', content: string}
  const esRef = useRef(null);

  // 离开页面或组件卸载时，关闭 SSE
  useEffect(() => {
    return () => {
      if (esRef.current) {
        try { esRef.current.close(); } catch {}
        esRef.current = null;
      }
    };
  }, []);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    // 1) 追加用户消息
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");

    // 2) 追加一个助手占位消息（流式过程中不断拼接）
    const assistantIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    // 3) 关闭上一次的流（若存在）
    if (esRef.current) {
      try { esRef.current.close(); } catch {}
      esRef.current = null;
    }

    // 4) 关键：接口路径使用相对形式且不以 / 开头
    const url = `api/chat/stream?message=${encodeURIComponent(text)}&sessionId=demo`;
    const es = new EventSource(url, { withCredentials: false });
    esRef.current = es;

    es.addEventListener("chunk", (evt) => {
      const delta = evt.data || "";
      setMessages(prev => {
        const copy = [...prev];
        copy[assistantIndex] = {
          ...copy[assistantIndex],
          content: (copy[assistantIndex].content || "") + delta
        };
        return copy;
      });
      // 自动滚动到底部
      const box = document.getElementById("chat-box");
      if (box) box.scrollTop = box.scrollHeight;
    });

    es.onerror = () => {
      try { es.close(); } catch {}
      esRef.current = null;
    };
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>AI Chat</div>

      <div id="chat-box" style={styles.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={m.role === "user" ? styles.user : styles.ai}>
            <div style={styles.role}>{m.role === "user" ? "你" : "助手"}</div>
            <div style={styles.bubble}>{m.content}</div>
          </div>
        ))}
      </div>

      <div style={styles.row}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你的问题…"
          onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
          style={styles.input}
        />
        <button onClick={send} style={styles.btn}>发送</button>
      </div>

      <div style={styles.hint}>
        接口：<code>api/chat/stream</code>（相对路径，自动适配后端 context-path）。
      </div>
    </div>
  );
}

const styles = {
  wrap: { 
    maxWidth: 720, 
    margin: "0 auto", 
    padding: "0 16px", 
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    height: "100vh", // 使用视口高度
    display: "flex",
    flexDirection: "column"
  },
  title: { 
    fontSize: 22, 
    fontWeight: 700, 
    marginBottom: 12,
    paddingTop: 40 // 保持顶部间距
  },
  chatBox: { 
    border: "1px solid #e5e7eb", 
    borderRadius: 12, 
    padding: 12, 
    background: "#fafafa", 
    overflowY: "auto",
    flex: 1 // 占据剩余空间
  },
  user: { margin: "10px 0", textAlign: "right" },
  ai: { margin: "10px 0", textAlign: "left" },
  role: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  bubble: { 
    display: "inline-block", 
    textAlign: "left", 
    padding: "10px 12px", 
    borderRadius: 12, 
    background: "#fff", 
    border: "1px solid #e5e7eb", 
    maxWidth: "80%", 
    whiteSpace: "pre-wrap", 
    wordBreak: "break-word" 
  },
  row: { 
    display: "flex", 
    gap: 8, 
    marginTop: 12,
    marginBottom: 12 // 添加底部间距
  },
  input: { 
    flex: 1, 
    padding: "10px 12px", 
    borderRadius: 10, 
    border: "1px solid #e5e7eb" 
  },
  btn: { 
    padding: "10px 16px", 
    borderRadius: 10, 
    border: "1px solid #e5e7eb", 
    background: "#fff", 
    cursor: "pointer" 
  },
  hint: { 
    fontSize: 12, 
    color: "#6b7280", 
    marginBottom: 16 // 添加底部间距
  }
};
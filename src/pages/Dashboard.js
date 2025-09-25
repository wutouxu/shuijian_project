import React, { useEffect, useState } from "react";

/**
 * 业务页：登录成功后进入；进入时会请求后端接口
 * 同时提供“打开 AI 助手”按钮 -> 新开标签页 /ai
 */
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 按你的后端接口改这里；如果 CRA 配了 proxy，/api 会转发到后端
    fetch("/api/data", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // 根据后端返回类型选择 json 或 text
        const ct = res.headers.get("content-type") || "";
        return ct.includes("application/json") ? res.json() : res.text();
      })
      .then((payload) => setData(payload))
      .catch((e) => setData(`加载失败：${e.message}`))
      .finally(() => setLoading(false));
  }, []);

  const openAIInNewTab = () => {
    // 新开一个页面，路由到 /ai（避免直接跨域打开 http://localhost:3000 带来的 iframe 限制）
    const url = `${window.location.origin}/ai`;
    // window.open(url, "_target", "noopener,noreferrer");
    window.location.href = url;
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>业务面板</h2>

      {loading ? (
        <p>加载中...</p>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {typeof data === "string" ? data : JSON.stringify(data, null, 2)}
        </pre>
      )}

      <div style={{ marginTop: 16 }}>
        <button
          onClick={openAIInNewTab}
          style={{
            padding: "10px 16px",
            fontSize: 16,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          打开 AI 助手
        </button>
      </div>
    </div>
  );
}

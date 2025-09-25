import React from "react";

/**
 * 嵌入 Open WebUI 的页面。
 * 优先读取环境变量 REACT_APP_WEBUI_URL（例如 http://localhost:3000 或 /_webui 反代路径）
 * 以便不同环境（本地/云端）灵活切换。
 */
const WEBUI_URL =
  process.env.REACT_APP_WEBUI_URL?.trim() || "http://localhost:3000";

export default function AiWebUI() {
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <iframe
        title="Open WebUI"
        src={WEBUI_URL}
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}

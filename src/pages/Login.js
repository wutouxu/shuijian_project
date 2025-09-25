import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 登录页：输入用户名/密码 -> 调用后端登录 -> 成功后跳转 /dashboard
 */
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setPending(true);
    try {
      // 将用户名和密码作为查询参数传递
      const queryParams = new URLSearchParams({
        username: username,
        password: password
      }).toString();
      
      // 按你的后端真实接口改这里（POST/GET、路径、参数）
      const res = await fetch(`/api/login?${queryParams}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`登录失败：HTTP ${res.status}`);

      navigate("/dashboard");
    } catch (e) {
      setErr(e.message || "登录失败");
    } finally {
      setPending(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>登录</h2>
      <form onSubmit={onSubmit} style={styles.form}>
        <input
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="用户名"
          required
        />
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          required
        />
        <button style={styles.btn} type="submit" disabled={pending}>
          {pending ? "登录中..." : "登录"}
        </button>
        {err && <p style={{ color: "red", marginTop: 8 }}>{err}</p>}
      </form>
    </div>
  );
}

const styles = {
  wrap: { padding: 16, maxWidth: 420, margin: "40px auto" },
  title: { marginBottom: 16, fontSize: 22 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: {
    padding: "10px 12px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  btn: {
    padding: "10px 12px",
    fontSize: 16,
    borderRadius: 8,
    cursor: "pointer",
  },
};

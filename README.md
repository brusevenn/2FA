# OTP.LAB — 公开 TOTP 演示网站

**仅供演示。不得存放真实账户的 2FA 密钥、二维码、恢复码或任何登录凭据。**

本项目在 Cloudflare Worker 上公开展示三个虚构测试令牌（Alpha、Beta、Gamma），使用 RFC 6238 TOTP 原理生成每 30 秒更新一次的六位动态验证码，提供倒计时与复制功能。

## 安全设计
- 3 个测试种子硬编码在 `worker.js` 中，**有意公开**，不具备真实账户登录权限。
- 无真实账户导入功能、无登录后台、无 KV 数据库、无收集个人信息。
- API `/api/demo` 返回测试动态验证码及其到期时间。
- **切勿在仓库中添加任何真实验证器密钥。**

## 部署
仓库内的 `wrangler.toml` 定义 Worker 名为 `2fa`。通过 Cloudflare Workers Builds 与 GitHub 连接后，提交可以触发自动部署；也可以在完成 Wrangler 授权后执行：

```bash
npx wrangler deploy
```

部署的页面：`/`；客户端脚本：`/app.js`；测试 API：`/api/demo`。

## 测试依据
Alpha 的公开测试种子为 ASCII `12345678901234567890`。在 Unix 时间 59 秒，HMAC-SHA1 的六位 TOTP 为 `287082`（RFC 6238 测试向量的末 6 位）。

本仓库是**独立的公开测试页面**，不是 [wuzf/2fa](https://github.com/wuzf/2fa) 私人 2FA 密钥管理器。
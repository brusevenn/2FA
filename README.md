# OTP SHARE — 公共实时 TOTP 验证码展示

这个仓库部署一个 **无密码、公开访问** 的动态验证码网页。任何知道网址的人都可以查看指定账户的实时 TOTP 验证码。

> ⚠️ 重要安全提醒：公开真实动态验证码，会使该账户的第二因素不再保密。拥有对应账户密码的人可能使用这些验证码登录账户。建议只用于明确允许多人访问、风险可控的账号；优先使用应用官方的共享/团队授权功能。

## 配置

使用 [Cloudflare Worker Secrets](https://developers.cloudflare.com/workers/configuration/secrets/) 设置：

- `TOTP_SECRET`：**必填**，由原应用提供的 Base32 密钥或 `otpauth://totp/...` 设置 URI。必须配置为 Worker **运行时 Secret**。不要把真实密钥提交到 GitHub。
- `TOKEN_LABEL`：可选，页面上的应用显示名称，不含敏感信息。

**不需要 `FRIEND_PASSWORD`**。此版本已经移除登录页、访问密码校验和所有登录 Cookie。服务端从 `TOTP_SECRET` 生成动态验证码，访客只能通过 `/api/token` 获取验证码、有效期和时间信息，不会得到原始密钥。

支持 TOTP SHA1/SHA256/SHA512、6/8 位和 30/60/120 秒周期；如果设置的 TOTP URI 未提供参数，使用 SHA1、6 位和 30 秒周期。

## 部署

确保已安装 Node.js 22 或更新版本，运行：

```bash
npm exec --yes -- wrangler login
npx wrangler deploy
```

部署名由 `wrangler.toml` 指定为 `2fa`。不要执行 `secret delete TOTP_SECRET`，也不要将 TOTP 明文放入 `wrangler.toml`。

访问：<https://2fa.brusevenn.workers.dev/>

请注意：如果 Cloudflare 已关联这个 GitHub 仓库，后续 Git push 可能触发自动构建并重新部署，所以要同步更新仓库的 `worker.js`。

## 安全提示

- 页面无登录限制、无访问白名单和时间分享限制，公开验证码可能被任意复制或自动抓取。
- `robots` 标签与 `noindex` 响应头仅用于降低搜索引擎索引概率，**不能提供访问控制**。
- 请不要将真实的 TOTP Secret 上传到聊天、公开仓库或网页。
- 如果原始 TOTP Secret 曾经公开，应在第三方应用中重新绑定，生成新的密钥，并更新 Worker Secret。
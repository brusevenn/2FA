# OTP SHARE — 单个应用的受控 TOTP 验证码分享

这是部署在 Cloudflare Workers 上的**私人分享网页**，用于经账户所有者授权，让朋友查看**一个**应用的动态验证代码。不同于原来的公开演示页，该版本默认锁定，不会显示任何测试或真实令牌，直到管理员亲自配置 Cloudflare Secrets。

**安全注意：** 将真实 TOTP 动态码分享给朋友，会削弱多因素认证。请仅用于自己拥有并允许多人访问的账户，优先使用应用自带的团队/家庭成员授权。严禁将真实 TOTP 种子、设置二维码、备份码或访问密码提交到 GitHub、聊天或公开 URL。

## 访问地址
`https://2fa.brusevenn.workers.dev/`

## 首次配置（由 Cloudflare 账户所有者完成）
登录 Cloudflare Dashboard → **Workers & Pages** → **2fa** → **Settings** → **Variables and Secrets** → **Add**。

将以下两项的 **Type** 均设置为 **Secret**：
- `FRIEND_PASSWORD`：给朋友使用的独立高强度访问密码（**至少 16 个字符**，建议随机生成 20 位以上）。与任何账户登录密码、Cloudflare 密码不同。
- `TOTP_SECRET`：**只填你要分享的那个应用**的 TOTP 设置密钥，可使用手动显示的 Base32 密钥，也可填 **`otpauth://totp/...`** 格式的完整配置 URI。请注意：包含真实密钥的配置 URI 也必须按密码保护。

可选：`TOKEN_LABEL` 设置展示的应用名称；该项可以使用普通变量（非敏感文本），例如“共享应用”。

保存并 Deploy 后打开网页，输入 `FRIEND_PASSWORD` 查看当前 6 位或 8 位验证码。登录会话有效期为两小时，支持退出登录。API `/api/token` 在未登录时返回 401，无论登录与否都不会返回 TOTP 种子。

**关于 Authenticator 导入：**
- 如果你原来在 Google Authenticator、Microsoft Authenticator 或其他验证器中只有动态码，而没有保存原始密钥，通常**不能直接从显示的 6 位码还原密钥**。
- Google Authenticator 的“转移账号”导出二维码是 `otpauth-migration://`，**不能直接复制到 `TOTP_SECRET`**；请从目标应用的两步验证设置获取原始密钥，必要时按照应用操作流程重新绑定并备份。
- 部分 Microsoft Authenticator 批准式登录、通行密钥或推送验证不使用标准 TOTP，无法通过本项目共享。
- 更换密钥通常会使旧 Authenticator 令牌失效，请先确认仍有其他可信的登录/恢复方式。

## 安全属性与限制
- 只公开选定应用的**实时验证码**，绝不在 HTML / JS / API / URL 中发送原始密钥。
- 两项敏感配置仅存在 Cloudflare Worker Secrets 中，不随源码提交。
- 分享链接本身不含密钥，朋友仍需输入访问密码。
- 服务端生成 TOTP，支持 Base32 密钥，以及 URI 所带的 6/8 位、SHA1/SHA256/SHA512、30/60/120 秒周期。
- Cookie 为 Secure、HttpOnly、SameSite=Lax，并使用 HMAC 签名；更换 `FRIEND_PASSWORD` 将使已有会话失效。
- 响应禁用缓存，限制跨源脚本。
- **当前单层密码防护没有持久化暴力破解限流，也不具备逐位朋友的独立权限管理。** 用于重要账户时强烈推荐进一步启用 **Cloudflare Access**，通过好友邮箱白名单限制可访问者，或者改用平台原生多人授权。
- 修改密钥或访问密码后，可在 Cloudflare Dashboard 中更新 Secret；无需提交代码。轮换应用的 TOTP 密钥也需要同步更新 `TOTP_SECRET`。

## 源代码与部署
- `worker.js`：完整 Cloudflare Worker。
- `wrangler.toml`：固定 Worker 名称为 `2fa`。
- 本项目**不是**原始 [wuzf/2fa](https://github.com/wuzf/2fa) 的完整账户库，也没有密钥批量导入和持久数据库。

若本机已通过 Cloudflare 授权，可以运行 `npx wrangler deploy`。后续部署时，应确认 Worker Secrets 得到保留。

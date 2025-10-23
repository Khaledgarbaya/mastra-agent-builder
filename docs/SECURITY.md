# Security Considerations

This document outlines the security measures implemented in the Mastra Visual Builder, particularly for the WebContainer-based preview feature.

## Overview

The Mastra Visual Builder allows users to create AI agents, tools, and workflows visually and preview them in a browser-based sandbox. Security is critical since users provide API keys and custom code.

---

## Security Measures Implemented

### 1. **User Code Validation** 🔒

**Location**: `src/lib/code-generation/codeGenUtils.ts`

All user-provided `executeCode` is validated before being included in generated files:

- ✅ **Syntax Validation**: Code is parsed to ensure valid JavaScript syntax
- ✅ **Pattern Detection**: Dangerous patterns are blocked:
  - Direct `process.env` access
  - `require()` calls (CommonJS imports)
  - Dynamic `import()` statements
  - `eval()` and `Function()` constructor
  - Timers (`setTimeout`, `setInterval`) that could cause DoS
- ✅ **Function Format Check**: Code must be a proper function (async, arrow, or function keyword)
- ✅ **Comment Stripping**: Comments are removed to prevent obfuscation

**Validation Process**:
```typescript
const validation = validateExecuteCode(config.executeCode);
if (!validation.isValid) {
  // Code is rejected with error message
  // Placeholder with error is generated instead
}
```

**Limitations**:
- This is **basic validation** and not a complete security solution
- For production, consider implementing AST-based validation using `acorn` or `@babel/parser`
- Malicious code could potentially bypass simple pattern matching

---

### 2. **String Escaping** 🔒

**Location**: `src/lib/code-generation/codeGenUtils.ts`

All user-provided strings (descriptions, field names, etc.) are properly escaped:

```typescript
function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')   // Backslash
    .replace(/'/g, "\\'")     // Single quote
    .replace(/"/g, '\\"')     // Double quote
    .replace(/`/g, '\\`')     // Backtick
    .replace(/\$/g, '\\$')    // Dollar sign
    .replace(/\n/g, '\\n')    // Newline
    .replace(/\r/g, '\\r')    // Carriage return
    .replace(/\t/g, '\\t')    // Tab
    .replace(/\0/g, '\\0');   // Null character
}
```

**Protects Against**:
- String injection attacks
- Template literal injection (`${...}`)
- Code breaking out of string context

---

### 3. **API Key Security** 🔐

**Location**: `src/components/execute/ApiKeysDialog.tsx`

API keys are handled with security best practices:

- ✅ **sessionStorage**: Keys stored in `sessionStorage` (not `localStorage`)
  - Automatically cleared when tab closes
  - Not persisted across browser sessions
  - Reduces exposure window
- ✅ **Client-Side Only**: Keys never sent to backend servers
- ✅ **WebContainer Isolation**: Keys only accessible in sandboxed WebContainer environment
- ✅ **User Warnings**: Clear UI warnings about key storage

**User Guidelines**:
```
🔒 Your API keys are stored in your browser session only
⚠️ Keys are automatically cleared when you close this tab
```

**Recommendations**:
- Use API keys with limited permissions if possible
- Rotate keys regularly
- Don't use shared computers without clearing session
- Consider implementing encrypted storage for enterprise deployments

---

### 4. **Iframe Sandboxing** 🛡️

**Location**: `src/components/execute/PreviewPanel.tsx`

The preview iframe uses restrictive sandbox attributes:

```tsx
<iframe
  src={serverUrl}
  sandbox="allow-scripts allow-forms allow-popups allow-modals"
/>
```

**What's Blocked**:
- ❌ `allow-same-origin` - Prevents iframe from accessing parent origin
- ❌ `allow-top-navigation` - Prevents navigation of parent window
- ❌ `allow-downloads` - Prevents automatic downloads

**What's Allowed**:
- ✅ `allow-scripts` - Required for WebContainer to function
- ✅ `allow-forms` - For form submissions in playground
- ✅ `allow-popups` - For external links (opens in new tab)
- ✅ `allow-modals` - For alert/confirm dialogs

**Risk Assessment**:
- **Low Risk**: WebContainer is provided by StackBlitz and runs in isolated environment
- **Mitigation**: Removing `allow-same-origin` prevents cross-origin attacks

---

### 5. **Content Security Policy (CSP)** 🛡️

**Location**: `public/_headers`

CSP headers restrict resource loading and script execution:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://cdn.jsdelivr.net https://*.webcontainer.io;
  img-src 'self' data: https:;
  font-src 'self' data:;
  frame-src 'self' https://*.webcontainer.io blob:;
  worker-src 'self' blob:;
```

**Directives Explained**:
- **default-src 'self'**: Default policy - only load resources from same origin
- **script-src**: Scripts from self + inline (required for React) + eval (required for WebContainer)
- **connect-src**: Network requests to self + npm CDN + WebContainer domains
- **frame-src**: Iframes from self + WebContainer domains + blob URLs

**Note**: `unsafe-eval` is required for WebContainer but is scoped to specific domains.

---

### 6. **Cross-Origin Isolation** 🌐

**Location**: `public/_headers`

COEP/COOP headers enable SharedArrayBuffer for WebContainer:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

**Purpose**:
- Required for WebContainer to use SharedArrayBuffer (high-performance memory)
- Isolates page from cross-origin resources
- Prevents certain types of side-channel attacks (e.g., Spectre)

---

### 7. **Additional Security Headers** 🔐

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Headers Explained**:
- **X-Frame-Options**: Prevents page from being embedded in iframes (clickjacking protection)
- **X-Content-Type-Options**: Prevents MIME-sniffing attacks
- **Referrer-Policy**: Limits referrer information sent to external sites
- **Permissions-Policy**: Disables access to sensitive browser APIs (camera, mic, location)

---

## Known Limitations & Future Improvements

### Current Limitations

1. **Basic Code Validation**
   - Current validation uses pattern matching, not AST analysis
   - Sophisticated attackers may bypass validation
   - **Recommendation**: Implement AST-based validation with `acorn` or `@babel/parser`

2. **No Rate Limiting**
   - No protection against brute-force preview starts
   - Could be abused for API key testing
   - **Recommendation**: Implement client-side rate limiting

3. **WebContainer Trust**
   - Preview depends on StackBlitz's WebContainer security
   - Any WebContainer vulnerabilities affect our app
   - **Mitigation**: Use pinned version and monitor security advisories

4. **Environment Variable Exposure**
   - API keys written to `.env` in WebContainer
   - Low risk due to sandboxing, but could leak if WebContainer compromised
   - **Recommendation**: Explore alternative credential injection methods

### Planned Improvements (P1)

- [ ] Implement AST-based code validation
- [ ] Add rate limiting for preview starts
- [ ] Implement auto-clear API keys after inactivity
- [ ] Add security audit logging
- [ ] Implement session time limits for previews
- [ ] Add encrypted storage option for API keys
- [ ] Create security incident response plan

### Planned Improvements (P2)

- [ ] Input validation for node IDs (special characters, reserved keywords)
- [ ] Automatic retry logic with backoff for npm install
- [ ] Memory leak monitoring for WebContainer singleton
- [ ] Enhanced TypeScript type safety (reduce `any` usage)
- [ ] Integration tests for security validations
- [ ] Penetration testing

---

## Security Best Practices for Users

### For End Users

1. **API Keys**
   - Use keys with minimal required permissions
   - Create separate keys for testing vs production
   - Rotate keys regularly
   - Never share your browser profile with others
   - Clear sessionStorage if using shared computers

2. **Custom Code**
   - Review generated code before exporting
   - Don't include sensitive data in descriptions or comments
   - Test in preview before deploying to production

3. **Network Security**
   - Use HTTPS for accessing the builder
   - Don't use on untrusted networks without VPN
   - Keep browser updated for latest security patches

### For Developers/Admins

1. **Deployment**
   - Always deploy behind HTTPS
   - Enable all security headers
   - Monitor for security updates to dependencies
   - Implement logging and monitoring

2. **Maintenance**
   - Keep `@webcontainer/api` updated
   - Review security advisories for all dependencies
   - Conduct regular security audits
   - Maintain incident response plan

3. **Custom Deployments**
   - Consider adding authentication/authorization
   - Implement IP allowlisting if needed
   - Add audit logging for preview starts
   - Set up alerts for suspicious activity

---

## Vulnerability Reporting

If you discover a security vulnerability, please follow responsible disclosure:

1. **Do NOT** open a public GitHub issue
2. Email security details to: [SECURITY_EMAIL]
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

---

## Security Audit History

| Date | Auditor | Scope | Findings | Status |
|------|---------|-------|----------|--------|
| 2025-01-XX | Internal Review | Preview Feature | 5 critical, 3 medium | **Fixed** |
| TBD | External Audit | Full Application | - | Planned |

---

## Compliance & Standards

This application follows security best practices from:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [MDN Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)
- [StackBlitz WebContainer Security Model](https://webcontainers.io/guides/security)

---

## Additional Resources

- [Preview User Guide](./PREVIEW_GUIDE.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [WebContainer Implementation](../WEBCONTAINER_IMPLEMENTATION.md)
- [StackBlitz WebContainer Security](https://webcontainers.io/guides/security)

---

**Last Updated**: 2025-01-XX
**Next Review**: 2025-XX-XX


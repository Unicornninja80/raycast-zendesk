import { getPreferenceValues, showToast, Toast } from "@raycast/api";
function getBaseUrl() {
    const { subdomain } = getPreferenceValues();
    return `https://${subdomain}.zendesk.com`;
}
function getAuthHeader() {
    const { email, apiToken } = getPreferenceValues();
    const token = Buffer.from(`${email}/token:${apiToken}`).toString("base64");
    return `Basic ${token}`;
}
export async function zdFetch(path, init = {}) {
    const res = await fetch(`${getBaseUrl()}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader(),
            ...(init.headers || {}),
        },
    });
    if (res.status === 429) {
        const retry = parseInt(res.headers.get("Retry-After") || "1", 10) * 1000;
        await showToast({
            style: Toast.Style.Animated,
            title: "Rate limited",
            message: `Retrying in ${Math.ceil(retry / 1000)}s`,
        });
        await new Promise((r) => setTimeout(r, retry));
        return zdFetch(path, init);
    }
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
    }
    return (await res.json());
}
export function getAgentTicketUrl(id) {
    return `${getBaseUrl()}/agent/tickets/${id}`;
}
let cachedCurrentUserId = null;
export async function getCurrentUserId() {
    if (cachedCurrentUserId)
        return cachedCurrentUserId;
    const me = await zdFetch("/api/v2/users/me.json");
    cachedCurrentUserId = me.user.id;
    return cachedCurrentUserId;
}

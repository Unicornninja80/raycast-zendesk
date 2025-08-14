import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Action, ActionPanel, Form, List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { zdFetch, getAgentTicketUrl, getCurrentUserId } from "./zendesk";
export default function Tickets() {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [query, setQuery] = useState("type:ticket assignee:me status<solved");
    async function load(q) {
        setLoading(true);
        try {
            const data = await zdFetch(`/api/v2/search.json?query=${encodeURIComponent(q)}&sort_by=updated_at&sort_order=desc`);
            setTickets(data.results.filter((r) => r.result_type === "ticket"));
        }
        catch (e) {
            await showToast({ style: Toast.Style.Failure, title: "Failed to load tickets", message: String(e) });
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load(query);
    }, [query]);
    return (_jsx(List, { isLoading: loading, searchBarPlaceholder: "Search Zendesk\u2026", onSearchTextChange: setQuery, throttle: true, children: tickets.map((t) => (_jsx(List.Item, { title: t.subject || `Ticket #${t.id}`, accessories: [{ tag: t.status }, { date: new Date(t.updated_at) }], actions: _jsxs(ActionPanel, { children: [_jsx(Action.OpenInBrowser, { url: getAgentTicketUrl(t.id) }), _jsx(Action.Push, { title: "Reply\u2026", target: _jsx(ReplyForm, { ticketId: t.id }) }), _jsx(Action, { title: "Assign to Me", onAction: () => assignToMe(t.id) }), _jsx(Action, { title: "Mark as Solved", onAction: () => updateStatus(t.id, "solved") }), _jsx(Action, { title: "Mark as Pending", onAction: () => updateStatus(t.id, "pending") })] }) }, t.id))) }));
}
function ReplyForm({ ticketId }) {
    const [text, setText] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    async function submit() {
        if (!text.trim())
            return;
        await showToast({ style: Toast.Style.Animated, title: "Sending reply…" });
        try {
            await zdFetch(`/api/v2/tickets/${ticketId}.json`, {
                method: "PUT",
                body: JSON.stringify({ ticket: { comment: { body: text, public: isPublic } } }),
            });
            await showToast({ style: Toast.Style.Success, title: "Reply sent" });
        }
        catch (e) {
            await showToast({ style: Toast.Style.Failure, title: "Failed to send reply", message: String(e) });
        }
    }
    return (_jsxs(Form, { actions: _jsx(ActionPanel, { children: _jsx(Action.SubmitForm, { title: "Send Reply", onSubmit: submit }) }), children: [_jsx(Form.Description, { title: `Reply to #${ticketId}`, text: "" }), _jsx(Form.Checkbox, { id: "public", label: "Public Reply", value: isPublic, onChange: setIsPublic }), _jsx(Form.TextArea, { id: "body", title: "Message", value: text, onChange: setText, enableMarkdown: true, placeholder: "Type your reply\u2026" })] }));
}
async function assignToMe(ticketId) {
    try {
        const me = await getCurrentUserId();
        await zdFetch(`/api/v2/tickets/${ticketId}.json`, {
            method: "PUT",
            body: JSON.stringify({ ticket: { assignee_id: me } }),
        });
        await showToast({ style: Toast.Style.Success, title: "Assigned to you" });
    }
    catch (e) {
        await showToast({ style: Toast.Style.Failure, title: "Failed to assign", message: String(e) });
    }
}
async function updateStatus(ticketId, status) {
    try {
        await zdFetch(`/api/v2/tickets/${ticketId}.json`, {
            method: "PUT",
            body: JSON.stringify({ ticket: { status } }),
        });
        await showToast({ style: Toast.Style.Success, title: `Marked ${status}` });
    }
    catch (e) {
        await showToast({ style: Toast.Style.Failure, title: "Failed to update status", message: String(e) });
    }
}

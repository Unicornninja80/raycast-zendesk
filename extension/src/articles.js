import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Action, ActionPanel, List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { zdFetch } from "./zendesk";
export default function Articles() {
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState([]);
    async function search(q) {
        if (!q)
            return;
        setLoading(true);
        try {
            const res = await zdFetch(`/api/v2/help_center/articles/search.json?query=${encodeURIComponent(q)}`);
            setArticles(res.results);
        }
        catch (e) {
            await showToast({ style: Toast.Style.Failure, title: "Failed to search articles", message: String(e) });
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        search("getting started");
    }, []);
    return (_jsx(List, { isLoading: loading, onSearchTextChange: search, throttle: true, searchBarPlaceholder: "Search Help Center\u2026", children: articles.map((a) => (_jsx(List.Item, { title: a.title, accessories: [{ date: new Date(a.updated_at) }], actions: _jsxs(ActionPanel, { children: [_jsx(Action.OpenInBrowser, { url: a.html_url }), _jsx(Action.CopyToClipboard, { title: "Copy Article URL", content: a.html_url })] }) }, a.id))) }));
}

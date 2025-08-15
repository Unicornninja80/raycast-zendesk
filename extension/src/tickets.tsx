import { Action, ActionPanel, Form, List, Detail, showToast, Toast, getPreferenceValues, popToRoot } from "@raycast/api";
import React, { useEffect, useState } from "react";
import { zdFetch, getAgentTicketUrl, getCurrentUserId, getAuthHeader } from "./zendesk";

interface Ticket {
  id: number;
  subject: string;
  status: string;
  updated_at: string;
  description?: string;
}

interface FullTicket {
  id: number;
  subject: string | null;
  status: string | null;
  description: string | null;
  updated_at: string;
  created_at: string;
  priority: string | null;
  requester_id: number;
  assignee_id?: number | null;
}

interface Comment {
  id: number;
  body: string;
  public: boolean;
  author_id: number;
  created_at: string;
}

interface TicketResponse {
  ticket: FullTicket;
}

interface CommentsResponse {
  comments: Comment[];
}

interface UsersResponse {
  users: Array<{ id: number; name: string; email: string }>;
}

interface Group {
  id: number;
  name: string;
}

interface GroupsResponse {
  groups: Group[];
}

interface SearchResponse {
  results: Array<Ticket & { result_type: string }>;
}

export default function Tickets() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [query, setQuery] = useState("type:ticket assignee:me status<solved");
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  async function load(q: string) {
    setLoading(true);
    try {
      const data = await zdFetch<SearchResponse>(
        `/api/v2/search.json?query=${encodeURIComponent(q)}&sort_by=updated_at&sort_order=desc`,
      );
      setTickets(data.results.filter((r) => r.result_type === "ticket"));
    } catch (e) {
      await showToast({ style: Toast.Style.Failure, title: "Failed to load tickets", message: String(e) });
    } finally {
      setLoading(false);
    }
  }

  async function loadGroups() {
    try {
      const data = await zdFetch<GroupsResponse>("/api/v2/groups.json");
      setGroups(data.groups);
    } catch (e) {
      console.error("Failed to load groups:", e);
    }
  }

  function handleAssignmentTypeChange(type: "me" | "group", groupId?: number) {
    if (type === "me") {
      setSelectedGroupId(null);
      setQuery("type:ticket assignee:me status<solved");
    } else if (type === "group" && groupId) {
      setSelectedGroupId(groupId);
      setQuery(`type:ticket group:${groupId} status<solved`);
    }
  }

  useEffect(() => {
    load(query);
  }, [query]);

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <List 
      isLoading={loading} 
      searchBarPlaceholder="Search Zendesk…" 
      onSearchTextChange={setQuery} 
      throttle
      searchBarAccessory={
        <List.Dropdown 
          tooltip="Select Assignment" 
          value={selectedGroupId ? `group-${selectedGroupId}` : "me"}
          onChange={(value) => {
            if (value === "me") {
              handleAssignmentTypeChange("me");
            } else if (value.startsWith("group-")) {
              const groupId = parseInt(value.replace("group-", ""));
              handleAssignmentTypeChange("group", groupId);
            }
          }}
        >
          <List.Dropdown.Item value="me" title="My Tickets" />
          {groups.map(group => (
            <List.Dropdown.Item 
              key={group.id} 
              value={`group-${group.id}`} 
              title={`Group: ${group.name}`} 
            />
          ))}
        </List.Dropdown>
      }
    >
      {tickets.map((t: Ticket) => (
        <List.Item
          key={t.id}
          title={t.subject || `Ticket #${t.id}`}
          accessories={[{ tag: t.status }, { date: new Date(t.updated_at) }]}
          actions={
            <ActionPanel>
              <Action.Push title="View Details" target={<TicketDetails ticketId={t.id} />} />
              <Action.OpenInBrowser url={getAgentTicketUrl(t.id)} />
              <Action.Push title="Reply…" target={<ReplyForm ticketId={t.id} />} />
              <Action title="Assign to Me" onAction={() => assignToMe(t.id)} />
              <Action title="Mark as Solved" onAction={() => updateStatus(t.id, "solved")} />
              <Action title="Mark as Pending" onAction={() => updateStatus(t.id, "pending")} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function ReplyForm({ ticketId }: { ticketId: number }) {
  const [text, setText] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    // Use fetch directly instead of zdFetch for FormData uploads
    const { subdomain } = getPreferenceValues<{ subdomain: string; email: string; apiToken: string }>();
    const response = await fetch(`https://${subdomain}.zendesk.com/api/v2/uploads.json`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { upload: { token: string } };
    return data.upload.token;
  }

  async function handleFileSelection(filePaths: string[]) {
    if (filePaths.length === 0) return;
    
    setUploading(true);
    const uploadPromises = filePaths.map(async (filePath) => {
      try {
        // Read file from filesystem
        const fileResponse = await fetch(`file://${filePath}`);
        const fileBlob = await fileResponse.blob();
        const fileName = filePath.split('/').pop() || 'image';
        
        // Check if it's an image
        if (!fileBlob.type.startsWith('image/')) {
          await showToast({ 
            style: Toast.Style.Failure, 
            title: "Invalid file type", 
            message: `${fileName} is not an image file` 
          });
          return null;
        }
        
        const file = new File([fileBlob], fileName, { type: fileBlob.type });
        const token = await uploadImage(file);
        return token;
      } catch (error) {
        await showToast({ 
          style: Toast.Style.Failure, 
          title: "Failed to upload image", 
          message: `Could not upload ${filePath.split('/').pop()}` 
        });
        return null;
      }
    });

    try {
      const uploadedTokens = await Promise.all(uploadPromises);
      const validTokens = uploadedTokens.filter(token => token !== null) as string[];
      setAttachments(prev => [...prev, ...validTokens]);
      
      if (validTokens.length > 0) {
        await showToast({ 
          style: Toast.Style.Success, 
          title: `${validTokens.length} image(s) uploaded` 
        });
      }
    } catch (error) {
      await showToast({ 
        style: Toast.Style.Failure, 
        title: "Upload failed", 
        message: String(error) 
      });
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    if (!text.trim() && attachments.length === 0) return;
    await showToast({ style: Toast.Style.Animated, title: "Sending reply…" });
    try {
      const comment: any = { 
        body: text, 
        public: isPublic 
      };
      
      if (attachments.length > 0) {
        comment.uploads = attachments;
      }

      await zdFetch(`/api/v2/tickets/${ticketId}.json`, {
        method: "PUT",
        body: JSON.stringify({ ticket: { comment } }),
      });
      await showToast({ style: Toast.Style.Success, title: "Reply sent" });
      // Clear the form
      setText("");
      setAttachments([]);
      // Navigate back to the ticket list
      popToRoot();
    } catch (e) {
      await showToast({ style: Toast.Style.Failure, title: "Failed to send reply", message: String(e) });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Send Reply" onSubmit={submit} />
        </ActionPanel>
      }
    >
      <Form.Description title={`Reply to #${ticketId}`} text="" />
      <Form.Checkbox id="public" label="Public Reply" value={isPublic} onChange={setIsPublic} />
      <Form.TextArea
        id="body"
        title="Message"
        value={text}
        onChange={setText}
        enableMarkdown
        placeholder="Type your reply…"
      />
      <Form.FilePicker
        id="images"
        title="Attachments"
        allowMultipleSelection={true}
        value={[]}
        onChange={handleFileSelection}
        canChooseDirectories={false}
        canChooseFiles={true}
        showHiddenFiles={false}
      />
      {attachments.length > 0 && (
        <Form.Description 
          title="Uploaded Images" 
          text={`${attachments.length} image(s) ready to attach`} 
        />
      )}
      {uploading && (
        <Form.Description 
          title="Status" 
          text="Uploading images..." 
        />
      )}
    </Form>
  );
}

async function assignToMe(ticketId: number) {
  try {
    const me = await getCurrentUserId();
    await zdFetch(`/api/v2/tickets/${ticketId}.json`, {
      method: "PUT",
      body: JSON.stringify({ ticket: { assignee_id: me } }),
    });
    await showToast({ style: Toast.Style.Success, title: "Assigned to you" });
  } catch (e) {
    await showToast({ style: Toast.Style.Failure, title: "Failed to assign", message: String(e) });
  }
}

async function updateStatus(ticketId: number, status: "pending" | "solved" | "open" | "hold") {
  try {
    await zdFetch(`/api/v2/tickets/${ticketId}.json`, {
      method: "PUT",
      body: JSON.stringify({ ticket: { status } }),
    });
    await showToast({ style: Toast.Style.Success, title: `Marked ${status}` });
  } catch (e) {
    await showToast({ style: Toast.Style.Failure, title: "Failed to update status", message: String(e) });
  }
}

function TicketDetails({ ticketId }: { ticketId: number }) {
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<FullTicket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<Record<number, { name: string; email: string }>>({});

  useEffect(() => {
    loadTicketDetails();
  }, [ticketId]);

  async function loadTicketDetails() {
    setLoading(true);
    try {
      // Load ticket details and comments in parallel
      const [ticketResponse, commentsResponse] = await Promise.all([
        zdFetch<TicketResponse>(`/api/v2/tickets/${ticketId}.json`),
        zdFetch<CommentsResponse>(`/api/v2/tickets/${ticketId}/comments.json`),
      ]);

      setTicket(ticketResponse.ticket);
      setComments(commentsResponse.comments);

      // Get unique user IDs from ticket and comments
      const userIds = new Set([
        ticketResponse.ticket.requester_id,
        ...(ticketResponse.ticket.assignee_id ? [ticketResponse.ticket.assignee_id] : []),
        ...commentsResponse.comments.map(c => c.author_id),
      ]);

      // Load user details
      if (userIds.size > 0) {
        const usersResponse = await zdFetch<UsersResponse>(
          `/api/v2/users/show_many.json?ids=${Array.from(userIds).join(',')}`
        );
        const usersMap: Record<number, { name: string; email: string }> = {};
        usersResponse.users.forEach(user => {
          usersMap[user.id] = { name: user.name, email: user.email };
        });
        setUsers(usersMap);
      }
    } catch (e) {
      await showToast({ style: Toast.Style.Failure, title: "Failed to load ticket details", message: String(e) });
    } finally {
      setLoading(false);
    }
  }

  if (loading || !ticket) {
    return <Detail isLoading={true} />;
  }

  const requesterName = users[ticket.requester_id]?.name || `User ${ticket.requester_id}`;
  const assigneeName = ticket.assignee_id ? (users[ticket.assignee_id]?.name || `User ${ticket.assignee_id}`) : "Unassigned";

  const formatField = (field: string | null | undefined) => {
    if (!field) return "N/A";
    return field.charAt(0).toUpperCase() + field.slice(1);
  };

  const markdown = `
# ${ticket.subject || `Ticket #${ticketId}`}

**Status:** ${formatField(ticket.status)}  
**Priority:** ${formatField(ticket.priority)}  
**Requester:** ${requesterName}  
**Assignee:** ${assigneeName}  
**Created:** ${new Date(ticket.created_at).toLocaleString()}  
**Updated:** ${new Date(ticket.updated_at).toLocaleString()}

---

## Description

${ticket.description || "No description provided"}

---

## Comments

${comments.slice(1).map(comment => {
  const authorName = users[comment.author_id]?.name || `User ${comment.author_id}`;
  const commentType = comment.public ? "Public" : "Internal";
  return `
### ${authorName} • ${commentType} • ${new Date(comment.created_at).toLocaleString()}

${comment.body}

---
`;
}).join('')}
  `;

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={getAgentTicketUrl(ticketId)} />
          <Action.Push title="Reply…" target={<ReplyForm ticketId={ticketId} />} />
          <Action title="Assign to Me" onAction={() => assignToMe(ticketId)} />
          <Action title="Mark as Solved" onAction={() => updateStatus(ticketId, "solved")} />
          <Action title="Mark as Pending" onAction={() => updateStatus(ticketId, "pending")} />
        </ActionPanel>
      }
    />
  );
}

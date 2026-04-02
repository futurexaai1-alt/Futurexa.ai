import type React from "react";

export default function TicketsPanel({
  userStatus,
  accessToken,
  organizationId,
  liveProjects,
  liveTickets,
  ticketProjectId,
  ticketTitle,
  setTicketProjectId,
  setTicketTitle,
  handleCreateTicket,
  ticketReplies,
  setTicketReplies,
  handleUpdateTicketStatus,
  handleDeleteTicket,
}: {
  userStatus: string;
  accessToken: string | null;
  organizationId: string | null;
  liveProjects: Array<{ id: string | number; title: string }>;
  liveTickets: Array<{ id: string | number; title: string; status: string }>;
  ticketProjectId: string | null;
  ticketTitle: string;
  setTicketProjectId: (next: string | null) => void;
  setTicketTitle: (next: string) => void;
  handleCreateTicket: () => Promise<void> | void;
  ticketReplies: Record<string, string>;
  setTicketReplies: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleUpdateTicketStatus: (ticketId: string | number, status: string, reply?: string) => Promise<void> | void;
  handleDeleteTicket: (ticketId: string | number) => Promise<void> | void;
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">Create Ticket</p>
        <div className="mt-3 space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Project</span>
            <select
              value={ticketProjectId ?? ""}
              onChange={(e) => setTicketProjectId(e.target.value || null)}
              disabled={liveProjects.length === 0}
              className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            >
              {liveProjects.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Ticket title"
            />
          </label>
          <button
            onClick={handleCreateTicket}
            disabled={
              !ticketProjectId ||
              !ticketTitle.trim() ||
              !accessToken ||
              !organizationId ||
              userStatus !== "ACTIVE_CLIENT"
            }
            className="group relative inline-flex items-center justify-center gap-3 h-12 px-8 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {liveTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-xl border border-gray-100 bg-white px-4 py-3 flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{ticket.title}</p>
              <p className="mt-1 text-xs text-gray-500">{ticket.status}</p>
              <textarea
                rows={2}
                value={ticketReplies[String(ticket.id)] ?? ""}
                onChange={(e) =>
                  setTicketReplies((prev) => ({
                    ...prev,
                    [String(ticket.id)]: e.target.value,
                  }))
                }
                className="mt-2 w-[220px] max-w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Add a reply (saved when you change status)"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={ticket.status}
                onChange={(e) =>
                  handleUpdateTicketStatus(ticket.id, e.target.value, ticketReplies[String(ticket.id)] ?? "")
                }
                disabled={userStatus !== "ACTIVE_CLIENT"}
                className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              >
                {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleDeleteTicket(ticket.id)}
                disabled={userStatus !== "ACTIVE_CLIENT"}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {liveTickets.length === 0 && <p className="text-sm text-gray-500">No records available.</p>}
      </div>
    </div>
  );
}


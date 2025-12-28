// Admin script for danhgia (separated from HTML)
(function () {
  function loadFeedbacks() {
    try {
      const arr = JSON.parse(localStorage.getItem("feedbacks") || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }
  function saveFeedbacks(arr) {
    localStorage.setItem("feedbacks", JSON.stringify(arr));
  }
  function formatDate(ts) {
    try {
      return new Date(ts).toLocaleString();
    } catch (e) {
      return "";
    }
  }

  let currentPage = 1;
  function renderPagination(totalPages) {
    const box = document.getElementById("pagination");
    if (!box) return;
    box.innerHTML = "";
    const createBtn = (text, p, disabled = false) => {
      const btn = document.createElement("button");
      btn.innerText = text;
      btn.disabled = disabled;
      btn.style.padding = "6px 8px";
      btn.style.borderRadius = "6px";
      btn.style.cursor = "pointer";
      btn.addEventListener("click", () => {
        const filterVal =
          document.getElementById("filterStatus")?.value || "all";
        const searchVal = document.getElementById("searchInput")?.value || "";
        renderAdminReviews(filterVal, searchVal, p);
      });
      return btn;
    };
    box.appendChild(createBtn("<<", 1, currentPage === 1));
    box.appendChild(
      createBtn("<", Math.max(1, currentPage - 1), currentPage === 1)
    );
    const info = document.createElement("div");
    info.innerText = `Trang ${currentPage} / ${totalPages}`;
    info.style.padding = "6px 8px";
    box.appendChild(info);
    box.appendChild(
      createBtn(
        ">",
        Math.min(totalPages, currentPage + 1),
        currentPage === totalPages
      )
    );
    box.appendChild(createBtn(">>", totalPages, currentPage === totalPages));
  }

  function renderAdminReviews(filter = "all", search = "", page = 1) {
    const listEl = document.getElementById("adminFeedbackList");
    if (!listEl) return;
    const pageSize =
      parseInt(document.getElementById("pageSize")?.value || "10", 10) || 10;
    const searchVal =
      search || document.getElementById("searchInput")?.value || "";
    const all = loadFeedbacks();
    let filtered = all.filter((fb) =>
      filter === "all" ? true : fb.status === filter
    );
    if (searchVal) {
      const q = searchVal.toLowerCase();
      filtered = filtered.filter(
        (fb) =>
          (fb.name || "").toLowerCase().includes(q) ||
          (fb.message || "").toLowerCase().includes(q) ||
          (fb.trip && (fb.trip.from || "").toLowerCase().includes(q)) ||
          (fb.trip && (fb.trip.to || "").toLowerCase().includes(q))
      );
    }
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);
    const countEl = document.getElementById("reviewsCount");
    if (countEl) countEl.innerText = `${total} nhận xét`;
    if (pageItems.length === 0) {
      listEl.innerHTML = "<p>Không có đánh giá phù hợp.</p>";
      renderPagination(totalPages);
      return;
    }

    listEl.innerHTML = pageItems
      .map((fb) => {
        const tripLabel = fb.trip
          ? `${fb.trip.from} → ${fb.trip.to}${
              fb.trip.date ? " | " + fb.trip.date : ""
            }`
          : "Không chọn chuyến";
        return `
        <div class="feedback-item" data-id="${fb.id}">
          <div class="meta"><input type="checkbox" class="select-fb" data-id="${
            fb.id
          }" /><div style="flex:1;"><strong>${
          fb.name
        }</strong> <small>${tripLabel}</small><div style="margin-top:6px;color:#333;">${
          fb.message || ""
        }</div></div><div style="text-align:right;min-width:140px;"><div class="rating">${"★".repeat(
          fb.rating
        )}${"☆".repeat(
          5 - fb.rating
        )}</div><small style="color:#555">${formatDate(
          fb.createdAt
        )}</small></div></div>
          <div style="display:flex;gap:8px;margin-top:8px;">${
            fb.status !== "approved"
              ? '<button class="approve-btn">Approve</button>'
              : ""
          }${
          fb.status !== "rejected"
            ? '<button class="reject-btn">Reject</button>'
            : ""
        }<button class="delete-btn">Delete</button><div class="status">Status: ${
          fb.status
        }</div></div>
        </div>
      `;
      })
      .join("");

    listEl.querySelectorAll(".approve-btn").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.closest(".feedback-item").dataset.id;
        updateStatus(id, "approved");
      })
    );
    listEl.querySelectorAll(".reject-btn").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.closest(".feedback-item").dataset.id;
        updateStatus(id, "rejected");
      })
    );
    listEl.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.closest(".feedback-item").dataset.id;
        if (confirm("Xóa nhận xét này?")) deleteFeedback(id);
      })
    );

    renderPagination(totalPages);
  }

  function getSelectedIds() {
    return Array.from(document.querySelectorAll(".select-fb:checked")).map(
      (i) => i.dataset.id
    );
  }
  function bulkUpdate(status) {
    const ids = getSelectedIds();
    if (ids.length === 0) {
      alert("Chưa chọn mục nào");
      return;
    }
    const arr = loadFeedbacks();
    let changed = 0;
    ids.forEach((id) => {
      const idx = arr.findIndex((f) => f.id === id);
      if (idx !== -1) {
        arr[idx].status = status;
        changed++;
      }
    });
    saveFeedbacks(arr);
    {
      const filterVal = document.getElementById("filterStatus")?.value || "all";
      const searchVal = document.getElementById("searchInput")?.value || "";
      renderAdminReviews(filterVal, searchVal, currentPage);
    }
    if (typeof renderFeedbacks === "function") renderFeedbacks();
    alert(`Đã cập nhật ${changed} mục`);
  }
  function bulkDelete() {
    const ids = getSelectedIds();
    if (ids.length === 0) {
      alert("Chưa chọn mục nào");
      return;
    }
    if (!confirm(`Xóa ${ids.length} nhận xét?`)) return;
    let arr = loadFeedbacks();
    arr = arr.filter((f) => !ids.includes(f.id));
    saveFeedbacks(arr);
    {
      const filterVal = document.getElementById("filterStatus")?.value || "all";
      const searchVal = document.getElementById("searchInput")?.value || "";
      renderAdminReviews(filterVal, searchVal, currentPage);
    }
    if (typeof renderFeedbacks === "function") renderFeedbacks();
  }

  function updateStatus(id, status) {
    const arr = loadFeedbacks();
    const idx = arr.findIndex((f) => f.id === id);
    if (idx === -1) return;
    arr[idx].status = status;
    saveFeedbacks(arr);
    {
      const filterVal = document.getElementById("filterStatus")?.value || "all";
      const searchVal = document.getElementById("searchInput")?.value || "";
      renderAdminReviews(filterVal, searchVal, currentPage);
    }
    if (typeof renderFeedbacks === "function") renderFeedbacks();
  }
  function deleteFeedback(id) {
    let arr = loadFeedbacks();
    arr = arr.filter((f) => f.id !== id);
    saveFeedbacks(arr);
    renderAdminReviews(
      document.getElementById("filterStatus").value,
      document.getElementById("searchInput").value,
      currentPage
    );
    if (typeof renderFeedbacks === "function") renderFeedbacks();
  }

  function exportCSV() {
    const rows = loadFeedbacks();
    const headers = [
      "id",
      "name",
      "rating",
      "status",
      "message",
      "trip_from",
      "trip_to",
      "trip_date",
      "createdAt",
    ];
    const csv = [headers.join(",")]
      .concat(
        rows.map((r) =>
          [
            `"${r.id}"`,
            `"${(r.name || "").replace(/"/g, '""')}"`,
            r.rating || "",
            r.status || "",
            `"${(r.message || "").replace(/"/g, '""')}"`,
            `"${r.trip ? r.trip.from : ""}"`,
            `"${r.trip ? r.trip.to : ""}"`,
            `"${r.trip ? r.trip.date : ""}"`,
            `"${r.createdAt}"`,
          ].join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "feedbacks.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderAdminReviews();
    const filter = document.getElementById("filterStatus");
    const refresh = document.getElementById("refreshReviews");
    const search = document.getElementById("searchInput");
    const pageSize = document.getElementById("pageSize");
    const exportBtn = document.getElementById("exportCSV");
    const bulkApproveBtn = document.getElementById("bulkApprove");
    const bulkRejectBtn = document.getElementById("bulkReject");
    const bulkDeleteBtn = document.getElementById("bulkDelete");

    filter &&
      filter.addEventListener("change", () =>
        renderAdminReviews(filter.value, search.value, 1)
      );
    refresh &&
      refresh.addEventListener("click", () =>
        renderAdminReviews(filter.value, search.value, 1)
      );
    search &&
      search.addEventListener("input", () =>
        renderAdminReviews(filter.value, search.value, 1)
      );
    pageSize &&
      pageSize.addEventListener("change", () =>
        renderAdminReviews(filter.value, search.value, 1)
      );
    exportBtn && exportBtn.addEventListener("click", exportCSV);
    bulkApproveBtn &&
      bulkApproveBtn.addEventListener("click", () => bulkUpdate("approved"));
    bulkRejectBtn &&
      bulkRejectBtn.addEventListener("click", () => bulkUpdate("rejected"));
    bulkDeleteBtn && bulkDeleteBtn.addEventListener("click", bulkDelete);
  });

  // Conversations helpers
  function loadConversations() {
    try {
      const arr = JSON.parse(localStorage.getItem("conversations") || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }
  function saveConversations(arr) {
    localStorage.setItem("conversations", JSON.stringify(arr));
  }

  function renderConversationsList(search = "") {
    const box = document.getElementById("convoListItems");
    if (!box) return;
    const convs = loadConversations().sort(
      (a, b) => (b.lastTs || 0) - (a.lastTs || 0)
    );
    const filtered = search
      ? convs.filter((c) =>
          (c.email || "").toLowerCase().includes(search.toLowerCase())
        )
      : convs;
    if (filtered.length === 0) {
      box.innerHTML = "<p>Không có cuộc hội thoại.</p>";
      return;
    }
    box.innerHTML = filtered
      .map(
        (c) => `
      <div class="convo-item" data-id="${
        c.id
      }" style="padding:8px; border-radius:6px; border:1px solid #eee; cursor:pointer; ${
          c.unreadByBusiness ? "background:#eef6ff;" : ""
        }">
        <strong>${c.email || "Khách ẩn danh"}</strong>
        <div style="font-size:12px;color:#666">${
          c.lastTs ? new Date(c.lastTs).toLocaleString() : ""
        }</div>
      </div>
    `
      )
      .join("");

    box
      .querySelectorAll(".convo-item")
      .forEach((el) =>
        el.addEventListener("click", () => renderConversation(el.dataset.id))
      );
  }

  let currentConvoId = null;
  function renderConversation(id) {
    const convs = loadConversations();
    const conv = convs.find((c) => c.id === id);
    const header = document.getElementById("convoHeader");
    const msgsBox = document.getElementById("convoMessages");
    const delBtn = document.getElementById("convoDelete");
    const searchEl = document.getElementById("convoSearch");

    if (!id || !conv || !msgsBox) {
      // no conversation selected: show search, refresh, list buttons, disable delete, clear messages
      if (searchEl) searchEl.style.display = "block";
      const refreshBtn = document.getElementById("refreshConvos");
      if (refreshBtn) refreshBtn.style.display = "block";
      const listBtn = document.getElementById("openConvoList");
      if (listBtn) listBtn.style.display = "block";
      if (delBtn) {
        delBtn.disabled = true;
        delBtn.title = "Chưa chọn cuộc hội thoại";
      }
      if (msgsBox) msgsBox.innerHTML = "";
      currentConvoId = null;
      return;
    }

    // hide search, refresh, list buttons when a conversation is open
    if (searchEl) searchEl.style.display = "none";
    const refreshBtn = document.getElementById("refreshConvos");
    if (refreshBtn) refreshBtn.style.display = "none";
    const listBtn = document.getElementById("openConvoList");
    if (listBtn) listBtn.style.display = "none";

    currentConvoId = id;
    if (header)
      header.innerHTML = `<strong>${
        conv.email || "Khách ẩn danh"
      }</strong> <small style="color:#555; margin-left:8px">${new Date(
        conv.lastTs
      ).toLocaleString()}</small>`;
    msgsBox.innerHTML = (conv.messages || [])
      .map((m) => {
        const who = m.sender === "user" ? "Khách" : "Doanh nghiệp";
        const time = m.ts
          ? ` <small style="color:#666; font-size:11px">${new Date(
              m.ts
            ).toLocaleTimeString()}</small>`
          : "";
        return `<div style="padding:6px; margin-bottom:6px; border-radius:6px; background:${
          m.sender === "user" ? "#fff" : "#e8f2ff"
        }; border:1px solid #eee;"><strong>${who}</strong>${time}<div style="margin-top:6px">${
          m.text
        }</div></div>`;
      })
      .join("");

    // auto-scroll to newest and focus reply input
    try {
      msgsBox.scrollTop = msgsBox.scrollHeight;
      const replyInputEl = document.getElementById("convoReplyInput");
      if (replyInputEl) replyInputEl.focus();
    } catch (e) {}

    // mark read
    const idx = convs.findIndex((c) => c.id === id);
    if (idx !== -1) {
      convs[idx].unreadByBusiness = false;
      saveConversations(convs);
      renderConversationsList(
        document.getElementById("convoSearch")?.value || ""
      );
    }
    // enable delete button with contextual title
    if (delBtn) {
      delBtn.disabled = false;
      delBtn.title = `Xóa cuộc hội thoại của ${conv.email || "Khách ẩn danh"}`;
    }
  }

  function sendBusinessMessageToCurrent(text) {
    if (!currentConvoId) return alert("Chưa chọn cuộc hội thoại");
    const convs = loadConversations();
    const idx = convs.findIndex((c) => c.id === currentConvoId);
    if (idx === -1) return;
    const ts = Date.now();
    convs[idx].messages.push({
      sender: "business",
      role: "business",
      text,
      ts,
    });
    convs[idx].lastTs = ts;
    convs[idx].unreadByUser = true;
    saveConversations(convs);

    // also add a lightweight message to 'site_chats' so older widgets or pages can pick it up
    try {
      const site = JSON.parse(localStorage.getItem("site_chats") || "[]");
      site.push({
        sender: "support",
        text,
        ts,
        email: convs[idx].email,
        convoId: convs[idx].id,
      });
      localStorage.setItem("site_chats", JSON.stringify(site));
    } catch (e) {
      console.warn("Failed to push to site_chats", e);
    }

    renderConversation(currentConvoId);
    renderConversationsList(
      document.getElementById("convoSearch")?.value || ""
    );
    // ensure reply input focused and scrolled to newest
    try {
      const replyInputEl = document.getElementById("convoReplyInput");
      const msgsBox = document.getElementById("convoMessages");
      if (replyInputEl) replyInputEl.focus();
      if (msgsBox) msgsBox.scrollTop = msgsBox.scrollHeight;
    } catch (e) {}
  }

  function deleteConversation(id) {
    if (!id) return alert("Chưa chọn cuộc hội thoại");
    const convsAll = loadConversations();
    const conv = convsAll.find((c) => c.id === id);
    if (!conv) return alert("Cuộc hội thoại không tồn tại");
    const cnt = (conv.messages || []).length;
    const email = conv.email || "Khách ẩn danh";
    if (
      !confirm(
        `Xóa cuộc hội thoại của ${email}? (${cnt} tin)\nHành động này sẽ xóa cả tin nhắn liên quan.`
      )
    )
      return;
    const convs = convsAll.filter((c) => c.id !== id);
    saveConversations(convs);

    // remove related site_chats entries (by convoId or email)
    try {
      const site = JSON.parse(localStorage.getItem("site_chats") || "[]");
      const filtered = site.filter(
        (s) => !(s.convoId === id || (conv.email && s.email === conv.email))
      );
      localStorage.setItem("site_chats", JSON.stringify(filtered));
    } catch (e) {}

    currentConvoId = null;
    const msgsBox = document.getElementById("convoMessages");
    if (msgsBox) msgsBox.innerHTML = "";

    const delBtn = document.getElementById("convoDelete");
    if (delBtn) {
      delBtn.disabled = true;
      delBtn.title = "Chưa chọn cuộc hội thoại";
    }

    // show search, refresh, list buttons again after deletion
    const sEl = document.getElementById("convoSearch");
    if (sEl) sEl.style.display = "block";
    const refreshBtn = document.getElementById("refreshConvos");
    if (refreshBtn) refreshBtn.style.display = "block";
    const listBtn = document.getElementById("openConvoList");
    if (listBtn) listBtn.style.display = "block";

    renderConversationsList(
      document.getElementById("convoSearch")?.value || ""
    );
    alert("Đã xóa cuộc hội thoại.");
  }

  function exportConversationsCSV() {
    const convs = loadConversations();
    const headers = ["convoId", "email", "sender", "text", "ts"];
    // build rows safely
    const rows = convs.flatMap((c) =>
      (c.messages || []).map((m) =>
        [
          `"${c.id}"`,
          `"${(c.email || "").replace(/"/g, '""')}"`,
          `"${(m.sender || "").replace(/"/g, '""')}"`,
          `"${(m.text || "").replace(/"/g, '""')}"`,
          `"${m.ts || ""}"`,
        ].join(",")
      )
    );

    const csv = [headers.join(",")].concat(rows).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversations.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // helper: send business message to an arbitrary email (used by quick-send UI)
  function sendBusinessMessageToEmail(email, text) {
    if (!email || !text) return false;
    const convs = loadConversations();
    let conv = convs.find((c) => c.email === email);
    const ts = Date.now();
    if (!conv) {
      conv = {
        id: `conv_${email}_${ts}`,
        email,
        messages: [],
        lastTs: ts,
        unreadByBusiness: false,
        unreadByUser: true,
      };
      convs.push(conv);
    }
    conv.messages.push({ sender: "business", role: "business", text, ts });
    conv.lastTs = ts;
    conv.unreadByUser = true;
    // save conversations
    saveConversations(convs);
    // also push to legacy site_chats
    try {
      const site = JSON.parse(localStorage.getItem("site_chats") || "[]");
      site.push({
        sender: "support",
        text,
        ts,
        email: conv.email,
        convoId: conv.id,
      });
      localStorage.setItem("site_chats", JSON.stringify(site));
    } catch (e) {}
    // refresh UI
    try {
      renderConversationsList(
        document.getElementById("convoSearch")?.value || ""
      );
    } catch (e) {}
    return true;
  }

  // bind conversation UI on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    const convoSearch = document.getElementById("convoSearch");
    const refreshConvos = document.getElementById("refreshConvos");
    const convoReplySend = document.getElementById("convoReplySend");
    const convoReplyInput = document.getElementById("convoReplyInput");
    const convoDelete = document.getElementById("convoDelete");
    if (convoDelete) {
      convoDelete.disabled = true;
      convoDelete.title = "Chưa chọn cuộc hội thoại";
    }

    convoSearch &&
      convoSearch.addEventListener("input", () =>
        renderConversationsList(convoSearch.value)
      );
    refreshConvos &&
      refreshConvos.addEventListener("click", () =>
        renderConversationsList(convoSearch?.value || "")
      );
    convoReplySend &&
      convoReplySend.addEventListener("click", () => {
        const text = convoReplyInput.value.trim();
        if (!text) return;
        sendBusinessMessageToCurrent(text);
        convoReplyInput.value = "";
      });
    // send on Enter (Shift+Enter for newline)
    convoReplyInput &&
      convoReplyInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          convoReplySend && convoReplySend.click();
        }
      });

    convoDelete &&
      convoDelete.addEventListener("click", () => {
        if (!currentConvoId) return alert("Chưa chọn cuộc hội thoại");
        deleteConversation(currentConvoId);
      });

    // auto refresh to pick up new messages from customers
    setInterval(() => {
      renderConversationsList(
        document.getElementById("convoSearch")?.value || ""
      );
      if (currentConvoId) renderConversation(currentConvoId);
    }, 2000);

    renderConversationsList();
  });

  // expose for debugging (optional)
  window._adminFeedback = {
    renderAdminReviews,
    loadFeedbacks,
    saveFeedbacks,
    renderConversationsList,
    loadConversations,
    saveConversations,
    sendBusinessMessageToCurrent,
    deleteConversation,
    exportConversationsCSV,
  };
})();

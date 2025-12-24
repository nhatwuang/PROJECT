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

  // expose for debugging (optional)
  window._adminFeedback = { renderAdminReviews, loadFeedbacks, saveFeedbacks };
})();

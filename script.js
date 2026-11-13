const APP_CONFIG = {
  storageKey: "stacktrail-state-v1",
  apiBaseUrl: "",
  useMockData: true,
};

const STATUS_ORDER = {
  "Not Started": 0,
  "In Progress": 1,
  Completed: 2,
};

const DEFAULT_ACTIVITY = [
  {
    id: "a1",
    kind: "success",
    title: "Kubernetes milestone completed",
    message: "DevOps Engineering roadmap updated by Jamiu B.",
    time: "2026-11-12T15:30:00.000Z",
    roadmapId: "roadmap-devops",
  },
  {
    id: "a2",
    kind: "primary",
    title: "New roadmap created",
    message: "Frontend Mastery was added to your library.",
    time: "2026-11-10T12:10:00.000Z",
    roadmapId: "roadmap-frontend",
  },
  {
    id: "a3",
    kind: "warning",
    title: "Progress updated",
    message: "Terraform study block advanced to In Progress.",
    time: "2026-11-07T09:20:00.000Z",
    roadmapId: "roadmap-devops",
  },
];

const DEFAULT_STATE = {
  roadmaps: [
    {
      id: "roadmap-devops",
      title: "DevOps Engineering",
      description:
        "A structured path for building practical cloud and automation skills across Linux, containers, infrastructure, and delivery pipelines.",
      category: "DevOps",
      createdAt: "2026-10-04T09:00:00.000Z",
      updatedAt: "2026-11-12T15:30:00.000Z",
      milestones: [
        {
          id: "m1",
          title: "Linux Fundamentals",
          description:
            "Master shell usage, system management, file permissions, and process monitoring.",
          status: "Completed",
          estimatedDate: "2026-10-10",
          createdAt: "2026-10-04T09:15:00.000Z",
        },
        {
          id: "m2",
          title: "Git & GitHub",
          description:
            "Build reliable workflows with branching, rebasing, pull requests, and collaboration patterns.",
          status: "Completed",
          estimatedDate: "2026-10-15",
          createdAt: "2026-10-04T09:20:00.000Z",
        },
        {
          id: "m3",
          title: "Docker",
          description:
            "Containerize services, manage image layers, and debug running workloads.",
          status: "Completed",
          estimatedDate: "2026-10-25",
          createdAt: "2026-10-04T09:25:00.000Z",
        },
        {
          id: "m4",
          title: "Kubernetes",
          description:
            "Deploy applications using pods, services, ingress, and cluster health monitoring.",
          status: "Completed",
          estimatedDate: "2026-11-12",
          createdAt: "2026-10-04T09:30:00.000Z",
        },
        {
          id: "m5",
          title: "AWS Core Services",
          description:
            "Use EC2, IAM, S3, ELB, and networking fundamentals in a cloud environment.",
          status: "In Progress",
          estimatedDate: "2026-11-25",
          createdAt: "2026-10-04T09:35:00.000Z",
        },
        {
          id: "m6",
          title: "Terraform",
          description:
            "Define infrastructure as code with modules, remote state, and production-ready structure.",
          status: "In Progress",
          estimatedDate: "2026-12-05",
          createdAt: "2026-10-04T09:40:00.000Z",
        },
        {
          id: "m7",
          title: "CI/CD",
          description:
            "Automate build, test, and deployment pipelines with confidence and traceability.",
          status: "Not Started",
          estimatedDate: "2026-12-15",
          createdAt: "2026-10-04T09:45:00.000Z",
        },
      ],
    },
    {
      id: "roadmap-frontend",
      title: "Frontend Mastery",
      description:
        "Develop polished UI systems and production-ready front-end engineering skills with accessibility and performance in mind.",
      category: "Frontend",
      createdAt: "2026-10-12T12:00:00.000Z",
      updatedAt: "2026-11-10T12:10:00.000Z",
      milestones: [
        {
          id: "f1",
          title: "Semantic HTML",
          description:
            "Build accessible and well-structured interfaces with robust semantics.",
          status: "Completed",
          estimatedDate: "2026-10-20",
          createdAt: "2026-10-12T12:15:00.000Z",
        },
        {
          id: "f2",
          title: "Responsive CSS Systems",
          description:
            "Create layouts that adapt elegantly across device sizes with scalable patterns.",
          status: "Completed",
          estimatedDate: "2026-10-28",
          createdAt: "2026-10-12T12:20:00.000Z",
        },
        {
          id: "f3",
          title: "JavaScript Patterns",
          description:
            "Use modular logic, state handling, and event-driven UI design patterns.",
          status: "In Progress",
          estimatedDate: "2026-11-18",
          createdAt: "2026-10-12T12:25:00.000Z",
        },
        {
          id: "f4",
          title: "Performance & Accessibility",
          description:
            "Measure UX quality and improve responsiveness, focus states, and keyboard flow.",
          status: "Not Started",
          estimatedDate: "2026-12-01",
          createdAt: "2026-10-12T12:30:00.000Z",
        },
      ],
    },
  ],
  activityLog: DEFAULT_ACTIVITY,
  selectedRoadmapId: "roadmap-devops",
  activeNav: "overview",
};

let appState = loadState();

const appContent = document.getElementById("appContent");
const sidebarRoadmapList = document.getElementById("sidebarRoadmapList");
const pageTitle = document.getElementById("pageTitle");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileOverlay = document.getElementById("mobileOverlay");
const sidebar = document.getElementById("sidebar");

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.storageKey);
    if (!raw) {
      return structuredClone(DEFAULT_STATE);
    }

    const parsed = JSON.parse(raw);
    if (!parsed.roadmaps || !Array.isArray(parsed.roadmaps)) {
      return structuredClone(DEFAULT_STATE);
    }

    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      roadmaps: parsed.roadmaps,
      activityLog: parsed.activityLog || DEFAULT_ACTIVITY,
    };
  } catch (error) {
    console.warn("Failed to load state from localStorage:", error);
    return structuredClone(DEFAULT_STATE);
  }
}

function persistState() {
  localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(appState));
}

function getRoadmapById(id) {
  return appState.roadmaps.find((roadmap) => roadmap.id === id) || null;
}

function calculateRoadmapProgress(roadmap) {
  if (!roadmap || !roadmap.milestones || roadmap.milestones.length === 0) {
    return 0;
  }

  const completedCount = roadmap.milestones.filter(
    (milestone) => milestone.status === "Completed",
  ).length;
  return Math.round((completedCount / roadmap.milestones.length) * 100);
}

function calculateOverallProgress() {
  if (appState.roadmaps.length === 0) {
    return 0;
  }

  const totalMilestones = appState.roadmaps.reduce(
    (sum, roadmap) => sum + (roadmap.milestones?.length || 0),
    0,
  );
  const completedMilestones = appState.roadmaps.reduce(
    (sum, roadmap) =>
      sum +
      (roadmap.milestones?.filter((item) => item.status === "Completed")
        .length || 0),
    0,
  );

  if (!totalMilestones) {
    return 0;
  }

  return Math.round((completedMilestones / totalMilestones) * 100);
}

function getCompletedMilestonesCount() {
  return appState.roadmaps.reduce(
    (sum, roadmap) =>
      sum +
      (roadmap.milestones?.filter((item) => item.status === "Completed")
        .length || 0),
    0,
  );
}

function getActiveRoadmapCount() {
  return appState.roadmaps.filter(
    (roadmap) => calculateRoadmapProgress(roadmap) < 100,
  ).length;
}

function formatDate(dateString, options = { month: "short", day: "numeric" }) {
  if (!dateString) {
    return "No date";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function timeAgo(dateString) {
  if (!dateString) {
    return "Recently";
  }

  const date = new Date(dateString);
  const diffMinutes = Math.max(
    1,
    Math.round((Date.now() - date.getTime()) / 60000),
  );

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  return formatDate(dateString, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRoadmapMilestoneSummary(roadmap) {
  const total = roadmap.milestones.length || 0;
  const completed = roadmap.milestones.filter(
    (m) => m.status === "Completed",
  ).length;
  return `${completed}/${total} complete`;
}

function addActivity({ title, message, roadmapId, kind = "primary" }) {
  appState.activityLog.unshift({
    id: generateId("activity"),
    title,
    message,
    roadmapId,
    kind,
    time: new Date().toISOString(),
  });

  appState.activityLog = appState.activityLog.slice(0, 6);
  persistState();
}

function setActiveNav(value) {
  appState.activeNav = value;
  persistState();
  renderApp();
}

function openRoadmap(roadmapId) {
  appState.selectedRoadmapId = roadmapId;
  persistState();
  appState.activeNav = "roadmaps";
  renderApp();
}

function toggleSidebar(forceValue) {
  const shouldOpen =
    typeof forceValue === "boolean"
      ? forceValue
      : !sidebar.classList.contains("open");
  sidebar.classList.toggle("open", shouldOpen);
  mobileOverlay.classList.toggle("open", shouldOpen);
}

function renderSidebarRoadmapList() {
  if (!appState.roadmaps.length) {
    sidebarRoadmapList.innerHTML = `
      <div class="empty-state compact">
        <p>No roadmaps yet</p>
      </div>
    `;
    return;
  }

  sidebarRoadmapList.innerHTML = appState.roadmaps
    .map((roadmap) => {
      const isSelected = roadmap.id === appState.selectedRoadmapId;
      const progress = calculateRoadmapProgress(roadmap);

      return `
        <button class="sidebar-roadmap-item ${isSelected ? "active" : ""}" type="button" data-action="open-roadmap" data-roadmap-id="${roadmap.id}">
          <span class="sidebar-roadmap-dot" style="background:${getCategoryColor(roadmap.category)};"></span>
          <span class="sidebar-roadmap-meta">
            <strong>${escapeHtml(roadmap.title)}</strong>
            <span>${progress}% complete</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function getCategoryColor(category) {
  const palette = {
    DevOps: "#4bb7ff",
    Frontend: "#7dd3fc",
    Backend: "#2dd4bf",
    Cloud: "#60a5fa",
    Cybersecurity: "#a78bfa",
    "Data Science": "#34d399",
    "AI & ML": "#fbbf24",
    "Software Engineering": "#f472b6",
  };

  return palette[category] || "#4bb7ff";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderOverview() {
  const totalRoadmaps = appState.roadmaps.length;
  const completedMilestones = getCompletedMilestonesCount();
  const activeRoadmaps = getActiveRoadmapCount();
  const overallProgress = calculateOverallProgress();

  const continueLearning = [...appState.roadmaps]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  const recentActivities = appState.activityLog.slice(0, 4);
  const upcomingGoals = getUpcomingGoals();

  pageTitle.textContent = "Overview";

  appContent.innerHTML = `
    <div class="dashboard-grid">
      <section class="hero-card">
        <div class="hero-content">
          <p class="eyebrow">Welcome back</p>
          <h3>Good evening, Jamiu.</h3>
          <p>Keep momentum in your learning path. Small wins compound into major technical growth.</p>
          <div class="hero-badges">
            <span class="badge"><i class="fa-solid fa-bolt"></i> 1 roadmap in motion</span>
            <span class="badge"><i class="fa-solid fa-check"></i> ${completedMilestones} milestones mastered</span>
          </div>
        </div>
        <div class="hero-panel">
          <div class="progress-orb" aria-label="Overall learning progress">
            <div class="orb-value">
              <strong>${overallProgress}%</strong>
              <span>Progress</span>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Total roadmaps</span>
            <span class="stat-icon"><i class="fa-solid fa-map"></i></span>
          </div>
          <p class="stat-value">${totalRoadmaps}</p>
          <span class="stat-trend"><i class="fa-solid fa-arrow-trend-up"></i> Active learning</span>
        </article>

        <article class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Active roadmaps</span>
            <span class="stat-icon"><i class="fa-solid fa-chart-line"></i></span>
          </div>
          <p class="stat-value">${activeRoadmaps}</p>
          <span class="stat-trend"><i class="fa-solid fa-clock"></i> Being tracked</span>
        </article>

        <article class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Completed milestones</span>
            <span class="stat-icon"><i class="fa-solid fa-circle-check"></i></span>
          </div>
          <p class="stat-value">${completedMilestones}</p>
          <span class="stat-trend"><i class="fa-solid fa-trophy"></i> Momentum built</span>
        </article>

        <article class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Overall learning progress</span>
            <span class="stat-icon"><i class="fa-solid fa-percent"></i></span>
          </div>
          <p class="stat-value">${overallProgress}%</p>
          <span class="stat-trend"><i class="fa-solid fa-check-double"></i> Across all tracks</span>
        </article>
      </section>

      <section class="content-grid">
        <div class="panel">
          <div class="panel-header">
            <h3>Continue Learning</h3>
            <button class="secondary-button" type="button" data-action="open-roadmaps">View all</button>
          </div>
          ${
            continueLearning.length
              ? `<div class="roadmap-stack">
                  ${continueLearning
                    .map((roadmap) => {
                      const progress = calculateRoadmapProgress(roadmap);
                      const completed = roadmap.milestones.filter(
                        (milestone) => milestone.status === "Completed",
                      ).length;
                      return `
                        <article class="roadmap-card">
                          <div class="roadmap-card-top">
                            <div>
                              <span class="roadmap-badge"><i class="fa-solid fa-tags"></i> ${escapeHtml(roadmap.category)}</span>
                              <h4>${escapeHtml(roadmap.title)}</h4>
                            </div>
                          </div>
                          <p>${escapeHtml(roadmap.description)}</p>
                          <div>
                            <div class="progress-row">
                              <span>${progress}% complete</span>
                              <span>${completed}/${roadmap.milestones.length} done</span>
                            </div>
                            <div class="progress-bar"><span class="progress-fill" style="width:${progress}%"></span></div>
                          </div>
                          <div class="roadmap-meta-row">
                            <span>Updated ${timeAgo(roadmap.updatedAt)}</span>
                            <button class="secondary-inline" type="button" data-action="open-roadmap" data-roadmap-id="${roadmap.id}">Continue <i class="fa-solid fa-arrow-right"></i></button>
                          </div>
                        </article>
                      `;
                    })
                    .join("")}
                </div>`
              : `<div class="empty-state"><i class="fa-solid fa-road"></i><h4>No active roadmaps</h4><p>Create a roadmap to begin your next learning track.</p><button class="primary-button" type="button" data-action="new-roadmap"><i class="fa-solid fa-plus"></i> New roadmap</button></div>`
          }
        </div>

        <aside class="panel">
          <div class="panel-header">
            <h3>Recent Activity</h3>
          </div>
          ${
            recentActivities.length
              ? `<div class="activity-list">
                  ${recentActivities
                    .map(
                      (item) => `
                        <div class="activity-item">
                          <div class="activity-icon ${item.kind}">
                            <i class="fa-solid ${item.kind === "success" ? "fa-circle-check" : item.kind === "primary" ? "fa-plus" : "fa-arrows-rotate"}"></i>
                          </div>
                          <div class="activity-content">
                            <strong>${escapeHtml(item.title)}</strong>
                            <span>${escapeHtml(item.message)}</span>
                          </div>
                        </div>
                      `,
                    )
                    .join("")}
                </div>`
              : `<div class="empty-state"><i class="fa-solid fa-clock-rotate-left"></i><p>No recent activity yet.</p></div>`
          }
        </aside>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h3>Learning Goals</h3>
          <button class="secondary-button" type="button" data-action="new-roadmap">+ Add goal</button>
        </div>
        ${
          upcomingGoals.length
            ? `<div class="goal-list">
                ${upcomingGoals
                  .map(
                    (goal) => `
                      <div class="goal-item">
                        <div class="goal-content">
                          <strong>${escapeHtml(goal.title)}</strong>
                          <span>${escapeHtml(goal.roadmapTitle)}</span>
                          <small>${formatDate(goal.estimatedDate)}</small>
                        </div>
                        <span class="goal-pill">${goal.status}</span>
                      </div>
                    `,
                  )
                  .join("")}
              </div>`
            : `<div class="empty-state"><i class="fa-solid fa-list-check"></i><p>Set a milestone target to start tracking your next goal.</p></div>`
        }
      </section>
    </div>
  `;
}

function getUpcomingGoals() {
  const goals = [];

  appState.roadmaps.forEach((roadmap) => {
    roadmap.milestones
      .filter((milestone) => milestone.status !== "Completed")
      .sort(
        (a, b) =>
          new Date(a.estimatedDate || "2099-12-31") -
          new Date(b.estimatedDate || "2099-12-31"),
      )
      .slice(0, 3)
      .forEach((milestone) => {
        goals.push({
          title: milestone.title,
          roadmapTitle: roadmap.title,
          estimatedDate: milestone.estimatedDate,
          status: milestone.status,
        });
      });
  });

  return goals.slice(0, 4);
}

function renderRoadmapsView() {
  pageTitle.textContent = "My Roadmaps";

  const selectedRoadmap = getRoadmapById(appState.selectedRoadmapId);

  appContent.innerHTML = `
    <div class="roadmap-view">
      <div class="panel">
        <div class="panel-header">
          <h3>Your roadmap library</h3>
          <button class="primary-button" type="button" data-action="new-roadmap">
            <i class="fa-solid fa-plus"></i>
            <span>Create roadmap</span>
          </button>
        </div>
        ${
          appState.roadmaps.length
            ? `<div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));">
                ${appState.roadmaps
                  .map((roadmap) => {
                    const progress = calculateRoadmapProgress(roadmap);
                    const completed = roadmap.milestones.filter(
                      (m) => m.status === "Completed",
                    ).length;
                    return `
                      <article class="roadmap-card ${selectedRoadmap?.id === roadmap.id ? "selected" : ""}">
                        <div class="roadmap-card-top">
                          <div>
                            <span class="roadmap-badge"><i class="fa-solid fa-tags"></i> ${escapeHtml(roadmap.category)}</span>
                            <h4>${escapeHtml(roadmap.title)}</h4>
                          </div>
                        </div>
                        <p>${escapeHtml(roadmap.description)}</p>
                        <div>
                          <div class="progress-row">
                            <span>${progress}%</span>
                            <span>${completed}/${roadmap.milestones.length}</span>
                          </div>
                          <div class="progress-bar"><span class="progress-fill" style="width:${progress}%"></span></div>
                        </div>
                        <div class="roadmap-meta-row">
                          <span>${getRoadmapMilestoneSummary(roadmap)}</span>
                          <div style="display:flex;gap:0.45rem;">
                            <button class="kicker-button" type="button" data-action="open-roadmap" data-roadmap-id="${roadmap.id}">Open</button>
                            <button class="icon-button" type="button" data-action="edit-roadmap" data-roadmap-id="${roadmap.id}" aria-label="Edit roadmap"><i class="fa-solid fa-pen"></i></button>
                          </div>
                        </div>
                      </article>
                    `;
                  })
                  .join("")}
              </div>`
            : `<div class="empty-state"><i class="fa-solid fa-route"></i><h4>No roadmaps yet</h4><p>Start by creating your first learning roadmap.</p><button class="primary-button" type="button" data-action="new-roadmap"><i class="fa-solid fa-plus"></i> New roadmap</button></div>`
        }
      </div>

      ${selectedRoadmap ? renderRoadmapDetail(selectedRoadmap) : ""}
    </div>
  `;
}

function renderRoadmapDetail(roadmap) {
  const progress = calculateRoadmapProgress(roadmap);
  const totalMilestones = roadmap.milestones.length;
  const completed = roadmap.milestones.filter(
    (milestone) => milestone.status === "Completed",
  ).length;

  return `
    <section class="roadmap-header-card">
      <div class="roadmap-header-top">
        <div class="roadmap-header-main">
          <span class="roadmap-badge"><i class="fa-solid fa-tags"></i> ${escapeHtml(roadmap.category)}</span>
          <h3>${escapeHtml(roadmap.title)}</h3>
          <p>${escapeHtml(roadmap.description)}</p>
        </div>

        <div class="roadmap-header-actions">
          <button class="secondary-button" type="button" data-action="edit-roadmap" data-roadmap-id="${roadmap.id}">
            <i class="fa-solid fa-pen"></i>
            Edit
          </button>
          <button class="secondary-button" type="button" data-action="delete-roadmap" data-roadmap-id="${roadmap.id}">
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>
        </div>
      </div>

      <div class="roadmap-stat-row">
        <div class="stat-chip"><span>Progress</span> <strong>${progress}%</strong></div>
        <div class="stat-chip"><span>Milestones</span> <strong>${completed}/${totalMilestones}</strong></div>
        <div class="stat-chip"><span>Updated</span> <strong>${timeAgo(roadmap.updatedAt)}</strong></div>
      </div>
    </section>

    <section class="panel milestone-panel">
      <div class="milestone-toolbar">
        <h3>Milestones</h3>
        <button class="primary-button" type="button" data-action="new-milestone" data-roadmap-id="${roadmap.id}">
          <i class="fa-solid fa-plus"></i>
          Add milestone
        </button>
      </div>

      ${
        roadmap.milestones.length
          ? `<div class="milestone-list">
              ${roadmap.milestones
                .sort((a, b) => STATUS_ORDER[b.status] - STATUS_ORDER[a.status])
                .map(
                  (milestone) => `
                    <div class="milestone-item">
                      <span class="milestone-status-indicator ${milestone.status.toLowerCase().replace(/\s+/g, "-")}"></span>
                      <div class="milestone-body">
                        <h4>${escapeHtml(milestone.title)}</h4>
                        <p>${escapeHtml(milestone.description)}</p>
                        <div class="milestone-meta">
                          <span><i class="fa-regular fa-calendar"></i> ${milestone.estimatedDate ? formatDate(milestone.estimatedDate) : "No target date"}</span>
                          <span><i class="fa-regular fa-circle"></i> ${escapeHtml(milestone.status)}</span>
                        </div>
                      </div>
                      <div class="milestone-actions">
                        <select class="status-select" data-action="update-status" data-roadmap-id="${roadmap.id}" data-milestone-id="${milestone.id}" aria-label="Update milestone status">
                          ${["Not Started", "In Progress", "Completed"]
                            .map(
                              (status) => `
                                <option value="${status}" ${status === milestone.status ? "selected" : ""}>${status}</option>
                              `,
                            )
                            .join("")}
                        </select>
                        <button class="icon-button" type="button" data-action="edit-milestone" data-roadmap-id="${roadmap.id}" data-milestone-id="${milestone.id}" aria-label="Edit milestone"><i class="fa-solid fa-pen"></i></button>
                        <button class="icon-button" type="button" data-action="delete-milestone" data-roadmap-id="${roadmap.id}" data-milestone-id="${milestone.id}" aria-label="Delete milestone"><i class="fa-solid fa-trash"></i></button>
                      </div>
                    </div>
                  `,
                )
                .join("")}
            </div>`
          : `<div class="empty-state"><i class="fa-solid fa-list-check"></i><h4>No milestones yet</h4><p>Add your first milestone to start building this roadmap.</p></div>`
      }
    </section>
  `;
}

function openRoadmapModal(roadmapId = null) {
  const modal = document.getElementById("roadmapModalBackdrop");
  const form = document.getElementById("roadmapForm");
  const title = document.getElementById("roadmapModalTitle");
  const inputId = document.getElementById("roadmapId");
  const titleInput = document.getElementById("roadmapTitle");
  const descriptionInput = document.getElementById("roadmapDescription");
  const categoryInput = document.getElementById("roadmapCategory");

  if (roadmapId) {
    const roadmap = getRoadmapById(roadmapId);
    if (!roadmap) {
      return;
    }

    inputId.value = roadmap.id;
    titleInput.value = roadmap.title;
    descriptionInput.value = roadmap.description;
    categoryInput.value = roadmap.category;
    title.textContent = "Edit roadmap";
    form.dataset.mode = "edit";
  } else {
    inputId.value = "";
    form.reset();
    title.textContent = "Create roadmap";
    categoryInput.value = "DevOps";
    form.dataset.mode = "create";
  }

  modal.classList.remove("hidden");
}

function closeRoadmapModal() {
  document.getElementById("roadmapModalBackdrop").classList.add("hidden");
  document.getElementById("roadmapForm").reset();
}

function openMilestoneModal(roadmapId, milestoneId = null) {
  const modal = document.getElementById("milestoneModalBackdrop");
  const form = document.getElementById("milestoneForm");
  const roadmapInput = document.getElementById("milestoneRoadmapId");
  const idInput = document.getElementById("milestoneId");
  const titleInput = document.getElementById("milestoneTitle");
  const descriptionInput = document.getElementById("milestoneDescription");
  const statusInput = document.getElementById("milestoneStatus");
  const dateInput = document.getElementById("milestoneDate");

  const roadmap = getRoadmapById(roadmapId);
  if (!roadmap) return;

  roadmapInput.value = roadmapId;
  idInput.value = milestoneId || "";

  if (milestoneId) {
    const milestone = roadmap.milestones.find(
      (item) => item.id === milestoneId,
    );
    if (!milestone) return;
    titleInput.value = milestone.title;
    descriptionInput.value = milestone.description;
    statusInput.value = milestone.status;
    dateInput.value = milestone.estimatedDate || "";
    document.getElementById("milestoneModalTitle").textContent =
      "Edit milestone";
    form.dataset.mode = "edit";
  } else {
    form.reset();
    statusInput.value = "Not Started";
    dateInput.value = "";
    document.getElementById("milestoneModalTitle").textContent =
      "Add milestone";
    form.dataset.mode = "create";
  }

  modal.classList.remove("hidden");
}

function closeMilestoneModal() {
  document.getElementById("milestoneModalBackdrop").classList.add("hidden");
  document.getElementById("milestoneForm").reset();
}

function handleRoadmapFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const id = document.getElementById("roadmapId").value;
  const title = document.getElementById("roadmapTitle").value.trim();
  const description = document
    .getElementById("roadmapDescription")
    .value.trim();
  const category = document.getElementById("roadmapCategory").value;

  if (!title || !description) {
    alert("Please provide both a roadmap title and description.");
    return;
  }

  if (id) {
    const roadmap = getRoadmapById(id);
    if (!roadmap) {
      return;
    }

    roadmap.title = title;
    roadmap.description = description;
    roadmap.category = category;
    roadmap.updatedAt = new Date().toISOString();
    addActivity({
      title: "Roadmap updated",
      message: `${title} was edited successfully.`,
      roadmapId: roadmap.id,
      kind: "primary",
    });
  } else {
    const newRoadmap = {
      id: generateId("roadmap"),
      title,
      description,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: [],
    };

    appState.roadmaps.unshift(newRoadmap);
    appState.selectedRoadmapId = newRoadmap.id;
    addActivity({
      title: "New roadmap created",
      message: `${title} was added to your learning library.`,
      roadmapId: newRoadmap.id,
      kind: "success",
    });
  }

  persistState();
  closeRoadmapModal();
  renderApp();
}

function handleMilestoneFormSubmit(event) {
  event.preventDefault();
  const roadmapId = document.getElementById("milestoneRoadmapId").value;
  const milestoneId = document.getElementById("milestoneId").value;
  const title = document.getElementById("milestoneTitle").value.trim();
  const description = document
    .getElementById("milestoneDescription")
    .value.trim();
  const status = document.getElementById("milestoneStatus").value;
  const estimatedDate = document.getElementById("milestoneDate").value;

  const roadmap = getRoadmapById(roadmapId);
  if (!roadmap) {
    return;
  }

  if (!title || !description) {
    alert("Please add a milestone title and description.");
    return;
  }

  if (milestoneId) {
    const milestone = roadmap.milestones.find(
      (item) => item.id === milestoneId,
    );
    if (!milestone) {
      return;
    }

    milestone.title = title;
    milestone.description = description;
    milestone.status = status;
    milestone.estimatedDate = estimatedDate;
    addActivity({
      title: "Milestone updated",
      message: `${title} was updated in ${roadmap.title}.`,
      roadmapId: roadmap.id,
      kind: "warning",
    });
  } else {
    const newMilestone = {
      id: generateId("milestone"),
      title,
      description,
      status,
      estimatedDate,
      createdAt: new Date().toISOString(),
    };

    roadmap.milestones.push(newMilestone);
    addActivity({
      title: "New milestone added",
      message: `${title} was added to ${roadmap.title}.`,
      roadmapId: roadmap.id,
      kind: "primary",
    });
  }

  roadmap.updatedAt = new Date().toISOString();
  persistState();
  closeMilestoneModal();
  renderApp();
}

function deleteRoadmap(roadmapId) {
  const roadmap = getRoadmapById(roadmapId);
  if (!roadmap) {
    return;
  }

  const confirmed = window.confirm(
    `Delete ${roadmap.title}? This action cannot be undone.`,
  );
  if (!confirmed) {
    return;
  }

  appState.roadmaps = appState.roadmaps.filter((item) => item.id !== roadmapId);

  if (appState.selectedRoadmapId === roadmapId) {
    appState.selectedRoadmapId = appState.roadmaps[0]?.id || null;
  }

  addActivity({
    title: "Roadmap deleted",
    message: `${roadmap.title} was removed from your library.`,
    roadmapId: roadmap.id,
    kind: "warning",
  });

  persistState();
  renderApp();
}

function deleteMilestone(roadmapId, milestoneId) {
  const roadmap = getRoadmapById(roadmapId);
  if (!roadmap) {
    return;
  }

  const milestone = roadmap.milestones.find((item) => item.id === milestoneId);
  if (!milestone) {
    return;
  }

  const confirmed = window.confirm(`Delete milestone "${milestone.title}"?`);
  if (!confirmed) {
    return;
  }

  roadmap.milestones = roadmap.milestones.filter(
    (item) => item.id !== milestoneId,
  );
  roadmap.updatedAt = new Date().toISOString();

  addActivity({
    title: "Milestone removed",
    message: `${milestone.title} was removed from ${roadmap.title}.`,
    roadmapId: roadmap.id,
    kind: "warning",
  });

  persistState();
  renderApp();
}

function updateMilestoneStatus(roadmapId, milestoneId, nextStatus) {
  const roadmap = getRoadmapById(roadmapId);
  if (!roadmap) {
    return;
  }

  const milestone = roadmap.milestones.find((item) => item.id === milestoneId);
  if (!milestone) {
    return;
  }

  const previousStatus = milestone.status;
  milestone.status = nextStatus;
  roadmap.updatedAt = new Date().toISOString();

  const statusMessage =
    nextStatus === "Completed" ? "completed" : `updated to ${nextStatus}`;
  if (previousStatus !== nextStatus) {
    addActivity({
      title: "Milestone status changed",
      message: `${milestone.title} is now ${statusMessage}.`,
      roadmapId: roadmap.id,
      kind: nextStatus === "Completed" ? "success" : "primary",
    });
  }

  persistState();
  renderApp();
}

function handleDocumentClick(event) {
  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget) {
    const { action, roadmapId, milestoneId } = actionTarget.dataset;

    if (action === "new-roadmap") {
      openRoadmapModal();
      return;
    }

    if (action === "open-roadmap") {
      openRoadmap(roadmapId);
      return;
    }

    if (action === "open-roadmaps") {
      appState.activeNav = "roadmaps";
      renderApp();
      return;
    }

    if (action === "edit-roadmap") {
      openRoadmapModal(roadmapId);
      return;
    }

    if (action === "delete-roadmap") {
      deleteRoadmap(roadmapId);
      return;
    }

    if (action === "new-milestone") {
      openMilestoneModal(roadmapId);
      return;
    }

    if (action === "edit-milestone") {
      openMilestoneModal(roadmapId, milestoneId);
      return;
    }

    if (action === "delete-milestone") {
      deleteMilestone(roadmapId, milestoneId);
      return;
    }
  }

  const closeTarget = event.target.closest("[data-close-modal]");
  if (closeTarget) {
    const modalName = closeTarget.dataset.closeModal;
    if (modalName === "roadmap") closeRoadmapModal();
    if (modalName === "milestone") closeMilestoneModal();
  }
}

function handleStatusSelectChange(event) {
  const select = event.target.closest('[data-action="update-status"]');
  if (!select) {
    return;
  }

  const { roadmapId, milestoneId } = select.dataset;
  const nextStatus = select.value;
  updateMilestoneStatus(roadmapId, milestoneId, nextStatus);
}

function handleNavClick(event) {
  const button = event.target.closest("[data-nav]");
  if (!button) {
    return;
  }

  const { nav } = button.dataset;
  appState.activeNav = nav;
  persistState();
  renderApp();
  toggleSidebar(false);
}

function renderApp() {
  renderSidebarRoadmapList();

  document.querySelectorAll(".nav-item").forEach((item) => {
    const isActive = item.dataset.nav === appState.activeNav;
    item.classList.toggle("active", isActive);
  });

  if (appState.activeNav === "overview") {
    renderOverview();
    return;
  }

  if (appState.activeNav === "roadmaps") {
    renderRoadmapsView();
    return;
  }

  if (appState.activeNav === "explore" || appState.activeNav === "settings") {
    pageTitle.textContent =
      appState.activeNav === "explore" ? "Explore" : "Settings";
    appContent.innerHTML = `
      <div class="empty-state" style="min-height: 420px;">
        <i class="fa-solid ${appState.activeNav === "explore" ? "fa-compass" : "fa-gear"}"></i>
        <h4>${appState.activeNav === "explore" ? "Explore is coming soon" : "Settings are coming soon"}</h4>
        <p>This area is reserved for future roadmap discovery and personalization controls.</p>
      </div>
    `;
  }
}

function triggerBodyPulse() {
  const body = document.body;
  const themes = [
    "radial-gradient(circle at top left, rgba(75, 183, 255, 0.18), transparent 22%), linear-gradient(180deg, #0d1520, #111d2e)",
    "radial-gradient(circle at top right, rgba(53, 208, 160, 0.16), transparent 24%), linear-gradient(180deg, #0d1520, #0d1d2f)",
    "radial-gradient(circle at center, rgba(139, 92, 246, 0.16), transparent 28%), linear-gradient(180deg, #0d1520, #101c2b)",
  ];

  const nextTheme = themes[Math.floor(Math.random() * themes.length)];
  body.style.background = nextTheme;
  body.classList.remove("body-glow");
  void body.offsetWidth;
  body.classList.add("body-glow");

  window.clearTimeout(triggerBodyPulse.timeoutId);
  triggerBodyPulse.timeoutId = window.setTimeout(() => {
    body.style.background = "";
    body.classList.remove("body-glow");
  }, 650);
}

function initializeEvents() {
  document.addEventListener("click", (event) => {
    handleDocumentClick(event);
    triggerBodyPulse();
  });

  document.addEventListener("change", handleStatusSelectChange);
  document.addEventListener("submit", (event) => {
    if (event.target.id === "roadmapForm") {
      handleRoadmapFormSubmit(event);
    }

    if (event.target.id === "milestoneForm") {
      handleMilestoneFormSubmit(event);
    }
  });

  document.querySelectorAll(".nav-item").forEach((navButton) => {
    navButton.addEventListener("click", handleNavClick);
  });

  document
    .getElementById("newRoadmapButton")
    .addEventListener("click", () => openRoadmapModal());
  mobileMenuButton.addEventListener("click", () => toggleSidebar());
  mobileOverlay.addEventListener("click", () => toggleSidebar(false));
}

function initializeApp() {
  initializeEvents();
  renderApp();
}

initializeApp();

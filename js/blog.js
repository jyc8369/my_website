const postListEl = document.getElementById("post-list");
const postViewEl = document.getElementById("post-view");

const escapeHtml = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const parseInline = (text) => {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return out;
};

const markdownToHtml = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  let html = "";
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      continue;
    }

    if (line.startsWith("# ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h1>${parseInline(line.slice(2))}</h1>`;
      continue;
    }

    if (line.startsWith("## ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h2>${parseInline(line.slice(3))}</h2>`;
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${parseInline(line.slice(2))}</li>`;
      continue;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }
    html += `<p>${parseInline(line)}</p>`;
  }

  if (inList) {
    html += "</ul>";
  }

  return html;
};

const renderList = (posts) => {
  postViewEl.hidden = true;
  postListEl.hidden = false;

  postListEl.innerHTML = posts
    .map(
      (post) => `
      <article class="post">
        <a class="post-link" href="blog.html?post=${encodeURIComponent(post.slug)}">
          <h2>${escapeHtml(post.title)}</h2>
          <p>${escapeHtml(post.summary)}</p>
          <div class="date">${escapeHtml(post.date)}</div>
        </a>
      </article>
    `
    )
    .join("");
};

const renderPost = async (posts, slug) => {
  const post = posts.find((item) => item.slug === slug);
  if (!post) {
    renderList(posts);
    return;
  }

  const response = await fetch(post.file);
  const markdown = await response.text();

  postListEl.hidden = true;
  postViewEl.hidden = false;
  postViewEl.innerHTML = `
    <a class="back-link" href="blog.html">목록으로 돌아가기</a>
    <div class="post-article">${markdownToHtml(markdown)}</div>
  `;
};

const init = async () => {
  try {
    const response = await fetch("content/blog/posts.json");
    const posts = await response.json();
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("post");

    if (!slug) {
      renderList(posts);
      return;
    }

    await renderPost(posts, slug);
  } catch (error) {
    postListEl.hidden = false;
    postViewEl.hidden = true;
    postListEl.innerHTML = '<article class="post"><h2>블로그 로드 실패</h2><p>정적 파일을 불러오지 못했습니다. 배포 환경에서 다시 확인해 주세요.</p></article>';
  }
};

init();

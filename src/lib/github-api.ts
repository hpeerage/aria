/**
 * GitHub REST API를 사용하여 브라우저에서 직접 커밋을 생성합니다.
 */

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export async function commitFileToGitHub(
  config: GitHubConfig,
  path: string,
  content: string,
  message: string
) {
  const { token, owner, repo, branch } = config;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  console.log(`📡 GitHub API 호출 중: ${path}...`);

  try {
    // 1. 기존 파일의 SHA 조회 (업데이트를 위해 필요)
    let sha: string | undefined;
    const getRes = await fetch(`${url}?ref=${branch}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }

    // 2. 파일 커밋 (PUT)
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: btoa(unescape(encodeURIComponent(content))), // Unicode 지원 Base64 인코딩
        sha,
        branch,
      }),
    });

    if (!putRes.ok) {
      const errorData = await putRes.json();
      throw new Error(errorData.message || "GitHub API 호출 실패");
    }

    const result = await putRes.json();
    return { success: true, sha: result.content.sha };
  } catch (error) {
    console.error("❌ GitHub Sync Error:", error);
    throw error;
  }
}

import { Place } from "@/types/place";

/**
 * LocalStorage에 저장된 모든 장소 데이터를 수집하여 하나의 JSON으로 만듭니다.
 */
export function collectAllLocalData(): Place[] {
  if (typeof window === "undefined") return [];
  
  const localListStr = localStorage.getItem('aria_local_places');
  const localList = localListStr ? JSON.parse(localListStr) : [];
  
  // 리스트의 메타데이터를 기반으로 각 상세 데이터를 병합
  const fullData = localList.map((item: Place) => {
    const detail = localStorage.getItem(`aria_place_${item.id}`);
    return detail ? JSON.parse(detail) : item;
  });
  
  return fullData;
}

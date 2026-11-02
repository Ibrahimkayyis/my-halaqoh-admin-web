import { NextResponse } from "next/server";

const GITHUB_REPO_OWNER = "Ibrahimkayyis";
const GITHUB_REPO_NAME = "my_halaqoh";
const FALLBACK_DOWNLOAD_URL = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;

export const dynamic = "force-dynamic";

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubReleaseResponse {
  assets?: ReleaseAsset[];
}

export async function GET() {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "MyHalaqoh-WebAdmin",
      },
      next: {
        revalidate: 3600, // Cache response for 1 hour to optimize performance and prevent rate limiting
      },
    });

    if (!response.ok) {
      console.error(
        `[Download APK] Failed to fetch latest release from GitHub API: status ${response.status}`
      );
      return NextResponse.redirect(FALLBACK_DOWNLOAD_URL, { status: 302 });
    }

    const data = (await response.json()) as GitHubReleaseResponse;
    const apkAsset = data.assets?.find((asset) =>
      asset.name.toLowerCase().endsWith(".apk")
    );

    if (!apkAsset?.browser_download_url) {
      console.warn("[Download APK] No APK asset found in latest GitHub release.");
      return NextResponse.redirect(FALLBACK_DOWNLOAD_URL, { status: 302 });
    }

    return NextResponse.redirect(apkAsset.browser_download_url, { status: 302 });
  } catch (error) {
    console.error("[Download APK] Error redirecting to latest APK release:", error);
    return NextResponse.redirect(FALLBACK_DOWNLOAD_URL, { status: 302 });
  }
}

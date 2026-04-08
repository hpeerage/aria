import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST() {
  return new Promise((resolve) => {
    // 프로젝트 루트 경로 계산
    const projectRoot = process.cwd();
    const scriptPath = path.join(projectRoot, "scripts", "sync.sh");

    console.log("🚀 Starting GitHub Sync from Admin Console...");

    // 커밋 메시지에 관리자 콘솔에서 푸시됨을 명시
    const commitMsg = `[ARIA] auto: sync from admin console at ${new Date().toLocaleString()}`;
    
    // 쉘 스크립트 실행
    exec(`bash "${scriptPath}" "${commitMsg}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Sync Error: ${error.message}`);
        resolve(
          NextResponse.json(
            { success: false, error: error.message, details: stderr },
            { status: 500 }
          )
        );
        return;
      }

      console.log(`✅ Sync Success: ${stdout}`);
      resolve(
        NextResponse.json({
          success: true,
          message: "GitHub sync completed successfully",
          output: stdout,
        })
      );
    });
  });
}

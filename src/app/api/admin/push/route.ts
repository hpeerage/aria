import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 프로젝트 루트 및 places.json 경로 계산
    const projectRoot = process.cwd();
    const dataDirPath = path.join(projectRoot, "public", "data");
    const dataFilePath = path.join(dataDirPath, "places.json");
    
    // 디렉토리가 없으면 생성하고 파일 쓰기 수행
    await fs.mkdir(dataDirPath, { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(body, null, 2), "utf-8");
    
    console.log("💾 Updated public/data/places.json on disk.");

    const scriptPath = path.join(projectRoot, "scripts", "sync.sh");
    console.log("🚀 Starting GitHub Sync from Admin Console...");

    // 커밋 메시지에 관리자 콘솔에서 푸시됨을 명시
    const commitMsg = `[ARIA] auto: sync from admin console at ${new Date().toLocaleString()}`;
    
    return new Promise((resolve) => {
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
  } catch (err: any) {
    console.error("❌ Error writing places.json or processing request:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

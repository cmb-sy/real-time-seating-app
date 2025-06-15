// API接続設定 - 環境に応じて自動切り替え

export const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  return {
    isDevelopment,
    isProduction,
    // エンドポイント設定
    localBackend: "http://localhost:8000",
    productionMLServer: "https://real-time-seating-app-ml.vercel.app",
    // タイムアウト設定
    timeout: {
      development: 5000, // 開発環境: 5秒
      production: 15000, // 本番環境: 15秒
    },
    // リトライ設定
    retry: {
      attempts: isDevelopment ? 2 : 3,
      delay: 1000,
    },
  };
};

// API接続テスト関数
export const testApiConnection = async (
  url: string,
  timeout: number = 3000
): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${url}/api/predictions/today-tomorrow`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log(`API接続テスト失敗 (${url}):`, error);
    return false;
  }
};

// 環境に応じたAPI接続確認
export const checkApiAvailability = async () => {
  const config = getApiConfig();

  console.log("🔗 API接続の確認を開始...");

  // 1. ローカルバックエンドをテスト
  console.log("📡 ローカルバックエンド (localhost:8000) をテスト中...");
  const isLocalAvailable = await testApiConnection(config.localBackend, 3000);

  if (isLocalAvailable) {
    console.log("✅ ローカルバックエンドが利用可能です");
    return {
      isLocal: true,
      isProduction: false,
      activeEndpoint: "local",
      baseUrl: config.localBackend,
    };
  }

  // 2. 本番MLサーバーをテスト
  console.log("🌐 本番MLサーバーをテスト中...");
  const isProductionAvailable = await testApiConnection(
    config.productionMLServer,
    5000
  );

  if (isProductionAvailable) {
    console.log("✅ 本番MLサーバーが利用可能です");
    return {
      isLocal: false,
      isProduction: true,
      activeEndpoint: "production",
      baseUrl: config.productionMLServer,
    };
  }

  // 3. どちらも利用できない場合
  console.log("❌ どちらのAPIサーバーも利用できません");
  return {
    isLocal: false,
    isProduction: false,
    activeEndpoint: "unavailable",
    baseUrl: null,
  };
};

export default getApiConfig;

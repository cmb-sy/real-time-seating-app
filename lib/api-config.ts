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
    // 同一ドメインAPIエンドポイント（CORSエラー回避）
    sameOriginApi: "",
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

    const response = await fetch(`${url}/api/predictions/weekly`, {
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

  // 開発環境ではローカルバックエンドを優先的にテスト
  console.log("📡 ローカルバックエンド (localhost:8000) をテスト中...");
  const isLocalAvailable = await testApiConnection(config.localBackend, 3000);

  if (isLocalAvailable) {
    console.log("✅ ローカルバックエンドを利用");
    return {
      isLocal: true,
      isProduction: false,
      activeEndpoint: "local",
      baseUrl: config.localBackend,
    };
  } else {
    // ローカルが利用できない場合は本番MLサーバーをテスト
    console.log("📡 本番MLサーバーをテスト中...");
    const isProductionMLAvailable = await testApiConnection(
      config.productionMLServer,
      5000
    );

    if (isProductionMLAvailable) {
      console.log("✅ 本番MLサーバーを利用");
      return {
        isLocal: false,
        isProduction: true,
        activeEndpoint: "production",
        baseUrl: config.productionMLServer,
      };
    } else {
      console.log("本番環境では同一ドメインAPIエンドポイントを使用");
      // 同一ドメインのAPIは常に利用可能として扱う
      return {
        isLocal: false,
        isProduction: true,
        activeEndpoint: "same-origin",
        baseUrl: config.sameOriginApi,
      };
    }
  }
};

// バックエンドからデータが取得できているか確認する関数
export const fetchDataFromBackend = async (
  endpoint: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const apiConfig = await checkApiAvailability();
    const baseUrl = apiConfig.baseUrl;

    if (!baseUrl) {
      return {
        success: false,
        error: "利用可能なバックエンドが見つかりません",
      };
    }

    console.log(`🔍 ${baseUrl}${endpoint} からデータを取得中...`);

    const controller = new AbortController();
    const config = getApiConfig();
    const timeout = config.isProduction
      ? config.timeout.production
      : config.timeout.development;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `APIエラー: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log("✅ データ取得成功:", data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("❌ データ取得失敗:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "不明なエラーが発生しました",
    };
  }
};

export default getApiConfig;

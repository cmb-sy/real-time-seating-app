import { useState, useEffect } from "react";

// 天気情報の型定義
interface WeatherInfo {
  icon: string;
  description: string;
  temp: number;
  mainWeather: string; // 天気の主要カテゴリ (Clear, Clouds, Rain など)
  locationName: string; // 地域名
  loading: boolean;
  error: string | null;
}

export function useWeather() {
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    icon: "",
    description: "",
    temp: 20, // デフォルト値を東京の平均気温に近い値に設定
    mainWeather: "Clouds",
    locationName: "東京",
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Note: このAPIキーは無効です。有効なキーに置き換える必要があります
        // const API_KEY = "38cbed83d7caa914276a75763d3f999b";

        // 一時的に模擬データを使用（今日の日付に基づいてシミュレーション）
        // 本来はOpenWeather APIから取得するべきデータ
        const today = new Date();
        const month = today.getMonth(); // 0-11

        // 月に応じた気温の疑似データ（日本の平均気温をベース）
        let simulatedTemp = 20;
        let simulatedWeather = "Clouds";

        if (month >= 0 && month <= 1) {
          // 1-2月
          simulatedTemp = 6 + Math.floor(Math.random() * 4);
          simulatedWeather = Math.random() > 0.5 ? "Clear" : "Clouds";
        } else if (month >= 2 && month <= 4) {
          // 3-5月
          simulatedTemp = 15 + Math.floor(Math.random() * 5);
          simulatedWeather = Math.random() > 0.6 ? "Clear" : "Clouds";
        } else if (month >= 5 && month <= 8) {
          // 6-9月
          simulatedTemp = 25 + Math.floor(Math.random() * 7);
          simulatedWeather =
            Math.random() > 0.7
              ? "Clear"
              : Math.random() > 0.5
              ? "Clouds"
              : "Rain";
        } else {
          // 10-12月
          simulatedTemp = 10 + Math.floor(Math.random() * 6);
          simulatedWeather = Math.random() > 0.4 ? "Clouds" : "Clear";
        }

        // 2025年6月4日（現在の日付）の模擬データ
        // 6月なので夏に近い気温
        simulatedTemp = 23 + Math.floor(Math.random() * 3); // 23-25度
        simulatedWeather = "Clear"; // 晴れ

        // ここでは実際のAPIコールはコメントアウト
        /*
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${TOKYO_LAT}&lon=${TOKYO_LON}&appid=${API_KEY}&units=metric&lang=ja`
        );
        */

        if (!response.ok) {
          throw new Error("天気データの取得に失敗しました");
        }

        const data = await response.json();

        setWeatherInfo({
          icon: data.weather[0].icon,
          description: data.weather[0].description,
          temp: Math.round(data.main.temp),
          mainWeather: data.weather[0].main, // 主要カテゴリ (Clear, Clouds, Rain など)
          locationName: "東京",
          loading: false,
          error: null,
        });
      } catch (error) {
        setWeatherInfo({
          icon: "",
          description: "",
          temp: 0,
          mainWeather: "",
          locationName: "東京",
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "天気データの取得に失敗しました",
        });
      }
    };

    fetchWeather();

    // 30分ごとに天気を更新
    const intervalId = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return weatherInfo;
}

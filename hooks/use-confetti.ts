import { useCallback, useRef } from "react";
import confetti from "canvas-confetti";

export function useConfetti() {
  // 短時間で複数回呼び出されないようにデバウンスする
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef<boolean>(false);

  const triggerConfetti = useCallback((elementId?: string) => {
    // 既にアクティブな場合は追加のエフェクトを発生させない (パフォーマンス向上)
    if (isActiveRef.current) return;

    // パフォーマンスのためのデバウンス処理
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isActiveRef.current = true;

    // 必要最小限のパーティクルで設定
    let options: confetti.Options = {
      particleCount: 80, // 少なく
      spread: 60,
      origin: { y: 0.5, x: 0.5 },
      // 色数を減らしてメモリ使用量を削減
      colors: ["#3B82F6", "#4ADE80", "#F59E0B"],
    };

    // 要素IDが渡された場合は、その要素の位置を起点にする
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        options.origin = { x, y };
      }
    }

    confetti(options);

    // 1秒後にクールダウン
    timeoutRef.current = setTimeout(() => {
      isActiveRef.current = false;
      timeoutRef.current = null;
    }, 1000);
  }, []);

  return { triggerConfetti };
}

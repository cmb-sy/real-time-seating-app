import { useCallback } from "react";
import confetti from "canvas-confetti";

export function useConfetti() {
  const triggerConfetti = useCallback((elementId?: string) => {
    // デフォルトはビューポート中央から
    let options: confetti.Options = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5, x: 0.5 },
      colors: [
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
      ],
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
  }, []);

  return { triggerConfetti };
}

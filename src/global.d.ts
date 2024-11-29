// src/global.d.ts
declare global {
    interface Window {
      Telegram: {
        WebApp: {
          initDataUnsafe?: {
            user?: {
              id: string;
              username: string;
            };
          };
          ready: () => void;
        };
      };
    }
  }
  
  export {};
  
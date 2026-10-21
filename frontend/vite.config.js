import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Local development only: the browser talks to localhost:5173 and Vite
// forwards API calls to the backend on AWS. When the frontend is served from
// the same ECS container as the API, no proxy is needed.
const target = "https://ma-3aca3e941a6e4fddaa5f9c77c3001530.ecs.ap-southeast-2.on.aws";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "^/(health|crm|finance|itsm)": { target, changeOrigin: true, secure: true },
    },
  },
});

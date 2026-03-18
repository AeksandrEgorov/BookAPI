// Server
import { app } from "./app";

const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}, open swagger docs at http://localhost:${PORT}/api-docs`);
});
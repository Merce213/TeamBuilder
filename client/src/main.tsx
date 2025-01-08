import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Providers from "./contexts/Providers.tsx";
import "./styles/css/main.min.css";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<Providers>
			<App />
		</Providers>
	</BrowserRouter>
);

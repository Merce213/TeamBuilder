import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./styles/css/main.min.css";
import { LayoutProvider } from "./contexts/LayoutContext.tsx";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<AuthProvider>
			<LayoutProvider>
				<App />
			</LayoutProvider>
		</AuthProvider>
	</BrowserRouter>
);

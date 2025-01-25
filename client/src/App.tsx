import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layouts/Layout";
import LayoutUser from "./components/Layouts/LayoutUser";
import { ProtectedRoute } from "./components/ProtectedRoutes/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Champion from "./pages/Champion";
import Champions from "./pages/Champions";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProfileSetting from "./pages/dashboard/settings/ProfileSetting";
import Settings from "./pages/dashboard/settings/Settings";
import Home from "./pages/Home";
import About from "./pages/legal/About";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import User from "./pages/users/User";
import AccountSetting from "./pages/dashboard/settings/AccountSetting";

const App = () => {
	const { user } = useAuth();

	return (
		<>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/champions" element={<Champions />} />
					<Route path="/champions/:nameId" element={<Champion />} />

					<Route
						path="/signin"
						element={
							<ProtectedRoute
								isAllowed={!user}
								redirectPath="/dashboard/profile"
							>
								<SignIn />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/signup"
						element={
							<ProtectedRoute
								isAllowed={!user}
								redirectPath="/dashboard/profile"
							>
								<SignUp />
							</ProtectedRoute>
						}
					/>
					<Route path="/users/:userId" element={<User />} />

					{/* LEGAL */}
					<Route path="/about" element={<About />} />
					<Route path="/terms-and-conditions" element={<Terms />} />
					<Route path="/privacy-policy" element={<Privacy />} />
				</Route>

				<Route element={<LayoutUser />}>
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute isAllowed={!!user}>
								<DashboardHome />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/dashboard/settings"
						element={
							<ProtectedRoute isAllowed={!!user}>
								<Settings />
							</ProtectedRoute>
						}
					>
						<Route
							index
							element={
								<ProtectedRoute isAllowed={!!user}>
									<Navigate to="/dashboard/settings/profile" />
								</ProtectedRoute>
							}
						/>
						<Route
							path="profile"
							element={
								<ProtectedRoute isAllowed={!!user}>
									<ProfileSetting />
								</ProtectedRoute>
							}
						/>
						<Route
							path="account"
							element={
								<ProtectedRoute isAllowed={!!user}>
									<AccountSetting />
								</ProtectedRoute>
							}
						/>
					</Route>
				</Route>
			</Routes>
		</>
	);
};

export default App;

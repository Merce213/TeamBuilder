import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layouts/Layout";
import LayoutUser from "./components/Layouts/LayoutUser";
import { ProtectedRoute } from "./components/ProtectedRoutes/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import AdminGroups from "./pages/admin/AdminGroups";
import AdminMain from "./pages/admin/AdminMain";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminUsers from "./pages/admin/AdminUsers";
import ChangeForgotPassword from "./pages/auth/ChangeForgotPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Champion from "./pages/Champion";
import Champions from "./pages/Champions";
import DashboardGroup from "./pages/dashboard/DashboardGroup";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardTeam from "./pages/dashboard/DashboardTeam";
import AccountSetting from "./pages/dashboard/settings/AccountSetting";
import ProfileSetting from "./pages/dashboard/settings/ProfileSetting";
import Settings from "./pages/dashboard/settings/Settings";
import Home from "./pages/Home";
import JoinGroup from "./pages/JoinGroup";
import About from "./pages/legal/About";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import User from "./pages/users/User";
import { UserRole } from "./types/User";

const App = () => {
	const { user } = useAuth();

	return (
		<>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/champions" element={<Champions />} />
					<Route path="/champions/:nameId" element={<Champion />} />

					{/* Auth */}
					<Route
						path="/signin"
						element={
							<ProtectedRoute
								isAllowed={!user}
								redirectPath="/dashboard"
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
								redirectPath="/dashboard"
							>
								<SignUp />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/forgot-password"
						element={
							<ProtectedRoute
								isAllowed={!user}
								redirectPath="/dashboard"
							>
								<ForgotPassword />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/change-forgot-password"
						element={
							<ProtectedRoute
								isAllowed={!user}
								redirectPath="/dashboard"
							>
								<ChangeForgotPassword />
							</ProtectedRoute>
						}
					/>

					<Route path="/users/:userId" element={<User />} />

					{/* DASHBOARD ADMIN */}
					<Route
						path="/admin"
						element={
							<ProtectedRoute
								isAllowed={
									!!user && user.role === UserRole.ADMIN
								}
								redirectPath="/dashboard"
							>
								<AdminMain />
							</ProtectedRoute>
						}
					>
						<Route
							index
							element={
								<ProtectedRoute
									isAllowed={
										!!user && user.role === UserRole.ADMIN
									}
									redirectPath="/dashboard"
								>
									<Navigate to="/admin/users" />
								</ProtectedRoute>
							}
						/>
						<Route
							path="users"
							element={
								<ProtectedRoute
									isAllowed={
										!!user && user.role === UserRole.ADMIN
									}
									redirectPath="/dashboard"
								>
									<AdminUsers />
								</ProtectedRoute>
							}
						/>
						<Route
							path="groups"
							element={
								<ProtectedRoute
									isAllowed={
										!!user && user.role === UserRole.ADMIN
									}
									redirectPath="/dashboard"
								>
									<AdminGroups />
								</ProtectedRoute>
							}
						/>
						<Route
							path="teams"
							element={
								<ProtectedRoute
									isAllowed={
										!!user && user.role === UserRole.ADMIN
									}
									redirectPath="/dashboard"
								>
									<AdminTeams />
								</ProtectedRoute>
							}
						/>
					</Route>

					{/* LEGAL */}
					<Route path="/about" element={<About />} />
					<Route path="/terms-and-conditions" element={<Terms />} />
					<Route path="/privacy-policy" element={<Privacy />} />

					{/* REDIRECT */}
					<Route path="*" element={<Navigate to="/" />} />
				</Route>

				<Route element={<LayoutUser />}>
					{/* JOIN GROUP */}
					<Route
						path="/join-group/:groupId"
						element={
							<ProtectedRoute isAllowed={!!user}>
								<JoinGroup />
							</ProtectedRoute>
						}
					/>

					{/* DASHBOARD */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute isAllowed={!!user}>
								<DashboardHome />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/dashboard/group"
						element={
							<ProtectedRoute isAllowed={!!user}>
								<DashboardGroup />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/dashboard/team"
						element={
							<ProtectedRoute isAllowed={!!user}>
								<DashboardTeam />
							</ProtectedRoute>
						}
					/>

					{/* SETTINGS */}
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

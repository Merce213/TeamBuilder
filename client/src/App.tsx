import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import User from "./pages/users/User";
import Layout from "./components/Layouts/Layout";
import Test from "./pages/Test";
import LayoutUser from "./components/Layouts/LayoutUser";
import Test2 from "./pages/Test2";

const App = () => {
	return (
		<>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/signin" element={<SignIn />} />
					<Route path="/users/:userId" element={<User />} />
				</Route>
				<Route element={<LayoutUser />}>
					<Route path="/test" element={<Test />} />
					<Route path="/test2" element={<Test2 />} />
					<Route path="/profile" element={<Profile />} />
				</Route>
			</Routes>
		</>
	);
};

export default App;

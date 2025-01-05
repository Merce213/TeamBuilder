import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layouts/Layout";
import LayoutUser from "./components/Layouts/LayoutUser";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Champion from "./pages/Champion";
import Champions from "./pages/Champions";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Test from "./pages/Test";
import Test2 from "./pages/Test2";
import User from "./pages/users/User";

const App = () => {
	return (
		<>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/champions" element={<Champions />} />
					<Route path="/champions/:nameId" element={<Champion />} />
					<Route path="/signin" element={<SignIn />} />
					<Route path="/signup" element={<SignUp />} />
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

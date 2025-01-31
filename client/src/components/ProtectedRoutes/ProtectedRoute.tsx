import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
	redirectPath?: string;
	isAllowed: boolean;
	children?: React.ReactNode;
}

export const ProtectedRoute = ({
	isAllowed,
	redirectPath = "/signin",
	children,
}: ProtectedRouteProps) => {
	const location = useLocation();
	if (!isAllowed) {
		return (
			<Navigate
				to={redirectPath}
				replace
				state={{ path: location.pathname }}
			/>
		);
	}

	return children ? children : <Outlet />;
};

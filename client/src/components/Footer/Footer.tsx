import { Link } from "react-router-dom";
import X from "../../assets/social-x.png";

const Footer = () => {
	return (
		<footer className="bg-gray border-t border-gray-light-3">
			<div className="container px-3 py-4">
				<div className="flex justify-between items-center">
					<div>
						<p className="text-sm font-semibold">
							&copy; 2025 TeamBuilder Lol
						</p>
					</div>
					<div>
						<div className="flex items-center">
							<Link to={"#"}>
								<img
									src={X}
									alt="X"
									className="w-5 h-5"
									loading="lazy"
								/>
							</Link>
						</div>
					</div>
					<div className="flex flex-col  gap-2">
						<Link to={"/about"}>
							<p className="text-sm font-semibold hover:text-primary">
								About
							</p>
						</Link>
						<Link to={"/terms-and-conditions"}>
							<p className="text-sm font-semibold hover:text-primary">
								Terms and Conditions
							</p>
						</Link>
						<Link to={"/privacy-policy"}>
							<p className="text-sm font-semibold hover:text-primary">
								Privacy Policy
							</p>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

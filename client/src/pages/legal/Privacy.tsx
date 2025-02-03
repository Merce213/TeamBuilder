const Privacy = () => {
	return (
		<div className="container mt-16 py-6 flex flex-col items-center min-h-navbar">
			<div className="flex flex-col gap-2 items-center">
				<h1 className="text-4xl font-sora font-bold text-center">
					Privacy Policy
				</h1>
				<p>Updated: 12/01/2025</p>
			</div>

			<div className="mt-8 flex flex-col justify-center gap-6 max-w-4xl">
				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Introduction</h2>
					<p>
						At TeamBuilder Lol, we respect your privacy and are
						committed to protecting your personal data. This privacy
						policy outlines how we collect, use, and safeguard your
						personal information.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">
						Information We Collect
					</h2>
					<p>
						We collect various types of information to provide and
						improve our services:
					</p>
					<ul>
						<li>
							Personal Information: Name, email address, player
							informations.
						</li>
						<li>
							Browsing Data: Information about your device, your
							browser.
						</li>
						<li>Game Preferences: Favorite champions, roles.</li>
					</ul>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">
						How We Use Your Information
					</h2>
					<p>We use your information to:</p>
					<ul>
						<li>Provide and improve our services.</li>
						<li>
							Send you communications related to your account or
							our services.
						</li>
					</ul>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">
						Sharing Your Information
					</h2>
					<p>
						We do not sell or rent your personal information to
						third parties. We may share your information in the
						following situations:
					</p>
					<ul>
						<li>
							If required by law or in the event of a violation of
							our terms of use.
						</li>
					</ul>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Data Security</h2>
					<p>
						We implement security measures to protect your personal
						information from loss, misuse, unauthorized access,
						disclosure, alteration, or destruction.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Your Rights</h2>
					<p>
						In accordance with data protection laws, you have the
						right to:
					</p>
					<ul>
						<li>Access your personal information.</li>
						<li>
							Request the correction of any inaccurate
							information.
						</li>
						<li>
							Request the deletion of your data under certain
							conditions.
						</li>
					</ul>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">
						Intellectual Property
					</h2>
					<p>
						All elements of the site, including texts, images,
						videos, sounds, as well as logos, trademarks, software,
						are the exclusive property of TeamBuilder or its
						partners. Any reproduction, representation, adaptation,
						modification, distribution, dissemination, or use of
						these elements, in whole or in part, in any form
						whatsoever, is prohibited without the prior written
						consent of TeamBuilder.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Cookies</h2>
					<p>
						We use cookies to enable you to log in and retain your
						login information. These cookies are strictly necessary
						for the functionality of the site and are not used for
						advertising purposes.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">
						Changes to the Privacy Policy
					</h2>
					<p>
						We may update this privacy policy at any time. Changes
						will be posted on this page with the update date.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Disclaimer</h2>
					<p>
						The compositions and strategies proposed on this site
						are for informational purposes only and do not guarantee
						in-game results.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Contact</h2>
					<p>
						If you have any questions regarding our privacy policy
						or wish to exercise your rights, please contact us at{" "}
						<a
							className="font-semibold underline"
							href="mailto:contact@teambuilder.com"
						>
							contact@teambuilder.com
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Privacy;

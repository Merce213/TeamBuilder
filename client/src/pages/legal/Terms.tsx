const Terms = () => {
	return (
		<div className="container mt-16 py-6 flex flex-col items-center min-h-navbar">
			<div className="flex flex-col gap-2 items-center">
				<h1 className="text-4xl font-sora font-bold text-center">
					Terms of Use
				</h1>
				<p>Updated: 12/01/2025</p>
			</div>

			<div className="mt-8 flex flex-col justify-center gap-6 max-w-4xl">
				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Introduction</h2>
					<p>
						Welcome to TeamBuilder Lol. By accessing and using this
						website, you agree to comply with these terms of use. If
						you do not agree with these terms, please do not use
						this site.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Purpose</h2>
					<p>
						This website provides information for the game League Of
						Legends to its users. It is intended for personal,
						non-commercial use, and you agree to use the site in
						accordance with applicable laws and regulations.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Site Access</h2>
					<p>
						Access to certain parts of the site may require
						registration. You agree to provide accurate and
						up-to-date information during your registration and to
						maintain the confidentiality of your account
						information. You are responsible for all activities that
						occur under your account.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">
						Intellectual Property
					</h2>
					<p>
						All content on the site (texts, images, logos, graphics,
						videos, etc.) is protected by intellectual property
						rights. You agree not to copy, reproduce, distribute, or
						use the content for commercial purposes without the
						prior authorization of the site owner.
					</p>
					<p>
						Names, images, and trademarks related to League of
						Legends are the property of Riot Games, Inc. and are
						used for informational purposes.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">User Contributions</h2>
					<p>
						You may submit content to the site, such as team
						compositions, champions, and other information. By
						submitting such content, you grant us a non-exclusive,
						royalty-free, perpetual license to use, reproduce,
						modify, and distribute your submitted content on the
						site.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Site Usage</h2>
					<p>
						You agree not to misuse or use this site illegally,
						including:
					</p>
					<ul>
						<li>
							Spreading viruses or other harmful technologies.
						</li>
						<li>
							Violating the intellectual property rights of
							others.
						</li>
						<li>Disrupting the operation of the site.</li>
					</ul>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">
						Links to External Sites
					</h2>
					<p>
						The site may contain links to third-party sites. We are
						not responsible for the content of these external sites,
						and their inclusion does not imply that we endorse their
						content.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">
						Limitation of Liability
					</h2>
					<p>
						We strive to ensure that the site operates correctly,
						but we cannot guarantee that it will always be
						error-free, free of outages, or viruses. In no event
						shall we be liable for direct or indirect damages
						arising from the use or inability to use this site.
					</p>
					<p>
						We are not responsible for in-game results obtained
						using our site. We strive to provide accurate and
						up-to-date information about the game and players, but
						we do not guarantee the accuracy, completeness, or
						reliability of the information provided.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Disclaimer</h2>
					<p>
						We are not affiliated with Riot Games, Inc. or League of
						Legends. This site is a personal and independent
						project.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Your Rights</h2>
					<p>
						You have the right to access, rectify, and delete your
						personal data. You can also object to their processing
						in certain circumstances. To exercise these rights,
						please contact us at the address provided on our site.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">
						Changes to the Terms of Use
					</h2>
					<p>
						We reserve the right to modify these terms of use at any
						time. Any changes will be posted on this page and will
						take effect immediately upon publication.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Governing Law</h2>
					<p>
						These terms are governed by the laws of France in
						accordance with the European Union, without regard to
						its conflict of law principles.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">Contact Us</h2>
					<p>
						If you have any questions or concerns about these terms
						of use, please contact us at{" "}
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

export default Terms;

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanExpiredTokens() {
	try {
		const result = await prisma.token.deleteMany({
			where: {
				expiresAt: {
					lt: new Date(),
				},
			},
		});
		console.log("Results expired tokens:", result);
		console.log(`Deleted ${result.count} expired tokens`);
	} catch (error) {
		console.error("Error while cleaning expired tokens:", error);
	} finally {
		await prisma.$disconnect();
	}
}

async function cleanExpiredSessions() {
	try {
		const result = await prisma.session.deleteMany({
			where: {
				expiresAt: {
					lt: new Date(),
				},
			},
		});
		console.log("Results expired sessions:", result);
		console.log(`Deleted ${result.count} expired sessions`);
	} catch (error) {
		console.error("Error while cleaning expired sessions:", error);
	} finally {
		await prisma.$disconnect();
	}
}

cleanExpiredSessions();
cleanExpiredTokens();

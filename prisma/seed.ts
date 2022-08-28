import { PrismaClient } from "@prisma/client";

(async () => {
	const prisma = new PrismaClient();

	await prisma.post.create({
		data: {
			slug: "hello-world",
			title: "Hello World",
			content: "Welcome to your new world",
			published: true,

			categories: {
				create: {
					name: "hello",
				},
			},
		},
	});
})();

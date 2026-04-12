import { prisma } from "../lib/prisma";

const updateRoles = async () => {
    console.log("Updating user roles for testing...");
    
    const users = await prisma.user.findMany({ take: 10 });
    
    if (users.length < 5) {
        console.log("Not enough users to distribute roles. Please run seed:data first.");
        return;
    }

    const roles = ["ADMIN", "STUDENT", "MANAGER", "VENDOR", "ORGANIZER"];
    const limit = Math.min(users.length, roles.length);
    
    for (let i = 0; i < limit; i++) {
        const user = users[i];
        const role = roles[i];

        if (user && role) {
            await prisma.user.update({
                where: { id: user.id },
                data: { role: role as any }
            });
            console.log(`Updated ${user.email} to ${role}`);
        }
    }

    console.log("Roles updated successfully!");
};

updateRoles()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

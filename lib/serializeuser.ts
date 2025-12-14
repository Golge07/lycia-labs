export function serializeUser(user: any) {
    if (!user) return null;

    return {
        ...user,
        createdAt: user.createdAt?.toISOString?.() || user.createdAt,
        updatedAt: user.updatedAt?.toISOString?.() || user.updatedAt,
    };
}
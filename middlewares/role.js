function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied' });
        }
        next();
    };
}

export default roleMiddleware;

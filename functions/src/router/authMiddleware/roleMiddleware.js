const allowedUsers = (permissions) =>{
  return (req, res, next)=>{
    const userRole = req.headers.role;
    if (permissions.includes(userRole)) {
      next();
    } else {
      return res.status(401).send('Not allowed No permission');
    }
  };
};


module.exports = {
  allowedUsers,
};

import jwt from 'jsonwebtoken';

export function bearerTokenCheck(req, res, next) {
  let token = req.header('Authorization');
  if (!token) return res.status(401).send("Access Denied");
  
  try {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    /*if( verified.user_type_id === 2 ){ // Check authorization, 2 = Customer, 1 = Admin
      let req_url = req.baseUrl+req.route.path;
      if(req_url.includes("users/:id") && parseInt(req.params.id) !== verified.id){
        return res.status(401).send("Unauthorized!");
      }
    }*/
    req.user = verified;
    next();
  }
  catch (err) {
    res.status(400).send("Invalid Token");
  }
}

export function firebaseTokenCheck() {

}
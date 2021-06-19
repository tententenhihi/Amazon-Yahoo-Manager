import { SECRET_KEY } from '../configs/settings';

class PassportSerive {
    static init() {
        var passport = require('passport');
        var passportJWT = require('passport-jwt');
        var ExtractJwt = passportJWT.ExtractJwt;
        var JwtStrategy = passportJWT.Strategy;
        var jwtOptions = {};

        jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        jwtOptions.secretOrKey = SECRET_KEY;
        var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
            if (jwt_payload) {
                next(null, jwt_payload);
            } else {
                next(null, false);
            }
        });
        passport.use(strategy);
        return passport;
    }
}

export default PassportSerive;

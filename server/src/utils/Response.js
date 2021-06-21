class Response {
    constructor(res) {
        this.res = res;
    }

    success200(data) {
        return this.res.status(200).json({
            ...data
        });
    }

    error500(error) {
        return this.res.status(500).json({
            message: error.message,
            type: 'Server Error 500'
        });
    }

    error400(data) {
        return this.res.status(400).json({
            ...data,
            type: 'Bad Request 400'
        });
    }

    error401() {
        return this.res.status(401).json({ type: 'UnAuthorized 401' });
    }

    error404(data) {
        return this.res.status(404).json({ ...data, type: '404 Not Found' });
    }

    existed409(data) {
        return this.res.status(409).json({ ...data, type: 'Existed 409' });
    }
}

export default Response;
